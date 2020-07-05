<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 29.06.14
 * Time: 18:42
 */

namespace FR\Requests\Controllers;


use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class StatusesController extends CoreController {

	protected $root = 'statuseslist';

	public function listAction() {

		$sql = "SELECT * FROM requests_statuses";
		$result = $this->query($sql);
		$rows = $result->fetchAll();

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $rows);
		$response->total = sizeof($rows);

		echo $response;
	}
} 