<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 26.06.14
 * Time: 1:07
 */

namespace FR\Requests\Controllers;


use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class PointsController extends CoreController {

	protected $root = 'requestspointslist';

	public function listAction() {

		$request_id = $this->decodeData('request_id');
		$sql = "SELECT requests_points.id AS id, requests_points.request_id AS request_id, requests_points.amount AS amount,
				requests_points.point_status AS point_status, points.net_id AS net_id, points.id AS point_id
				FROM requests_points, points where requests_points.point_id = points.id and requests_points.request_id = :request_id";

		$params = array(
			':request_id' => $request_id,
		);

		$result = $this->query($sql, $params);
		$rows = $result->fetchAll();

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $rows);
		$response->total = count($rows);

		echo $response;
	}

}