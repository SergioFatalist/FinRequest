<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 07.07.14
 * Time: 17:43
 */

namespace FR\Settings\Controllers;


use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class StatusesController extends CoreController {

	protected $root = 'statuses';

	public function listAction() {

		$response = new JsonResponse();

		$result = $this->query('SELECT ra.id AS id, ra.name AS approve_name, rd.id AS decline_id, rd.name AS decline_name, ra.ordering
			FROM requests_statuses AS ra
			LEFT OUTER JOIN requests_statuses AS rd ON rd.complement_id = ra.id
			WHERE ra.is_approve = 1
			ORDER BY ra.ordering asc;');
		$rows = $result->fetchAll();

		$response->success = true;
		$response->setData($this->root, $rows);
		$response->total = count($rows);

		echo $response;
	}

	public function updateAction() {

		$data = $this->decodeData();

		if (!is_array($data)) {
			$data = array($data);
		}

		$sql = 'UPDATE requests_statuses SET ordering = :ordering WHERE id = :id';
		foreach ($data as $row) {
			$params = array(
				':ordering' => intval($row->ordering),
				':id' => intval($row->id)
			);
			$this->query($sql, $params);
		}

		$this->listAction();
	}

} 