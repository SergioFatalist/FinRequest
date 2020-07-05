<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 25.06.14
 * Time: 10:57
 */

namespace FR\Nets\Controllers;


use FR\Application;
use FR\Auth\PrincipalService;
use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class PointsController extends CoreController {

	protected $root = 'points';

	public function listAction() {

		$ps = new PrincipalService();

		if ($ps->checkAccess('nets', 'admin')) {
			$sql = "SELECT id, net_id, curator_id, project_id, active, name, city, address, phone, project, dt_created, dt_finished, finished FROM points ORDER BY name ASC";
		} else {
			$user_id = Application::getInstance()->getPrincipal()->id;
			$sql = "SELECT up.id AS id, up.net_id AS net_id, up.curator_id AS curator_id, up.project_id AS project_id, up.active AS active, up.project AS project, "
				. " up.name AS name, up.city AS city, up.address AS address, up.phone AS phone, up.project AS project, up.dt_created AS dt_created, "
				. " up.dt_finished AS dt_finished, up.finished AS finished "
				. " FROM user_permitted_points AS up, user_permitted_nets AS un"
				. " WHERE up.net_id = un.id AND up.user_id = un.user_id AND up.user_id = " . $user_id . "  ORDER BY name ASC";
		}

		$result = $this->query($sql);
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

		$sql = "INSERT INTO points(net_id, curator_id, project_id, active, name, city, address, phone, project, dt_created, dt_finished, finished)
					VALUES(:net_id, :curator_id, :project_id, :active, :name, :city, :address, :phone, :project, :dt_created, :dt_finished, :finished )";
		$params = array(
			':net_id' => (int) $data->net_id,
			':curator_id' => (int) $data->curator_id,
			':project_id' => (int) $data->project_id,
			':active' => (int) $data->active,
			':name' => $data->name,
			':city' => $data->city,
			':address' => $data->address,
			':phone' => $data->phone,
			':project' => (int)$data->project,
			':dt_created' => $data->dt_created ? $data->dt_created : date_format(date_create(), 'Y-m-d H:i:s'),
			':dt_finished' => $data->dt_finished,
			':finished' => (int)$data->finished,
		);

		$this->query($sql, $params);
		$id = $this->db->lastInsertId();

		$sql = 'INSERT INTO user_points (user_id, point_id) SELECT u.id AS user_id, p.id AS point_id FROM users u LEFT JOIN points p ON 1=1 WHERE p.id = ' .$id;
		$this->query($sql);

		$data->id = $id;
		$data->dt_created = $data->dt_created ? date_format(new \DateTime($data->dt_created), 'Y-m-d H:i:s') : null;
		$data->dt_finished = $data->dt_finished ? date_format(new \DateTime($data->dt_finished), 'Y-m-d H:i:s') : null;

		$response->success = true;
		$response->setData($this->root, array($data));

		echo $response;
	}


	public function updateAction() {

		$data = $this->decodeData();
		$data = is_array($data) ? $data : array($data);

		$changed = array();

		foreach ($data as $row) {
			$sql = "UPDATE points SET net_id = :net_id, curator_id = :curator_id, project_id = :project_id, active = :active,
					name = :name, city = :city, address = :address, phone = :phone, project = :project,
					dt_created = :dt_created, dt_finished = :dt_finished, finished = :finished
					WHERE id = :id";

			if ($row->finished) {
				$row->dt_finished =  $row->dt_finished ? $row->dt_finished : date_format(date_create(), 'Y-m-d H:i:s');
			}

			$params = array(
				':net_id' => (int) $row->net_id,
				':curator_id' => (int) $row->curator_id,
				':project_id' => (int) $row->project_id,
				':active' => (int) $row->active,
				':name' => $row->name,
				':city' => $row->city,
				':address' => $row->address,
				':phone' => $row->phone,
				':project' => (int)$row->project,
				':dt_created' => $row->dt_created ? $row->dt_created : date_format(date_create(), 'Y-m-d H:i:s'),
				':dt_finished' => $row->dt_finished,
				':finished' => (int)$row->finished,
				':id' => $row->id,
			);
			$this->query($sql, $params);

			$row->dt_created = $row->dt_created ? date_format(new \DateTime($row->dt_created), 'Y-m-d H:i:s') : null;
			$row->dt_finished = $row->dt_finished ? date_format(new \DateTime($row->dt_finished), 'Y-m-d H:i:s') : null;
			$changed[] = $row;

		}

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $changed);
		$response->total = count($changed);

		echo $response;
	}
}
