<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 29.06.14
 * Time: 15:52
 */

namespace FR\Companies\Controllers;


use FR\Auth\PrincipalService;
use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class CompaniesController extends CoreController {

	protected $root = 'companieslist';

	public function listAction(){

		$ps = new PrincipalService();
		if ($ps->checkAccess('companies', 'admin')) {
			$sql = 'SELECT * FROM companies ORDER BY name';
		} else {
			$sql = 'SELECT * FROM companies WHERE active = 1 ORDER BY name';
		}
		$result = $this->query($sql);
		$rows = $result->fetchAll();

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $rows);
		$response->total = count($rows);

		echo $response;
	}

	public function updateAction() {

		$sql = "UPDATE companies SET name = :name, payment_type = :payment_type, comment = :comment, active = :active WHERE id = :id";
		$data = $this->decodeData();

		if (!is_array($data)) {
			$data = array($data);
		}

		foreach ($data as $row) {
			$params = array(
				':name' => $row->name,
				':payment_type' => (int)$row->payment_type,
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

		$sql = "INSERT INTO companies (name, payment_type, comment, active) VALUES (:name, :payment_type, :comment, :active)";

		$data = $this->decodeData();
		$params = array(
			':name' => $data->name,
			':payment_type' => (int)$data->payment_type,
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