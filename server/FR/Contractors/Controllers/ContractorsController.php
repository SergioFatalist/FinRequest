<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 30.06.14
 * Time: 10:24
 */

namespace FR\Contractors\Controllers;


use FR\Auth\PrincipalService;
use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class ContractorsController extends CoreController {

	protected $root = 'contractors';

	public function listAction() {

		$ps = new PrincipalService();

		if ($ps->checkAccess('contractors', 'admin')) {
			$sql = 'SELECT * FROM contractors ORDER BY name';
		} else {
			$sql = 'SELECT * FROM contractors WHERE active = 1 ORDER BY name';
		}

		$result = $this->query($sql);
		$rows = $result->fetchAll();

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $rows);
		$response->total = count($rows);

		echo $response;
	}

	public function adminlistAction() {
		$this->listAction(true);
	}

	public function updateAction() {

		$sql = "UPDATE contractors SET name = :name, comment = :comment, active = :active WHERE id = :id";
		$data = $this->decodeData();

		if (!is_array($data)) {
			$data = array($data);
		}

		foreach ($data as $row) {
			$params = array(
				':name' => $row->name,
				':comment' => $row->comment,
				':active' => (int)$row->active,
				':id' => (int)$row->id,
			);
			$this->query($sql, $params);
		}

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, sizeof($data) == 1 ? $data[0] : $data);

		echo $response;
	}

	public function createAction() {

		$sql = "INSERT INTO contractors (name, comment, active) VALUES (:name, :comment, :active)";

		$data = $this->decodeData();
		$params = array(
			':name' => $data->name,
			':comment' => $data->comment,
			':active' => (int)$data->active,
		);
		$this->query($sql, $params);

		$data->id = $this->db->lastInsertId();
		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $data);

		echo $response;
	}

} 