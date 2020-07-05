<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 14.07.14
 * Time: 7:53
 */

namespace FR\Requests\Controllers;


use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;
use FR\Requests\RequestHelper;

class BudgetsController extends CoreController {

	protected $root = 'budgets';

	public function perCategoryAction() {

		$month = $this->requestField('month');
		$target_id = (int) $this->requestField('target_id');

		$sql = "SELECT a.category_id AS category_id, c.name AS category_name, c.planned AS planned, a.allowed AS allowed, progress AS in_progress,
				ROUND(IFNULL(used,0), 2) AS used, ROUND(IFNULL(progress, 0), 2) AS progress, ROUND((allowed - IFNULL(used,0) - IFNULL(progress, 0)), 2) AS rest
				FROM
					(SELECT budgets_data.category_id, budgets_data.allowed
					FROM budgets, budgets_data
					WHERE budgets_data.budget_id = budgets.id
						AND budgets.month = :month1
						AND budgets.target_id = :target_id1) AS a
				LEFT JOIN
					(SELECT u.category_id AS category_id, u.used AS used, p.progress AS progress
					FROM
						(SELECT requests.category_id, SUM(requests_points.amount) AS used
						FROM requests, points, requests_points
						WHERE DATE_FORMAT(requests.dt_created, '%Y%m') = :month2
							AND requests_points.point_id = points.id
							AND requests_points.request_id = requests.id
							AND requests.status = 10
							AND points.net_id = :target_id2
						GROUP BY requests.category_id) AS u
					LEFT JOIN
						(SELECT requests.category_id, SUM(requests_points.amount) AS progress
						FROM requests, points, requests_points
						WHERE DATE_FORMAT(requests.dt_created, '%Y%m') = :month3
							AND requests_points.point_id = points.id
							AND requests_points.request_id = requests.id
							AND requests.status IN (1, 2, 4, 6, 8, 12, 14)
							AND points.net_id = :target_id3
						GROUP BY requests.category_id) AS p
					ON u.category_id = p.category_id) AS up
				ON up.category_id = a.category_id
				LEFT JOIN categories AS c ON c.id = a.category_id WHERE (c.id <> 12 AND c.parent_id <> 12) ORDER BY planned DESC, category_name ASC";

		$params = array(
			':month1' => $month,
			':month2' => $month,
			':month3' => $month,
			':target_id1' => $target_id,
			':target_id2' => $target_id,
			':target_id3' => $target_id,
		);

		$result = $this->query($sql, $params);
		$rows = $result->fetchAll();

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $rows);
		$response->total = count($rows);

		echo $response;
	}

	public function perNetworkAction() {

		$month = $this->requestField('month');

		$sql = "SELECT f.target_id AS target_id, f.planned AS planned,
				ROUND(sum(f.allowed),2) AS allowed,  ROUND(sum(f.used),2) AS used, ROUND(sum(f.progress),2) AS in_progress, ROUND(sum(f.rest),2) AS rest
				FROM (
					SELECT a.target_id AS target_id, up.target_name AS target_name, a.category_id AS category_id, a.planned AS planned,
					IFNULL(a.allowed, 0) AS allowed, IFNULL(up.used, 0) AS used, IFNULL(up.progress, 0) AS progress,
					(IFNULL(a.allowed, 0) - IFNULL(up.used,0) - IFNULL(up.progress,0)) AS rest
					FROM (
						SELECT budgets.target_id AS target_id, categories.id AS category_id, categories.planned AS planned, sum(budgets_data.allowed) AS allowed
						FROM budgets
						LEFT JOIN  budgets_data ON budgets.id = budgets_data.budget_id
						LEFT JOIN  categories ON budgets_data.category_id = categories.id
						WHERE budgets.month = :month1
							AND budgets.id IN (
								SELECT max(budgets.id) FROM budgets GROUP BY budgets.month, budgets.target_id ORDER BY budgets.id asc
							)
						GROUP BY categories.id, budgets.target_id, categories.planned) AS a
					LEFT JOIN (
						SELECT u.target_id AS target_id, u.target_name AS target_name, u.category_id AS category_id, IFNULL(u.used, 0) AS used, IFNULL(p.progress, 0) AS progress
						FROM (
							SELECT nets.id AS target_id, nets.name AS target_name, categories.id AS category_id, ROUND(sum(requests_points.amount),2) AS used
							FROM requests, requests_points, points, nets, categories
							WHERE requests_points.request_id = requests.id
								AND requests_points.point_id = points.id
								AND points.net_id = nets.id
								AND requests.category_id = categories.id
								AND DATE_FORMAT(requests.dt_created, '%Y%m') = :month2
								AND requests.status = 10
							GROUP BY categories.id, nets.id, categories.planned) AS u
						LEFT JOIN(
							SELECT nets.id AS target_id, categories.id AS category_id, ROUND(sum(requests_points.amount),2) AS progress
							FROM requests, requests_points, points, nets, categories
							WHERE requests_points.request_id = requests.id
								AND requests_points.point_id = points.id
								AND points.net_id = nets.id
								AND requests.category_id = categories.id
								AND DATE_FORMAT(requests.dt_created, '%Y%m') = :month3
								AND requests.status IN (1, 2, 4, 6, 8, 12, 14)
							GROUP BY categories.id, nets.id, categories.planned) AS p
						ON u.target_id = p.target_id AND u.category_id = p.category_id) AS up
					ON a.target_id = up.target_id AND a.category_id = up.category_id) AS f
				GROUP BY f.planned, f.target_id";

		$params = array(
			':month1' => $month,
			':month2' => $month,
			':month3' => $month
		);
		$result = $this->query($sql, $params);
		$rows = $result->fetchAll();

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $rows);
		$response->total = count($rows);

		echo $response;
	}

	public function perProjectAction() {
//		$sql = "SELECT f.target_id AS target_id, f.planned AS planned,
//				ROUND(sum(f.allowed),2) AS allowed,  ROUND(sum(f.used),2) AS used, ROUND(sum(f.progress),2) AS in_progress, ROUND(sum(f.rest),2) AS rest
//				FROM (
//					SELECT a.target_id AS target_id, up.target_name AS target_name, a.category_id AS category_id, a.planned AS planned,
//					IFNULL(a.allowed, 0) AS allowed, IFNULL(up.used, 0) AS used, IFNULL(up.progress, 0) AS progress,
//					(IFNULL(a.allowed, 0) - IFNULL(up.used,0) - IFNULL(up.progress,0)) AS rest
//					FROM (
//						SELECT budgets.target_id AS target_id, categories.id AS category_id, categories.planned AS planned, sum(budgets_data.allowed) AS allowed
//						FROM budgets
//						LEFT JOIN  budgets_data ON budgets.id = budgets_data.budget_id
//						LEFT JOIN  categories ON budgets_data.category_id = categories.id
//						WHERE budgets.type = 1
//							AND budgets.id IN (
//								SELECT max(budgets.id) FROM budgets GROUP BY budgets.month, budgets.target_id ORDER BY budgets.id asc
//							)
//						GROUP BY categories.id, budgets.target_id, categories.planned) AS a
//					LEFT JOIN (
//						SELECT u.target_id AS target_id, u.target_name AS target_name, u.category_id AS category_id, IFNULL(u.used, 0) AS used, IFNULL(p.progress, 0) AS progress
//						FROM (
//							SELECT points.id AS target_id, nets.name AS target_name, categories.id AS category_id, ROUND(sum(requests_points.amount),2) AS used
//							FROM requests, requests_points, points, nets, categories
//							WHERE requests_points.request_id = requests.id
//								AND requests_points.point_id = points.id
//								AND points.project = 1
//								AND requests.category_id = categories.id
//								AND requests.status = 10
//							GROUP BY categories.id, points.id, categories.planned) AS u
//						LEFT JOIN(
//							SELECT points.id AS target_id, categories.id AS category_id, ROUND(sum(requests_points.amount),2) AS progress
//							FROM requests, requests_points, points, categories
//							WHERE requests_points.request_id = requests.id
//								AND requests_points.point_id = points.id
//								AND points.project = 1
//								AND requests.category_id = categories.id
//								AND requests.status <> 10
//							GROUP BY categories.id, points.id, categories.planned) AS p
//						ON u.target_id = p.target_id AND u.category_id = p.category_id) AS up
//					ON a.target_id = up.target_id AND a.category_id = up.category_id) AS f
//				GROUP BY f.planned, f.target_id";
		$sql = "SELECT a.target_id AS target_id, a.planned AS planned,
					ROUND(IFNULL(SUM(a.allowed),0),2) AS allowed, ROUND(IFNULL(up.used,0),2) AS used, ROUND(IFNULL(up.in_progress,0),2) AS in_progress,
					ROUND(IFNULL(SUM(a.allowed),0) - IFNULL(up.used,0) - IFNULL(up.in_progress,0), 2) AS rest
				FROM budget_per_project_allowed AS a
				LEFT OUTER JOIN (
					SELECT u.target_id AS target_id, c.planned AS planned, SUM(ifnull(u.used, 0)) AS used, SUM(ifnull(p.in_progress, 0)) AS in_progress
					FROM budget_per_project_used AS u
					LEFT JOIN budget_per_project_in_progress AS p ON p.target_id = u.target_id AND p.category_id = u.category_id, categories AS c
					WHERE u.category_id = c.id
					GROUP BY u.target_id, c.planned
				) AS up ON a.target_id = up.target_id AND a.planned = up.planned
				GROUP BY a.target_id, a.planned";

		$result = $this->query($sql);
		$rows = $result->fetchAll();

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $rows);
		$response->total = count($rows);

		echo $response;
	}
} 