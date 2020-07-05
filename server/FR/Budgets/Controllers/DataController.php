<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 30.06.14
 * Time: 14:38
 */

namespace FR\Budgets\Controllers;


use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class DataController extends CoreController {

	protected $root = 'budgetdatalist';

	public function listAction() {

		$budget_id = $this->decodeData('budget_id');
		$budgets_data = array();

		// Get budget network
		$sql = "SELECT * FROM budgets WHERE id = :budget_id";
		$params = array(
			':budget_id' => (int) $budget_id
		);
		$result = $this->query($sql, $params);
		$budget = $result->fetch();

		// Get allowed for budget
		$sql = "SELECT id, budget_id, category_id, allowed FROM budgets_data WHERE budget_id = :budget_id";
		$params = array(
			':budget_id' => (int) $budget_id
		);
		$result = $this->query($sql, $params);
		$rows = $result->fetchAll();

		foreach ($rows as $row) {
			$budgets_data[$row->category_id]['allowed'] = $row->allowed;
		}

		$sql = "SELECT requests.category_id, requests.status AS status, SUM(requests_points.amount) as amount"
			. " FROM requests, points, requests_points"
			. " WHERE DATE_FORMAT(requests.dt_created, '%Y%m') = :dt_created"
			. " AND requests_points.point_id = points.id"
			. " AND requests.id = requests_points.request_id"
			. " AND points.net_id= :network_id"
			. " GROUP BY requests.category_id";

		$params = array(
			':dt_created' => $budget->month,
			':network_id' => $budget->network_id
		);
		$result = $this->query($sql, $params);
		$rows = $result->fetchAll();
		foreach ($rows as $row) {
			$status = (int) $row->status;
			if ($status == 10) {
				$budgets_data[$row->category_id]['used'] = round($row->amount, 2);
			} else {
				$budgets_data[$row->category_id]['in_progress'] = round($row->amount, 2);
			}
		}

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $budgets_data);
		$response->total = sizeof($budgets_data);

		echo $response;
	}

	public function importAction() {
	}
} 