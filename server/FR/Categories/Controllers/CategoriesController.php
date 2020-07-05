<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 23.06.14
 * Time: 0:05
 */

namespace FR\Categories\Controllers;


use FR\Application;
use FR\Auth\PrincipalService;
use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class CategoriesController extends CoreController {

	protected $root = 'categories';

	public function listAction() {
		$this->selectCategories(true);
	}

	public function sublistAction() {
		$this->selectCategories(false);
	}

	public function selectCategories($root = true) {

		$condition = $root ? '=' : '<>';

		$ps = new PrincipalService();

		if ($ps->checkAccess('categories', 'admin')) {
			$sql = "SELECT id, name, parent_id, active, planned, investment FROM categories WHERE parent_id $condition -1 ORDER BY name ASC";
		} else {
			$user_id = Application::getInstance()->getPrincipal()->id;
			$sql = "SELECT id, name, parent_id, active, planned, investment FROM user_permitted_categories WHERE parent_id $condition -1 AND user_id = " . $user_id . " ORDER BY name ASC";
		}

		$result = $this->query($sql);
		$rows = $result->fetchAll();

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $rows);
		$response->total = count($rows);

		echo $response;

	}

	public function treeAction() {

		$data = $this->decodeData('id');
		$nodes = $this->getChildren((int) $data);

		echo json_encode($nodes);
	}

	public function createAction() {
		$data = $this->decodeData();
		$sql = "INSERT INTO categories(name, parent_id, active, planned, investment) VALUES(:name, :parent_id, :active, :planned, :investment)";
		$params = array(
			':name' => $data->name,
			':parent_id' => $data->parent_id,
			':active' => (int) $data->active,
			':planned' => (int) $data->planned,
			':investment' => (int) $data->investment,
		);
		$this->query($sql, $params);
		$id = $this->db->lastInsertId();

		$sql = 'INSERT INTO user_categories (user_id, category_id) SELECT u.id AS user_id, c.id AS category_id FROM users u LEFT JOIN categories c ON 1=1 WHERE c.id = ' .$id;
		$this->query($sql);
	}

	public function updateAction() {
		$sql = "UPDATE categories SET name = :name, parent_id = :parent_id, active = :active, planned = :planned, investment = :investment WHERE id = :id";

		$data = $this->decodeData();

		if (!is_array($data)) {
			$data = array($data);
		}

		$nodes = array();
		foreach ($data as $row) {
			$params = array(
				':name' => $row->name,
				':parent_id' => (int) $row->parent_id,
				':active' => (int) $row->active,
				':planned' => (int) $row->planned,
				':investment' => (int) $row->investment,
				':id' => (int) $row->id,
			);
			$this->query($sql, $params);
			$nodes[] = $this->getChildren($row->id);
		}
	}

	private function getChildren($parent) {
		$sql = "SELECT c.id AS id, c.name as name, children.cnt as leaf, c.parent_id as parent_id, c.active AS active, c.planned AS planned, c.investment AS investment
				FROM categories AS c
				LEFT JOIN (SELECT count(id) as cnt, parent_id FROM categories GROUP BY parent_id) children ON c.id = children.parent_id
				WHERE c.parent_id = :parent_id";

		$nodes = array();

		$result = $this->query($sql, array(':parent_id' => $parent));
		$rows = $result->fetchAll();

		foreach($rows as $row) {
			$row->leaf = $row->parent_id > 0;
			$children = $this->getChildren((int) $row->id);
			$row->children = $children != null ? $children : array();

			$nodes[] = $row;
		}

		return sizeof($nodes) ? $nodes : null;
	}

}
