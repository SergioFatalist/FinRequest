<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 25.06.14
 * Time: 9:06
 */

namespace FR\Nets\Controllers;


use FR\Application;
use FR\Auth\PrincipalService;
use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class NetsController extends CoreController {

	protected $root = 'nets';

	public function listAction() {

		$ps = new PrincipalService();

		if ($ps->checkAccess('nets', 'admin')) {;
			$sql = "SELECT id, name, curator_id, chief_operating_officer_id, active, projects FROM nets ORDER BY name ASC";
		} else {
			$user_id = Application::getInstance()->getPrincipal()->id;
			$sql = "SELECT id, name, curator_id, chief_operating_officer_id, active, projects FROM user_permitted_nets WHERE user_id = " . $user_id . " ORDER BY name ASC";
		}

		$result = $this->query($sql);
		$rows = $result->fetchAll();

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $rows);
		$response->total = count($rows);

		echo $response;
	}

	public function netsTreeAction() {

        $nets_filter = '';
        $points_filter = '';

        if(isset($_POST['investment']) && $_POST['investment'] != 'true') {
            $nets_filter = ' AND nets.projects <> 1 ';
            $points_filter = ' AND points.project <> 1';
        }

		$user_id = Application::getInstance()->getPrincipal()->id;
		$nodes = array();

		$sql = 'SELECT nets.id AS id, nets.name AS name, 0 AS leaf, 0 AS sel FROM user_nets, nets'
			. ' WHERE user_nets.net_id = nets.id AND nets.active = 1 AND user_nets.permit = 1 AND user_nets.user_id = :user_id' . $nets_filter;
		$params = array(
			':user_id' => $user_id
		);
		$result = $this->query($sql, $params);
		$rows = $result->fetchAll();

		$sql = 'SELECT points.id AS id, points.name AS name, 0 AS sel, 1 AS leaf FROM user_points, points'
			. ' WHERE user_points.point_id = points.id AND points.net_id = :net_id AND points.active = 1 AND user_points.permit = 1 AND user_id = :user_id' . $points_filter;
		foreach ($rows as $row) {
			$row->children = array();
			$params = array(
				':net_id' => $row->id,
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

	public function netsTreeUpdateAction() {
	}

	public function createAction() {

		$response = new JsonResponse();

		$data = $this->decodeData();

		$sql = "INSERT INTO nets (name, curator_id, chief_operating_officer_id, active, projects)
					VALUES(:name, :curator_id, :chief_operating_officer_id, :active, :projects)";
		$params = array(
			':name' => $data->name,
			':curator_id' => (int) $data->curator_id,
			':chief_operating_officer_id' => (int) $data->chief_operating_officer_id,
			':active' => (int) $data->active,
			':projects' => (int) $data->projects,
		);

		$this->query($sql, $params);
		$id = $this->db->lastInsertId();

		$sql = 'INSERT INTO user_nets (user_id, net_id) SELECT u.id AS user_id, n.id AS net_id FROM users u LEFT JOIN nets n ON 1=1 WHERE n.id = ' .$id;
		$this->query($sql);

		$data->id = $id;
		$response->success = true;
		$response->setData($this->root, array($data));

		echo $response;
	}

	public function updateAction() {

		$data = $this->decodeData();

		if (!is_array($data)) {
			$data = array($data);
		}

		foreach ($data as $row) {
			$sql = "UPDATE nets SET name = :name, curator_id = :curator_id, chief_operating_officer_id = :chief_operating_officer_id,
					active = :active, projects = :projects WHERE id = :id";
			$params = array(
				':name' => $row->name,
				':curator_id' => (int) $row->curator_id,
				':chief_operating_officer_id' => (int) $row->chief_operating_officer_id,
				':active' => (int) $row->active,
				':projects' => (int) $row->projects,
				':id' => $row->id,
			);

			$this->query($sql, $params);
		}
	}
}
