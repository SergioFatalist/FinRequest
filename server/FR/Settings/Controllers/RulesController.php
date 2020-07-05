<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 27.06.14
 * Time: 15:51
 */

namespace FR\Settings\Controllers;


use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class RulesController extends CoreController {

	protected $root = 'rules';

	public function listAction() {

		$tree = array();

		$sql = 'SELECT id, name, ordering, active FROM rules ORDER BY ordering ASC';
		$result = $this->query($sql);
		$rows = $result->fetchAll();

		foreach ($rows as $row) {
			$row->children = $this->getRuleConditions($row->id);
			$row->id = 'r-' . $row->id;
			$row->leaf = false;
			$row->iconCls = 'rule';
			$row->type = 'r';
			$tree[] = $row;
		}

		echo json_encode($tree);
	}

	public function createAction() {

		$data = $this->decodeData();

		switch($data->type) {
			case 'r':
				$sql = 'INSERT INTO rules (name, active) VALUES (:name, :active)';
				$params = array(
					':name' => $data->name,
					':active' => (int)$data->active
				);
				break;
			case 'c':
				$sql = 'INSERT INTO rules_conditions (rule_id, left_entity_id, left_field_id, cond, right_entity_id, right_field_id, value, active)
						VALUES (:rule_id, :left_entity_id, :left_field_id, :cond, :right_entity_id, :right_field_id, :value, :active)';
				$params = array(
					':rule_id' => (int)$data->rule_id,
					':left_entity_id' => (int)$data->left_entity_id,
					':left_field_id' => (int)$data->left_field_id,
					':cond' => $data->cond,
					':right_entity_id' => (int)$data->right_entity_id,
					':right_field_id' => (int)$data->right_field_id,
					':value' => $data->value,
					':active' => (int)$data->active,
				);
				break;
			case 'a':
				$sql = 'INSERT INTO rules_actions (condition_id, left_entity_id, left_field_id, action, right_entity_id, right_field_id, value, active, stop)
						VALUES (:condition_id, :left_entity_id, :left_field_id, :action, :right_entity_id, :right_field_id, :value, :active, :stop)';
				$params = array(
					':condition_id' => (int)$data->condition_id,
					':left_entity_id' => (int)$data->left_entity_id,
					':left_field_id' => (int)$data->left_field_id,
					':action' => $data->action,
					':right_entity_id' => (int)$data->right_entity_id,
					':right_field_id' => (int)$data->right_field_id,
					':value' => $data->value,
					':active' => (int)$data->active,
					':stop' => (int)$data->stop,
				);
				break;
			default:
				$response = new JsonResponse();
				$response->message = 'Неверно сформированы данные запроса';
				echo json_encode($response);
				return;
		}
		$this->query($sql, $params);
	}

	public function updateAction() {

		$data = $this->decodeData();

		if (!is_array($data)) {
			$data = array($data);
		}

		foreach($data as $row) {
			list($type, $id) = preg_split('/-/', $row->id, 2);

			switch ($type) {
				case 'r':
					$sql = 'UPDATE rules SET name = :name, active = :active, ordering = :ordering WHERE id = :id';
					$params = array(
						':name' => $row->name,
						':active' => (int) $row->active,
						':ordering' => (int) $row->ordering,
						':id' => intval($id)
					);
					break;
				case 'c':
					$params = array(
						':left_entity_id' => (int) $row->left_entity_id,
						':left_field_id' => (int) $row->left_field_id,
						':cond' => $row->cond,
						':value' => $row->value,
						':active' => (int) $row->active,
						':rule_id' => (int) $row->rule_id,
						':id' => (int)$id,
						':ordering' => $row->ordering
					);

					$sql = 'UPDATE rules_conditions SET left_entity_id = :left_entity_id, left_field_id = :left_field_id, cond = :cond, value = :value, active = :active, rule_id = :rule_id, ordering = :ordering';
					if (intval($row->right_entity_id) != 0) {
						$sql .= ', right_entity_id = :right_entity_id';
						$params[':right_entity_id'] = $row->right_entity_id;
					}

					if (intval($row->right_field_id) != 0) {
						$sql .= ', right_field_id = :right_field_id';
						$params[':right_field_id'] = $row->right_field_id;
					}
					$sql .= ' WHERE id = :id';
					break;
				case 'a':
					$params = array(
						':left_entity_id' => (int) $row->left_entity_id,
						':left_field_id' => (int) $row->left_field_id,
						':action' => $row->action,
						':value' => $row->value,
						':active' => (int) $row->active,
						':stop' => (int) $row->stop,
						':condition_id' => (int) $row->condition_id,
						':id' => (int)$id
					);

					$sql = 'UPDATE rules_actions SET left_entity_id = :left_entity_id, left_field_id = :left_field_id, action = :action, value = :value, active = :active, stop = :stop, condition_id = :condition_id';
					if (intval($row->right_entity_id) != 0) {
						$sql .= ', right_entity_id = :right_entity_id';
						$params[':right_entity_id'] = $row->right_entity_id;
					}

					if (intval($row->right_field_id) != 0) {
						$sql .= ', right_field_id = :right_field_id';
						$params[':right_field_id'] = $row->right_field_id;
					}
					$sql .= ' WHERE id = :id';
					break;
				default:
					$response = new JsonResponse();
					$response->message = 'Неверно сформированы данные запроса';
					echo json_encode($response);
					return;
			}

			$this->query($sql, $params);
		}
	}

	public function deleteAction() {

		list($type, $id) = preg_split('/-/', $this->requestField('id'), 2);

		switch ($type) {
			case 'r':
				$sql = 'DELETE FROM rules WHERE id = :id';
				break;
			case 'c':
				$sql = 'DELETE FROM rules_conditions WHERE id = :id';
				break;
			case 'a':
				$sql = 'DELETE FROM rules_actions WHERE id = :id';
				break;
			default:
				$response = new JsonResponse();
				$response->message = 'Неверно сформированы данные запроса';
				echo json_encode($response);
				return;
		}

		$params = array(
			':id' => intval($id)
		);
		$this->query($sql, $params);
	}

	public function fieldsAction() {
		$response = new JsonResponse();

		$result = $this->query('SELECT * FROM rules_fields ORDER BY name ASC');
		$rows = $result->fetchAll();

		$response->success = true;
		$response->setData('fields', $rows);
		$response->total = count($rows);

		echo $response;
	}

	public function entitiesAction() {
		$response = new JsonResponse();

		$result = $this->query('SELECT * FROM rules_entities ORDER BY name ASC');
		$rows = $result->fetchAll();

		$response->success = true;
		$response->setData('entities', $rows);
		$response->total = count($rows);

		echo $response;
	}

	private function getRuleConditions($rule) {

		$tree = array();

		$sql = 'SELECT rc.id AS id,
					rc.rule_id AS rule_id,
					le.id AS left_entity_id,
					le.name AS left_entity,
					lf.id AS left_field_id,
					lf.name AS left_field,
					rc.cond AS cond,
 					re.id AS right_entity_id,
 					re.name AS right_entity,
 					rf.id AS right_field_id,
 					rf.name AS right_field,
 					rf.mapped_to AS mapped_to,
 					rf.mapped_fields AS mapped_fields,
					rc.value AS value,
					rc.ordering AS ordering,
					rc.active AS active
				FROM rules_conditions AS rc
					LEFT JOIN rules_entities AS le ON rc.left_entity_id = le.id
					LEFT JOIN rules_fields AS lf ON rc.left_field_id = lf.id
 					LEFT JOIN rules_entities AS re ON rc.right_entity_id = re.id
 					LEFT JOIN rules_fields AS rf ON rc.right_field_id = rf.id
				WHERE rc.rule_id = :rule_id
				GROUP BY rc.id
				ORDER BY ordering ASC';
		$params = array(
			':rule_id' => $rule
		);
		$result = $this->query($sql, $params);
		$rows = $result->fetchAll();


		if (sizeof($rows) == 0) {
			return $rows;
		}

		foreach ($rows as $row) {
			$name  = $row->left_entity . '.' . $row->left_field . ' ' . $row->cond . ' ';
			if (trim($row->mapped_to) == '') {
				$name .= $row->value;
			} else {
				$name .= $row->right_entity . '.' . $row->right_field;
				switch ($row->mapped_to) {
					case 'users':
						$sql = 'SELECT * FROM users WHERE id = :id';
						$params = array(':id' => $row->value);
						break;
					case 'groups':
						$sql = 'SELECT * FROM groups WHERE id = :id';
						$params = array(':id' => $row->value);
						break;
					case 'statuses':
						$sql = 'SELECT * FROM requests_statuses WHERE id = :id';
						$params = array(':id' => $row->value);
						break;
					case 'categories':
						$sql = 'SELECT * FROM categories WHERE id = :id';
						$params = array(':id' => $row->value);
						break;
				}
				$res = $this->db->prepare($sql);
				$res->execute($params);
				$subrow = $res->fetch();
				$name .= '.' . $subrow->name;
			}

			$condition = array();
			$condition['id'] = 'c-' . $row->id;
			$condition['name'] = $name;
			$condition['leaf'] = false;
			$condition['iconCls'] = 'rule-condition';
			$condition['active'] = $row->active;
			$condition['type'] = 'c';

			$condition['rule_id'] = $row->rule_id;
			$condition['left_entity_id'] = $row->left_entity_id;
			$condition['left_field_id'] = $row->left_field_id;
			$condition['cond'] = $row->cond;
			$condition['right_entity_id'] = $row->right_entity_id;
			$condition['right_field_id'] = $row->right_field_id;
			$condition['mapped_to'] = $row->mapped_to;
			$condition['mapped_fields'] = $row->mapped_fields;
			$condition['value'] = $row->value;

			$condition['children'] = $this->getRuleActions($row->id);

			$tree[] = $condition;
		}
		return $tree;
	}

	private function getRuleActions($condition) {

		$tree = array();

		$sql = 'SELECT ra.id AS id,
					ra.condition_id AS condition_id,
					le.id AS left_entity_id,
					le.name AS left_entity,
					lf.id AS left_field_id,
					lf.name AS left_field,
					ra.action AS action,
 					re.id AS right_entity_id,
 					re.name AS right_entity,
 					rf.id AS right_field_id,
 					rf.name AS right_field,
 					rf.mapped_to AS mapped_to,
 					rf.mapped_fields AS mapped_fields,
					ra.value AS value,
					ra.stop AS stop,
					ra.ordering AS ordering,
					ra.active AS active
				FROM rules_actions AS ra
					LEFT JOIN rules_entities AS le ON ra.left_entity_id = le.id
					LEFT JOIN rules_fields AS lf ON ra.left_field_id = lf.id
 					LEFT JOIN rules_entities AS re ON ra.right_entity_id = re.id
 					LEFT JOIN rules_fields AS rf ON ra.right_field_id = rf.id
				WHERE ra.condition_id = :condition_id
				GROUP BY ra.id
				ORDER BY ordering ASC';
		$params = array(
			':condition_id' => $condition
		);
		$result = $this->query($sql, $params);
		$rows = $result->fetchAll();

		foreach ($rows as $row) {
			$name  = $row->left_entity . '.' . $row->left_field;
			switch($row->action) {
				case 'set':
					$name .= ' Присвоить ';
					break;
				case 'inc':
					$name .= ' Увеличить ';
					break;
				case 'dec':
					$name .= ' Уменьшить ';
					break;
			}

			if ($row->mapped_to === null || $row->mapped_to == '') {
				$row->mapped_to = '';
				$name .= $row->value;
			} else {
				$name .= $row->right_entity . '.' . $row->right_field;
				switch ($row->mapped_to) {
					case 'users':
						$sql = 'SELECT * FROM users WHERE id = :id';
						$params = array(':id' => $row->value);
						break;
					case 'groups':
						$sql = 'SELECT * FROM groups WHERE id = :id';
						$params = array(':id' => $row->value);
						break;
					case 'statuses':
						$sql = 'SELECT * FROM requests_statuses WHERE id = :id';
						$params = array(':id' => $row->value);
						break;
					case 'categories':
						$sql = 'SELECT * FROM categories WHERE id = :id';
						$params = array(':id' => $row->value);
						break;
				}
				$res = $this->query($sql, $params);
				$subrow = $res->fetch();
				$name .= '.' . $subrow->name;
			}

			$action = array();
			$action['id'] = 'a-' . $row->id;
			$action['condition_id'] = $row->condition_id;
			$action['name'] = $name;
			$action['left_entity_id'] = $row->left_entity_id;
			$action['left_field_id'] = $row->left_field_id;
			$action['action'] = $row->action;
			$action['right_entity_id'] = $row->right_entity_id;
			$action['right_field_id'] = $row->right_field_id;
			$action['mapped_to'] = $row->mapped_to;
			$action['mapped_fields'] = $row->mapped_fields;
			$action['value'] = $row->value;
			$action['active'] = $row->active;
			$action['stop'] = $row->stop;
			$action['ordering'] = $row->ordering;
			$action['leaf'] = true;
			$action['iconCls'] = 'rule-action';
			$action['type'] = 'a';

			$tree[] = $action;
		}

		return $tree;
	}
} 