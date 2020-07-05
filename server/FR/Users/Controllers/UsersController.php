<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 17.06.14
 * Time: 16:48
 */

namespace FR\Users\Controllers;


use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class UsersController extends CoreController{

	protected $root = 'userslist';
	protected $aclRoot = 'useracl';

	public function listAction() {

		$response = new JsonResponse();

		$result = $this->query("SELECT * FROM users");
		$rows = $result->fetchAll();

		for($i=0; $i<(count($rows)); $i++) {
			$rows[$i]->password = '';
		}

		$response->success = true;
		$response->setData($this->root, $rows);
		$response->total = count($rows);

		echo $response;
	}

	public function updateAction() {
		$data = $this->decodeData();
		$response = new JsonResponse();

		if (!$data->id) {
			$response->message = 'Неверно сформированы данные для обработки';
		}

		$sql = 'UPDATE users SET login = :login, email = :email, name = :name, master_id = :master_id, group_id = :group_id, active = :active';
		$sql .= strlen($data->password) > 0 ? ', password = PASSWORD(:password)' : '';
		$sql .= ' WHERE id = :id';

		$params = array(
			':login' => $data->login,
			':email' => $data->email,
			':name' => $data->name,
			':master_id' => $data->master_id,
			':group_id' => $data->group_id,
			':active' => (int) $data->active,
			':id' => $data->id
		);

		if (strlen($data->password) > 0) {
			$params[':password'] = $data->password;
		}
		debug_var($params);


		$this->query($sql, $params);

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $data);

		echo $response;
	}

	public function createAction() {
		$data = $this->decodeData();

		$sql = 'INSERT INTO users (login, email, name, master_id, group_id, active, `password`)'
			. ' VALUES (:login, :email, :name, :master_id, :group_id, :active, PASSWORD(:password))';

		$params = array(
			':login' => $data->login,
			':email' => $data->email,
			':name' => $data->name,
			':master_id' => (int) $data->master_id,
			':group_id' => (int) $data->group_id,
			':active' => (int) $data->active,
			':password' => $data->password
		);

		$this->query($sql, $params);
		$data->id = $this->db->lastInsertId();


		$sql = "SELECT id FROM nets";
		$res = $this->query($sql);
		$nets = $res->fetchAll();
		$sql = "INSERT INTO user_nets (user_id, net_id) VALUES (:user_id, :net_id)";
		foreach ($nets as $net) {
			$params = array(
				':user_id' => $data->id,
				':net_id' => $net->id
			);
			$this->query($sql, $params);
		}

		$sql = "SELECT id FROM points";
		$res = $this->query($sql);
		$points = $res->fetchAll();
		$sql = "INSERT INTO user_points (user_id, point_id) VALUES (:user_id, :point_id)";
		foreach ($points as $point) {
			$params = array(
				':user_id' => $data->id,
				':point_id' => $point->id
			);
			$this->query($sql, $params);
		}

		$sql = "SELECT id FROM categories";
		$res = $this->query($sql);
		$categories = $res->fetchAll();
		$sql = "INSERT INTO user_categories (user_id, category_id, permit) VALUES (:user_id, :category_id, 1)";
		foreach ($categories as $cat) {
			$params = array(
				':user_id' => $data->id,
				':category_id' => $cat->id
			);
			$this->query($sql, $params);
		}

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $data);

		echo $response;
	}

	public function aclTreeAction() {

		$user_id = $this->decodeData('user_id');
		$result = $this->query("SELECT * FROM users WHERE id = :user_id", array(':user_id' => $user_id));
		if (!$result) {
			$response = new JsonResponse();
			$response->message = 'Пользватель не найден!';
			die($response);
		}
		$user = $result->fetch();

		$result = $this->query("SELECT id, name AS `text`, 0 AS leaf FROM modules");
		$rows = $result->fetchAll();
		$nodes = array();

		foreach($rows as $row) {

			$sql = "SELECT group_actions.id AS ga_id,
					       group_actions.permit AS ga_permit,
					       modules_actions.id AS action_id,
					       user_actions.id AS id,
					       modules_actions.name AS `text`,
					       user_actions.permit AS permit,
					       1 AS leaf
					  FROM (group_actions group_actions
					        INNER JOIN modules_actions modules_actions
					           ON (group_actions.action_id = modules_actions.id))
					       LEFT OUTER JOIN user_actions user_actions
					          ON (user_actions.action_id = modules_actions.id AND user_actions.user_id = :user_id)
					  WHERE (group_actions.group_id = :group_id) AND (modules_actions.module_id = :module_id) ORDER BY action_id";

			$params = array(
				':user_id' => $user->id,
				':group_id' => $user->group_id,
				':module_id' => $row->id
			);
			$row->id = 'm-' . $row->id;
			$result2 =  $this->query($sql, $params);
			$rows2 = $result2->fetchAll();
			foreach ($rows2 as $row2) {
				if (is_null($row2->id)) {
					$row2->id = 'p-0';
					$row2->permit = $row2->ga_permit;
				} else {
					$row2->id = 'p-' . $row2->id;
				}
				$row->children[] = $row2;
			}
			$nodes[] = $row;
		}

		echo json_encode($nodes);
	}

	public function aclUpdateAction() {
		$user_id = $this->decodeData('user_id');
		$data = $this->decodeData($this->aclRoot);

		if (is_array($data)) {
			$data = $data[0];
		}

		list($t, $id) = preg_split('/-/', $data->id);

		$sql = "SELECT * FROM user_actions WHERE user_id = :user_id AND action_id = :action_id";
		$params = array(
			':user_id' => $user_id,
			':action_id' => $data->action_id
		);

		$result = $this->query($sql, $params);
		$finded_id = 0;

		if ($result) {
			$row = $result->fetch();
			$finded_id = $row->id;
		}

		if ($id == 0 && $finded_id == 0) {

			$sql = "INSERT INTO user_actions (user_id, action_id, permit) VALUES (:user_id, :action_id, :permit)";
			$params = array(
				':user_id' => $user_id,
				':action_id' => $data->action_id,
				':permit' => $data->permit ? 1 : 0
			);
		} else {
			$sql = "UPDATE user_actions SET permit = :permit WHERE id = :id";
			$params = array(
				':id' => $data->id == 0 ? $finded_id : $id,
				':permit' => $data->permit ? 1 : 0
			);
		}

		$this->query($sql, $params);

	}

	public function netsTreeAction() {

		$user_id = $this->decodeData('user_id');
		$nodes = array();

		$sql = 'SELECT user_nets.id AS id, nets.id AS net_id, nets.name AS name, user_nets.permit AS permit, nets.projects AS project, 0 AS leaf FROM user_nets, nets'
			. ' WHERE user_nets.net_id = nets.id AND nets.active = 1 AND user_id = :user_id';
		$params = array(
			':user_id' => $user_id
		);
		$result = $this->query($sql, $params);
		$rows = $result->fetchAll();

		$sql = 'SELECT user_points.id AS id, points.name AS name, user_points.permit AS permit, points.project AS project, 1 AS leaf FROM user_points, points'
			. ' WHERE user_points.point_id = points.id AND points.net_id = :net_id AND points.active = 1 and user_id = :user_id';
		foreach ($rows as $row) {
			$row->children = array();
			$params = array(
				':net_id' => $row->net_id,
				':user_id' => $user_id
			);
			$result = $this->query($sql, $params);
			$rows2 = $result->fetchAll();
			foreach ($rows2 as $row2) {
				$row2->id = 'p-' . $row2->id;
				$row->children[] = $row2;
			}
			$row->id = 'n-' . $row->id;
			$nodes[] = $row;
		}

		echo json_encode($nodes);
	}

	public function netsUpdateAction() {
		$data = $this->decodeData('netacl');

		if (!is_array($data)) {
			$data = array($data);
		}

		foreach($data as $row) {

			list($type, $id) = preg_split('/-/', $row->id, 2);
			if ($type == 'p') {
				$sql = 'UPDATE user_points SET permit = :permit WHERE id = :id';
			} else if ($type == 'n') {
				$sql = 'UPDATE user_nets SET permit = :permit WHERE id = :id';
			} else {
				return;
			}
			$params = array(
				':permit' => (int) $row->permit,
				':id' => intval($id)
			);
			$this->query($sql, $params);
		}
	}

	public function categoriesTreeAction() {

		$user_id = $this->decodeData('user_id');
		$nodes = array();

		$sql = 'SELECT user_categories.id AS id, categories.id AS category_id, categories.parent_id AS parent_id, categories.name AS name, user_categories.permit AS permit, 0 AS leaf FROM user_categories, categories'
			. ' WHERE user_categories.category_id = categories.id AND categories.active = 1 AND user_id = :user_id AND categories.parent_id = -1';
		$params = array(
			':user_id' => $user_id
		);
		$result = $this->query($sql, $params);
		$rows = $result->fetchAll();

		$sql = 'SELECT user_categories.id AS id, categories.id AS category_id, categories.parent_id AS parent_id, categories.name AS name, user_categories.permit AS permit, 1 AS leaf FROM user_categories, categories'
			. ' WHERE user_categories.category_id = categories.id AND categories.active = 1 AND user_id = :user_id AND categories.parent_id = :parent_id';
		foreach ($rows as $row) {
			$row->children = array();
			$params = array(
				':user_id' => $user_id,
				':parent_id' => $row->category_id,
			);
			$result = $this->query($sql, $params);
			$rows2 = $result->fetchAll();
			foreach ($rows2 as $row2) {
				$row->children[] = $row2;
			}
			$nodes[] = $row;
		}

		echo json_encode($nodes);
	}

	public function categoriesUpdateAction() {
		$data = $this->decodeData('categoryacl');

		$data = is_array($data) ? $data : array($data);

		foreach($data as $row) {

			$sql = 'UPDATE user_categories SET permit = :permit WHERE id = :id';
			$params = array(
				':permit' => (int) $row->permit,
				':id' => (int) $row->id,
			);
			$this->query($sql, $params);
			if (-1 != (int) $row->parentId) {
				$params = array(
					':permit' => (int) $row->permit,
					':id' => (int) $row->parentId,
				);
				$this->query($sql, $params);
			}
		}
	}

}
