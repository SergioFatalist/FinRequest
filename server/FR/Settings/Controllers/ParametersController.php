<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 02.07.14
 * Time: 14:52
 */

namespace FR\Settings\Controllers;


use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class ParametersController extends CoreController {

	protected $root = 'parameters';

	public function listAction() {

		$response = new JsonResponse();

		$result = $this->query("SELECT * FROM parameters");
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

		if (!is_array($data)) {
			$data = array($data);
		}

		$sql = 'UPDATE parameters SET value = :value WHERE id = :id';
		foreach ($data as $row) {
			$params = array(
				':value' => $row->value,
				':id' => (int) $row->id
			);
			$this->query($sql, $params);
		}

		$response->success = true;
		$response->setData($this->root, $data);
		$response->total = sizeof($data);

		echo $response;
	}
} 