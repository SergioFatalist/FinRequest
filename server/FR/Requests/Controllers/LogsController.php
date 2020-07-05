<?php
/**
 * Created by PhpStorm.
 * User: sergio
 * Date: 22.10.14
 * Time: 02:47
 */

namespace FR\Requests\Controllers;


use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class LogsController extends CoreController {

	protected $root = 'requestlogs';

	public function listAction() {

		$request_id = $this->requestField('request_id');

		$sql = "SELECT * FROM requests_history WHERE request_id = :request_id ORDER BY dt ASC";
		$params = array(
			':request_id' => $request_id
		);
		$result = $this->query($sql, $params);
		$rows = $result->fetchAll();

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $rows);
		$response->total = sizeof($rows);

		echo $response;

	}

} 