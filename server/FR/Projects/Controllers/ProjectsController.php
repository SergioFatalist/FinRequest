<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 25.06.14
 * Time: 12:42
 */

namespace FR\Projects\Controllers;


use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class ProjectsController extends CoreController {

	protected $root = 'projects';

	public function listAction() {

		$ps = new PrincipalService();

		if ($ps->checkAccess('nets', 'admin')) {
			$sql = "SELECT id, net_id, active, name, city, address, phone, comment FROM points WHERE project <> 1 ORDER BY name ASC";
		} else {
			$user_id = Application::getInstance()->getPrincipal()->id;
			$sql = "SELECT up.id AS id, up.net_id AS net_id, up.active AS active, up.project AS project, up.name AS name, up.city AS city, up.address AS address, up.phone AS phone, up.comment AS comment"
				. " FROM user_permitted_points AS up, user_permitted_nets AS un"
				. " WHERE up.net_id = un.id AND up.user_id = un.user_id AND up.user_id = " . $user_id . " AND up.project <> 1 ORDER BY name ASC";
		}

		$result = $this->query("SELECT * FROM projects");
		$rows = $result->fetchAll();

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $rows);
		$response->total = count($rows);

		echo $response;
	}

	public function createAction() {

		$response = new JsonResponse();

		$data = $this->decodeData();

		$sql = "INSERT INTO projects (name, city, address, phone, curator_id, dt_created, dt_finish, active, finished)"
			. " VALUES (:name, :city, :address, :phone, :curator_id, :dt_created, :dt_finish, :active, :finished)";
		$params = array(
			':name' => $data->name,
			':city' => $data->city,
			':address' => $data->address,
			':phone' => $data->phone,
			':curator_id' => (int) $data->curator_id,
			':dt_created' => $data->dt_created ? $data->dt_created : date_format(date_create(), 'Y-m-d H:i:s'),
			':dt_finish' => $data->dt_finish,
			':active' => (int) $data->active,
			':finished' => (int) $data->finished,
		);


		$this->query($sql, $params);

		if ($this->db->lastInsertId() == 0) {
			$response->message = 'Ошибка сервера при добавлении записи';
			die($response);
		}

		$data->id = $this->db->lastInsertId();

		$data->dt_created = $data->dt_created ? date_format(new \DateTime($data->dt_created), 'Y-m-d H:i:s') : null;
		$data->dt_finish = $data->dt_finish ? date_format(new \DateTime($data->dt_finish), 'Y-m-d H:i:s') : null;

		$response->success = true;
		$response->setData($this->root, array($data));

		echo $response;

	}

	public function updateAction() {

		$response = new JsonResponse();

		$data = $this->decodeData();
		$data = is_array($data) ? $data : array($data);

		$changed = array();
		foreach ($data as $row) {

			$sql = "UPDATE projects SET name = :name, city = :city, address = :address, phone = :phone,"
				." curator_id = :curator_id, dt_created = :dt_created, dt_finish = :dt_finish, active = :active, finished = :finished WHERE id = :id";
			$params = array(
				':name' => $row->name,
				':city' => $row->city,
				':address' => $row->address,
				':phone' => $row->phone,
				':curator_id' => (int) $row->curator_id,
				':dt_created' => $row->dt_created,
				':dt_finish' => $row->dt_finish,
				':active' => (int) $row->active,
				':finished' => (int) $row->finished,
				':id' => $row->id,
			);

			$this->query($sql, $params);

			$row->dt_created = $row->dt_created ? date_format(new \DateTime($row->dt_created), 'Y-m-d H:i:s') : null;
			$row->dt_finish = $row->dt_finish ? date_format(new \DateTime($row->dt_finish), 'Y-m-d H:i:s') : null;
			$changed[] = $row;
		}

		$response->success = true;
		$response->setData($this->root, $changed);
		$response->total = count($changed);

		echo $response;
	}

}
