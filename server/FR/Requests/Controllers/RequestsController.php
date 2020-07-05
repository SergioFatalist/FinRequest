<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 25.06.14
 * Time: 19:12
 */

namespace FR\Requests\Controllers;

use FR\Application;
use FR\Auth\PrincipalService;
use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;
use FR\Requests\RequestHelper;
use FR\Requests\RequestLogger;
use FR\Requests\RequestMailer;
use FR\Requests\RequestQueryBuilder;

class RequestsController extends CoreController {

	/**
	 * @var string
	 */
	protected $root = 'requests';

	/**
	 * @var RequestLogger
	 */
	protected $logger;

	protected function init() {
		parent::init();

		$this->logger = new RequestLogger();
	}

	public function listAction() {

		$helper = new RequestHelper();
		$ps = new PrincipalService();
		$builder = new RequestQueryBuilder();
		$query = $builder->buildRequestsListQuery();
		$result = $this->query($query['sql'], $query['params']);
		$rows = $result->fetchAll();

		$response = new JsonResponse();
		$response->total = count($rows);
		$response->amount = 0;
		foreach ($rows as $row) {
			$response->amount += $row->amount;
		}

		$query = $builder->buildRequestsListQuery(true);
		$result = $this->query($query['sql'], $query['params']);
		$rows = $result->fetchAll();
		$data = array();
		foreach($rows as $row) {
			$row->allow_approve = $helper->checkApprove($row);
			$row->allow_edit = $ps->checkAccess('requests', 'update');

			if ($ps->checkAccess('budgets', 'read')) {
				unset($parms);
				unset($infos);
				unset($net_ids);
				// Get allowed for bubgets
				$sql = "SELECT DISTINCT points.net_id, nets.name, requests.category_id, budgets_data.allowed
						FROM requests, requests_points, budgets, budgets_data, points, nets
						WHERE requests.id = :request_id
						AND requests_points.request_id = requests.id
						AND points.id = requests_points.point_id
						AND points.net_id = nets.id
						AND budgets.month = DATE_FORMAT(requests.dt_created, '%Y%m')
						AND budgets.target_id = points.net_id
						AND budgets_data.budget_id = budgets.id
						AND budgets_data.category_id = requests.category_id";
				$params = array(
					':request_id' => $row->id
				);
				$result = $this->query($sql, $params);
				$allowedRows = $result->fetchAll();
				$net_ids = array();
				$category_id = false;
				foreach($allowedRows as $allowedRow) {
					$net_ids[] = $allowedRow->net_id;
					$category_id = $allowedRow->category_id;
					$infos[] = array(
						'net_id' => $allowedRow->net_id,
						'category_id' => $allowedRow->category_id,
						'net_name' => $allowedRow->name,
						'allowed' => round($allowedRow->allowed, 2)
					);
				}

				if ($category_id && $net_ids) {
					// Get payed request amounts
					$sql = "SELECT DISTINCT points.net_id, requests.category_id, SUM(requests_points.amount) as amount
							FROM requests, requests_points, points
							WHERE requests.category_id = :category_id
							AND DATE_FORMAT(requests.dt_created, '%Y%m') = DATE_FORMAT(:dt_created, '%Y%m')
							AND requests_points.request_id = requests.id
							AND points.id = requests_points.point_id
							AND points.net_id IN (". join(',', $net_ids) .")
							AND requests.status = 10
							GROUP BY points.net_id;";
					$params = array(
						':category_id' => $category_id,
						':dt_created' => $row->dt_created
					);
					$result = $this->query($sql, $params);
					$payedRows = $result->fetchAll();

					if (count($payedRows) > 0) {
						foreach ($payedRows as $payedRow) {
							$i = 0;
							while ($i < count($infos)) {
								if ($infos[$i]['net_id'] == $payedRow->net_id && $infos[$i]['category_id'] == $payedRow->category_id) {
									$infos[$i]['used'] = round($payedRow->amount, 2);
								}
								$i++;
							}
						}
					}

					// Get in use request amounts
					$sql = "SELECT DISTINCT points.net_id, requests.category_id, SUM(requests_points.amount) as amount
							FROM requests, requests_points, points
							WHERE requests.category_id = :category_id
							AND DATE_FORMAT(requests.dt_created, '%Y%m') = DATE_FORMAT(:dt_created, '%Y%m')
							AND requests_points.request_id = requests.id
							AND points.id = requests_points.point_id
							AND points.net_id IN (". join(',', $net_ids) .")
							AND requests.status IN (1, 2, 4, 6, 8, 12, 14)
							GROUP BY points.net_id";
					$params = array(
						':category_id' => $category_id,
						':dt_created' => $row->dt_created
					);
					$result = $this->query($sql, $params);
					$inUseRows = $result->fetchAll();

					if (count($inUseRows) > 0) {
						foreach($inUseRows as $inUseRow) {
							$i = 0;
							while ($i < count($infos)) {
								if ($infos[$i]['net_id'] == $inUseRow->net_id && $infos[$i]['category_id'] == $inUseRow->category_id) {
									$infos[$i]['in_progress'] = round($inUseRow->amount, 2);
								}
								$i++;
							}
						}
					}
					$row->budget_info = $infos;
				}
			}

			$data[] = $row;
		}
		$response->success = true;
		$response->setData($this->root, $data);

		echo $response;
	}

	public function mylistAction() {

		$helper = new RequestHelper();
		$principal = $this->app->getPrincipal();
		$ps = new PrincipalService();

		$builder = new RequestQueryBuilder();
		$query = $builder->buildMyRequestsListQuery();
		$result = $this->query($query['sql'], $query['params']);
		$rows = $result->fetchAll();
		$response = new JsonResponse();
		$response->total = count($rows);
		$response->amount = 0;
		foreach ($rows as $row) {
			$response->amount += $row->amount;
		}

		$query = $builder->buildMyRequestsListQuery(true);
		$result = $this->query($query['sql'], $query['params']);
		$rows = $result->fetchAll();
		$data = array();
		foreach($rows as $row) {
			$row->allow_approve = $helper->checkApprove($row);
			if ($row->author_id == $principal->id && $row->status == $helper->getStatusId('created')) {
				$row->allow_edit = 1;
			} else {
				$row->allow_edit = $ps->checkAccess('requests', 'update');
			}
			$data[] = $row;
		}
		$response->success = true;
		$response->setData($this->root, $data);

		echo $response;
	}

	public function createAction() {

		$helper = new RequestHelper();
		$mailer = new RequestMailer();

		$request = $this->decodeData($this->root);
		$request->author_id = Application::getInstance()->getPrincipal()->id;
		$request->status = $helper->getStatusId('created');

		$points = $this->decodeData('points');

		$sql = 'SELECT payment_type FROM companies WHERE id = :id';
		$params = array(':id' => $request->company_id);
		$result = $this->query($sql, $params);
		$payment_type = $result->fetch()->payment_type;


		// Создание заявки
		$sql = 'INSERT INTO requests (dt_created, company_id, dt_payment, order_no, payment_type, p_l, category_id, dt_changed, status, contractor, description, author_id, request_type)
				VALUES (NOW(), :company_id, :dt_payment, :order_no, :payment_type, :p_l, :category_id, NOW(), :status, :contractor, :description, :author_id, :request_type)';
		$params = array(
			':company_id' => $request->company_id,
			':dt_payment' => $request->dt_payment ? $request->dt_payment : '0000-00-00 00:00:00',
			':order_no' => $request->order_no,
			':payment_type' => $payment_type,
			':p_l' => $request->p_l,
			':category_id' => $request->category_id,
			':status' => $request->status,
			':contractor' => $request->contractor,
			':description' => $request->description,
			':author_id' => $request->author_id,
			':request_type' => $request->request_type,
		);
		$this->query($sql, $params);
		$request->id = $this->db->lastInsertId();
		$this->logger->logRequest('+СОЗДАНИЕ ЗАЯВКИ', $request);

		// Создание точек заявки
		$sql = 'INSERT INTO requests_points (request_id, point_id, amount) VALUES ';
		$params = array();
		$i = $amount = 0;
		foreach ($points as $point) {
			$sql .= $i ? ', ' : '';
			$sql .= ' (:request_id'.$i.', :point_id'.$i.', :amount'.$i.')';
			$params[':request_id'.$i] = $request->id;
			$params[':point_id'.$i] = $point->point_id;
			$params[':amount'.$i] = $point->amount;
			$amount += $point->amount;
			$i++;
		}
		$this->query($sql, $params);
		$this->logger->logPoints('+СОЗДАНИЕ ТОЧЕК', $request, $points);

		// Подсчет заявки на основании суммы точек
		$sql = 'UPDATE requests SET amount = :amount WHERE id = :id';
		$params = array(
			':amount' => $amount,
			':id' => $request->id
		);
		$this->query($sql, $params);
		$request->amount = $amount;
		$this->logger->logRequest('+ОБНОВЛЕНИЕ ЗАЯВКИ', $request);

		// Процессинг правил для заявок
		$request = $helper->processingRules($request);
		$sql = 'UPDATE requests SET status = :status WHERE id = :id';
		$params = array(
			':status' => $request->status,
			':id' => $request->id
		);
		$this->query($sql, $params);
		$rules_list = '';
		if (isset($request->rules) && is_array($request->rules)) {
			$rules_list = ' (' . implode(', ', $request->rules) . ')';
		}
		$this->logger->logRequest('+ПРОЦЕССИНГ ЗАЯВКИ' . $rules_list, $request);

		$sql = 'SELECT * FROM (
				SELECT count(*) as nets_count, r.* FROM (
				SELECT requests.id, requests.dt_created, requests.company_id, points.net_id, points.id AS point_id,
				requests.dt_payment, requests.order_no, requests.payment_type, requests.amount, requests.p_l, requests.category_id,
				requests.description, requests.author_id, requests.status, requests.contractor, requests.request_type,
				authors.name as requester, authors.group_id as requester_level, authors.master_id,
				nets.curator_id as net_curator_id, nets.chief_operating_officer_id as net_chief_operating_officer_id,
				1 as allow_edit
				FROM requests, requests_points, contractors, users as authors, nets, points
				WHERE authors.id = requests.author_id
				AND contractors.id = requests.contractor
				AND requests_points.request_id = requests.id
				AND points.id = requests_points.point_id
				AND nets.id = points.net_id
				AND requests.id = :request_id
				GROUP BY requests.id, points.net_id) AS r
				GROUP BY r.id) AS a';
		$params = array(
			':request_id' => (int) $request->id
		);
		$result = $this->query($sql, $params);
		$row = $result->fetch();
		$row->reason = '';
		$mailer->processMail($row);

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $row);

		echo $response;
	}

	public function updateAction() {

		$helper = new RequestHelper();
		$mailer = new RequestMailer();
		$principal = Application::getInstance()->getPrincipal();
		$processed_ids = array();
		$requests = $this->decodeData($this->root);

		if (!is_array($requests)) {
			$request = $requests;
			$request->rules = array();
			$points = $this->decodeData('points');

			if (!is_array($points)) {
				$points = array($points);
			}

			$update_ids = array();
			$sql = 'UPDATE requests_points SET request_id = :request_id, point_id = :point_id, point_status = :point_status, amount = :amount WHERE id = :id';
			$update_points = array();
			foreach($points as $point) {
				if ($point->id != 0) {
					$update_ids[] = $point->id;
					$update_points[] = $point;
					$params = array(
						':request_id' => (int) $request->id,
						':point_id' => (int) $point->point_id,
						':point_status' => (int) $point->point_status,
						':amount' => $point->amount,
						':id' => (int) $point->id,
					);
					$this->query($sql, $params);
				}
			}
			$this->logger->logPoints('+ОБНОВЛЕНИЕ ТОЧЕК', $request, $update_points);

			$sql = 'SELECT * FROM requests_points WHERE id NOT IN (' .join(',', $update_ids). ') AND request_id = ' . $request->id;
			$result = $this->query($sql);
			$delete_points = $result->fetchAll();
			$this->logger->logPoints('+УДАЛЕНИЕ ТОЧЕК', $request, $delete_points);

			$sql = 'DELETE FROM requests_points WHERE id NOT IN (' .join(',', $update_ids). ') AND request_id = ' . $request->id;
			$this->query($sql);

			$sql = 'INSERT INTO requests_points (request_id, point_id, point_status, amount) VALUES (:request_id, :point_id, :point_status, :amount)';
			$create_points = array();
			foreach($points as $point) {
				if ($point->id == 0) {
					$create_points[] = $point;
					$params = array(
						':request_id' => (int) $request->id,
						':point_id' => (int) $point->point_id,
						':point_status' => (int) $point->point_status,
						':amount' => $point->amount
					);
					$this->query($sql, $params);

				}
			}
			$this->logger->logPoints('+СОЗДАНИЕ ТОЧЕК', $request, $create_points);

			$dt_payment = str_replace('T', ' ', $request->dt_payment);
			/*
			 * Если есть параметр утверждения, присваиваем статус "утверждена/отклонена" группой пользователя
			 */
			$status = (int) $request->status;
			if (isset($_POST['approving']) && $_POST['approving'] != 'false') {
				$approving_state = $_POST['approving'];
				$principal_group_name = $helper->getGroupName($principal->group_id);
				$status = $helper->getStatusId($principal_group_name . '_' . $approving_state);

				if ($status !== null) {
					/*
					 * Проверяем, если следующий статус "Оплачено", значит присваиваем его, иначе оставляем как есть
					 */
					if ($approving_state == 'approved') {
						$next_status = $helper->getNextStatus((int)$request->status);
						$next_status_name = $helper->getStatusName($next_status);
						if ($next_status_name == 'paid') {
							$status = $next_status;
							/*
							 * Если заявка не имеет даты оплаты - устанавливаем текущую
							 */
							if ($dt_payment === '') {
								$date = new \DateTime();
								$dt_payment = $date->format('Y-m-d H:i:s');
							}
						}
						$this->logger->logRequest('-УТВЕРЖДЕНИЕ ЗАЯВКИ', $request);
					} else {
						$request->reason = $this->requestField('decline_comment', 'Причина не указана');
						$this->logger->logRequest('-ОТКЛОНЕНИЕ ЗАЯВКИ', $request);
					}
					$request->status = $status;
					$mailer->processMail($request);
				}
			}
			$request = $helper->processingRules($request);

			$rules_list = '';
			if (isset($request->rules) && is_array($request->rules)) {
				$rules_list = ' (' . implode(', ', $request->rules) . ')';
			}
			$this->logger->logRequest('-ПРОЦЕССИНГ ЗАЯВКИ' . $rules_list, $request);

			$sql = 'UPDATE requests SET company_id = :company_id, dt_payment = :dt_payment, order_no = :order_no, payment_type = :payment_type, amount = :amount,
					p_l = :p_l, category_id = :category_id, status = :status, contractor = :contractor, description = :description, dt_changed = NOW()
					WHERE id = :id';
			$params = array(
				':company_id' => (int) $request->company_id,
				':dt_payment' => $dt_payment ? $dt_payment : '0000-00-00 00:00:00',
				':order_no' => $request->order_no,
				':payment_type' => (int) $request->payment_type,
				':amount' => $request->amount,
				':p_l' => (int) $request->p_l,
				':category_id' => (int) $request->category_id,
				':status' => $request->status,
				':contractor' => (int) $request->contractor,
				':description' => $request->description,
				':id' => (int) $request->id,
			);
			$this->query($sql, $params);
			$this->logger->logRequest('+ОБНОВЛЕНИЕ ЗАЯВКИ', $request);

			$processed_ids[] = $request->id;

		} else {
			foreach($requests as $request) {
				$approving = $this->requestField('approving', 'false');
				if ($approving != 'false') {
					if ($approving == 'approved') {
						$this->logger->logRequest('-УТВЕРЖДЕНИЕ ГРУППЫ', $request);
						$request = $helper->processingRules($request);
						$this->logger->logRequest('-ПРОЦЕССИНГ ЗАЯВКИ', $request);
					} else {
						$request->reason = $this->requestField('decline_comment', 'Причина не указана');
						$this->logger->logRequest('-ОТКЛОНЕНИЕ ГРУППЫ', $request->reason);
					}
				}

				$sql = 'UPDATE requests SET company_id = :company_id, dt_payment = :dt_payment, order_no = :order_no, payment_type = :payment_type, amount = :amount,
					p_l = :p_l, category_id = :category_id, status = :status, contractor = :contractor, description = :description, dt_changed = NOW()
					WHERE id = :id';
				$params = array(
					':company_id' => (int) $request->company_id,
					':dt_payment' => $request->dt_payment ? $request->dt_payment : '0000-00-00 00:00:00',
					':order_no' => $request->order_no,
					':payment_type' => (int) $request->payment_type,
					':amount' => $request->amount,
					':p_l' => (int) $request->p_l,
					':category_id' => (int) $request->category_id,
					':status' => $request->status,
					':contractor' => (int) $request->contractor,
					':description' => $request->description,
					':id' => (int) $request->id,
				);
				$this->query($sql, $params);
				$this->logger->logRequest(' +ОБНОВЛЕНИЕ ЗАЯВКИ', $request);
				$mailer->processMail($request);
				$processed_ids[] = $request->id;
			}
		}

		$sql = 'SELECT * FROM (
				SELECT count(*) as nets_count, r.* FROM (
					SELECT requests.id, requests.dt_created, requests.company_id, points.net_id, points.id AS point_id,
						requests.dt_payment, requests.order_no, requests.payment_type, requests.amount, requests.p_l, requests.category_id,
						requests.description, requests.author_id, requests.status, requests.contractor, requests.request_type,
						authors.name as requester, authors.group_id as requester_level, authors.master_id,
						nets.curator_id as net_curator_id, nets.chief_operating_officer_id as net_chief_operating_officer_id,
						1 as allow_edit
					FROM requests, requests_points, contractors, users as authors, nets, points
					WHERE authors.id = requests.author_id
						AND contractors.id = requests.contractor
						AND requests_points.request_id = requests.id
						AND points.id = requests_points.point_id
						AND nets.id = points.net_id
						AND requests.id IN (' . join(',', $processed_ids) . ')
					GROUP BY requests.id, points.net_id
				) AS r GROUP BY r.id
			) AS a';

		$result = $this->query($sql);
		$data= $result->fetchAll();

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $data);
		$response->total = count($data);

		echo $response;
	}

	public function nextStatusAction() {

		$helper = new RequestHelper();
		$principal = Application::getInstance()->getPrincipal();

		$approving = $this->requestField('approving');
		$request_id = $this->requestField('request_id');

		$sql = 'SELECT * FROM requests WHERE id = :request_id';
		$params = array(
			':request_id' => $request_id
		);
		$result = $this->query($sql, $params);
		$request = $result->fetch();

		$principal_group_name = $helper->getGroupName($principal->group_id);
		$status = $helper->getStatusId($principal_group_name . '_' . $approving);

		$response = new JsonResponse();
		if ($status !== null) {
			/*
			 * Проверяем, если следующий статус "Оплачено", значит присваиваем его, иначе оставляем как есть
			 */
			if ($approving == 'approved') {
				$next_status = $helper->getNextStatus((int)$request->status);
				$next_status_name = $helper->getStatusName($next_status);
				if ($next_status_name == 'paid') {
					$status = $next_status;
					$date = new \DateTime();
					$dt_payment = $date->format('Y-m-d H:i:s');
				}
			}
			$request->status = $status;
			$helper->processingRules($request);
			$status = $request->status;

			$response->success = true;
			$response->next_status = $status;
		} else {
			$response->message = 'Новый статус не определен';
		}

		echo $response;
	}

}
