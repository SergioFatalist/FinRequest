<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 28.06.14
 * Time: 14:29
 */

namespace FR\Budgets\Controllers;


use FR\Application;
use FR\Budgets\BudgetsHelper;
use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class OperationalController extends CoreController {

	protected $root = 'operationallist';

	public function listAction() {

		$sql = 'SELECT b.id AS id, b.filename AS filename, b.month AS month, b.target_id AS target_id, r.bd_categories as categories'
			. ' FROM budgets AS b'
			. ' LEFT JOIN (SELECT b1.id AS b_id, COUNT(bd.category_id) AS bd_categories'
			. ' FROM budgets_data AS bd, budgets AS b1 WHERE b1.id = bd.budget_id GROUP BY b1.id) AS r ON r.b_id = b.id, nets AS n'
			. ' WHERE b.target_id = n.id'
			. ' AND b.type = 0'
			. ' AND (n.curator_id = :curator_id OR n.chief_operating_officer_id = :coo_id)';

		$params = array(
			':curator_id' => Application::getInstance()->getPrincipal()->id,
			':coo_id' => Application::getInstance()->getPrincipal()->id,
		);

		$result = $this->query($sql, $params);
		$rows = $result->fetchAll();

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $rows);
		$response->total = sizeof($rows);

		echo $response;
	}

	public function importAction() {

		$target_id = intval($this->decodeData('target_id'));
		$month = (int) $this->decodeData('month');

		$helper = new BudgetsHelper();
		$data = $helper->parseBudgetFile('operational', $target_id, $month);

		if (!is_array($data)) {
			$response = new JsonResponse();
			$response->message = $data;
			die($response);
		}

		$sql = 'SELECT * from budgets WHERE target_id = :target_id AND month = :month AND type = 0';
		$params = array(
			':target_id' => $target_id,
			':month' => $month
		);
		$result = $this->query($sql, $params);
		$row = $result->fetch();

		if (!$row) {
			$sql = 'INSERT INTO budgets (filename, month, target_id, user_id, type) VALUES (:filename, :month, :target_id, :user_id, 0)';
			$params = array(
				':filename'=> $data['filename'],
				':month' => $month,
				':target_id' => $target_id,
				':user_id' => Application::getInstance()->getPrincipal()->id,
			);
			$this->query($sql, $params);
			$budget_id = $this->db->lastInsertId();
		} else {
			$budget_id = $row->id;
		}

		$count = 0;
		$sql = 'INSERT INTO budgets_data (budget_id, category_id, allowed) VALUES (:budget_id, :category_id, :allowed)'
			. ' ON DUPLICATE KEY UPDATE allowed = VALUES(allowed)';
		foreach ($data['rows'] as $row) {
			$params = array(
				':budget_id' => intval($budget_id),
				':category_id' => $row['id'],
				':allowed' => $row['allowed'] ? $row['allowed'] : 0,
			);
			$this->query($sql, $params);
			if ($this->db->lastInsertId() != 0) {
				$count++;
			}
		}

		$response = new JsonResponse();
		$response->success = true;
		$response->message = 'Успешно записано ' . $count . ' строк бюджета';
		echo $response;
	}
} 