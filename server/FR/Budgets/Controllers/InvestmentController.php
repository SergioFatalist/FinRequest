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

class InvestmentController extends CoreController {

	protected $root = 'investmentlist';

	public function listAction() {

		$sql = "SELECT b.id AS id, b.filename AS filename, b.month AS month, b.target_id AS target_id, r.bd_categories as categories"
			. " FROM budgets AS b"
			. " LEFT JOIN (SELECT b1.id AS b_id, COUNT(bd.category_id) AS bd_categories"
			. " FROM budgets_data AS bd, budgets AS b1 WHERE b1.id = bd.budget_id GROUP BY b1.id) AS r ON r.b_id = b.id, points AS p"
			. " WHERE b.target_id = p.id"
			. " AND b.type = 1"
			. " AND p.project = 1";

		$result = $this->query($sql);
		$rows = $result->fetchAll();

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $rows);
		$response->total = sizeof($rows);

		echo $response;
	}

	public function importAction() {

		$target_id = intval($this->decodeData('target_id'));

		$helper = new BudgetsHelper();
		$data = $helper->parseBudgetFile('investment', $target_id);

		if (!is_array($data)) {
			$response = new JsonResponse();
			$response->message = $data;
			die($response);
		}

		$sql = 'SELECT * from budgets WHERE target_id = :target_id AND month = "000000" AND type = 1';
		$params = array(
			':target_id' => $target_id,
		);
		$result = $this->query($sql, $params);
		$row = $result->fetch();

		if (!$row) {
			$sql = 'INSERT INTO budgets (filename, target_id, user_id, type) VALUES (:filename, :target_id, :user_id, 1)';
			$params = array(
				':filename'=> $data['filename'],
				':target_id' => $target_id,
				':user_id' => Application::getInstance()->getPrincipal()->id,
			);
			$this->query($sql, $params);
			$budget_id = $this->db->lastInsertId();
		} else {
			$budget_id = $row->id;
		}

		$count = 0;
		$sql = 'INSERT IGNORE INTO budgets_data (budget_id, category_id, allowed) VALUES (:budget_id, :category_id, :allowed)'
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