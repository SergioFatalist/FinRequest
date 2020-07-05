<?php
/**
 * Created by PhpStorm.
 * User: sergio
 * Date: 23.10.14
 * Time: 02:34
 */

namespace FR\Requests;


use FR\Core\CoreMailer;

class RequestMailer extends CoreMailer {

	public function processMail($request) {
		$db = $this->app->getDB();
		$helper = new RequestHelper();
		$author = $this->getUser($request->author_id);
		$user = $this->app->getPrincipal();
		$status_name = $helper->getStatusName($request->status);
		$params = array(
			'user_name' => $author->name,
			'request_id' => $request->id,
			'request_pl' => $this->getCategory($request->p_l),
			'request_category' => $this->getCategory($request->category_id),
			'request_company' => $this->getCompany($request->company_id),
			'request_contractor' => $this->getContractor($request->contractor),
			'request_description' => $request->description,
			'request_amount' => $request->amount,
			'URL' => $this->app->getConfig('url'),
			'admin_email' => $this->app->getConfig('admin_email'),
		);
		$rcpt = array();
		$template = '';

		if ($status_name == 'created') {
			$template = 'request_created';
			$rcpt = array();
			$rcpt[] = $author->email;
			$params['user_name'] = $author->name;
			$message = $this->readTemplate($template);
			$message = $this->parseTemplate($message, $params);
			$this->sendMail($rcpt, 'FINREQUEST - Новая заявка ' . $request->id, $message);
		} else if (strpos($status_name, 'declined')) {
			$template = 'request_declined';
			$params['user_name'] = $author->name;
			$params['user_declined'] = $user->name;
			$params['reason'] = $request->reason;
			$rcpt = array();
			$rcpt[] = $author->email;
			$message = $this->readTemplate($template);
			$message = $this->parseTemplate($message, $params);
			$this->sendMail($rcpt, 'FINREQUEST - Заявка отклонена ' . $request->id, $message);
			return;
		}

		$rcpt = array();
		if ($status_name == 'created' || strpos($status_name, 'approved')) {
			$template = 'request_alert';
			$next_status_name = $helper->getStatusName($helper->getNextStatus($request->status));
			list($group_name, $approving) = explode('_', $next_status_name);
			switch($group_name) {
				case 'manager':
					$manager = $this->getUser($author->master_id);
					$rcpt[] = $manager->email;
					$params['manager_name'] = $manager->name;
					break;
				case 'curator':
					$sql = 'SELECT DISTINCT n.curator_id AS curator_id FROM nets n, points p, requests_points rp WHERE n.id = p.net_id AND p.id = rp.point_id AND rp.request_id = ' . $request->id;
					$result = $db->query($sql);
					$data = $result->fetchAll();
					if (count($data) > 1) {
						$curator = $this->getUser($this->app->getConfig('complex_id'));
					} else {
						$curator = $this->getUser($data[0]->curator_id);
					}
					$rcpt[] = $curator->email;
					$params['manager_name'] = $curator->name;
					break;
				case 'coo':
					$sql = 'SELECT DISTINCT n.chief_operating_officer_id AS coo_id FROM nets n, points p, requests_points rp WHERE n.id = p.net_id AND p.id = rp.point_id AND rp.request_id = ' . $request->id;
					$result = $db->query($sql);
					$data = $result->fetchAll();
					if (count($data) > 1) {
						$curator = $this->getUser($this->app->getConfig('coo_id'));
					} else {
						$curator = $this->getUser($data[0]->coo_id);
					}
					$rcpt[] = $curator->email;
					$params['manager_name'] = $curator->name;
					break;
				case 'security':
					$sql = "SELECT u.email FROM users u LEFT JOIN groups g ON u.group_id = g.id WHERE g.sysname = 'security'";
					$result = $db->query($sql);
					$data = $result->fetchAll();
					foreach ($data as $row) {
						$rcpt[] = $row->email;
					}
					$params['manager_name'] = 'Специалист СБ';
					break;
				case 'ceo':
					$sql = "SELECT u.email FROM users u LEFT JOIN groups g ON u.group_id = g.id WHERE g.sysname = 'finance'";
					$result = $db->query($sql);
					$data = $result->fetchAll();
					foreach ($data as $row) {
						$rcpt[] = $row->email;
					}
					$params['manager_name'] = 'Финансовый руководитель';
					break;
				case 'finance':
					return;
			}
			$message = $this->readTemplate($template);
			$message = $this->parseTemplate($message, $params);
			$this->sendMail($rcpt, 'FINREQUEST - Утвердить заявку ' . $request->id, $message);
		} else if ($status_name == 'paid') {
			return;
		}

	}

	private function getCategory($id) {
		return $this->getNameFromTableById('categories', $id);
	}

	private function getCompany($id) {
		return $this->getNameFromTableById('companies', $id);
	}

	private function getContractor($id) {
		return $this->getNameFromTableById('contractors', $id);
	}

	private function getUser($id) {
		$db = $this->app->getDB();
		$sql = 'SELECT * FROM users WHERE id = ' . $id;
		$result = $db->query($sql);
		$data = $result->fetch();

		return $data;
	}

	private function getNameFromTableById($table, $id) {

		$db = $this->app->getDB();
		$sql = 'SELECT name FROM ' . $table. ' WHERE id = ' . $id;
		$result = $db->query($sql);
		$data = $result->fetch();

		return $data->name;
	}
}