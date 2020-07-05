<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 26.06.14
 * Time: 14:21
 */

namespace FR\Requests;


use FR\Application;
use FR\Auth\PrincipalService;

class RequestHelper {

	private $db = null;

	private $groups = array();
	private $statuses = array();
	private $rules = array();

	private $statuses_regisrty = array();

	public function __construct() {
		$this->db = Application::getInstance()->getDB();
		$this->loadGroups();
		$this->loadStatuses();
	}

	public function getGroupId($sysname = null) {

		if (count($this->groups) == 0) {
			$this->loadGroups();
		}

		if ($sysname == null) {
			return $this->groups;
		}

		if (array_key_exists($sysname, $this->groups)) {
			return $this->groups[$sysname];
		}

		return null;
	}

	public function getGroupName($id) {
		foreach($this->groups as $k => $v) {
			if ($v == $id) {
				return $k;
			}
		}
	}

	public function getStatusId($sysname) {

		if (count($this->statuses) == 0) {
			$this->loadStatuses();
		}

		if (array_key_exists($sysname, $this->statuses)) {
			return $this->statuses[$sysname];
		}

		return null;
	}

	public function getStatusName($id) {
		foreach($this->statuses as $k => $v) {
			if ($v == $id) {
				return $k;
			}
		}
	}

	public function getNextStatus($status) {

		if (count($this->statuses_regisrty) == 0) {
			$this->loadStatusesRegistry();
		}

		$last_status = 0;
		foreach ($this->statuses_regisrty as $st) {
			if ($st['decline_id'] == $status) {
				break;
			}

			if ($last_status == $status) {
				return $st['accept_id'];
			}

			$last_status = $st['accept_id'];
		}

		return $this->getStatusId('created');
	}

	public function checkEdit($request) {

	}

	public function checkApprove($request) {

		$srv = new PrincipalService();
		return $srv->checkAccess('requests', 'approve');

//		/*
//		 * Рядовые пользователи и Администраторы не могут утверждать заявки
//		 */
//		$principal = Application::getInstance()->getPrincipal();
//		if($principal->group_id == $this->getGroupId('admin') || $principal->group_id == $this->getGroupId('user')) {
//			return false;
//		}
//
//		/*
//		 * Если заявка создана, ее можно утверждать
//		 */
//		if ($this->getStatusName($request->status) == 'created') {
//			return true;
//		}
//
//		/*
//		 * Если заявка уже оплачена, ее нельзя утверждать
//		 */
//		if ($this->getStatusName($request->status) == 'paid') {
//			return false;
//		}
//
//		/*
//		 * Если заявка уже отклонена, ее нельзя утверждать
//		 */
//		list($group_name, $status_part) = preg_split('/_/', $this->getStatusName($request->status));
//		if ($status_part == 'declined' || $status_part == 'paid' ) {
//			return false;
//		}
//
//		/*
//		 * Если заявка уже проходила утверждение и следующий статус не соответсвует группе пользователя, утверждать не разрешается
//		 */
//		$next_status = $this->getNextStatus($request->status);
//		$next_status_name = $this->getStatusName($next_status);
//		if ($next_status_name != 'created' && $next_status_name != 'paid') {
//			list($group_part, $status_part) = preg_split('/_/', $next_status_name);
//			$principal_group_name = $this->getGroupName($principal->group_id);
//			if ($principal_group_name != $group_part) {
//				return false;
//			}
//		}
//
//		/*
//		 * Во всех остальных случаях утверждать разрешается
//		 */
//		return true;
	}

//	public function processAutoApproveRules(&$request) {
//
////		$sql = 'SELECT * FROM request_rules WHERE active = 1 ORDER BY ordering ASC';
//
//	}

	public function processingRules($request) {

		$request->rules = array();

		if (count($this->rules) == 0) {
			$this->loadRules();
		}

		if ($request->status == 0) {
			$request->status = $this->getNextStatus(0);
		}

		if ($this->getStatusName($request->status) == 'paid') {
			return $request;
		}

		$parts = preg_split('/_/', $this->getStatusName($request->status));
		if (isset($parts[1]) && $parts[1] == 'declined') {
			return $request;
		}

		foreach ($this->rules as $rule) {
			foreach ($rule->conditions as $condition) {
				$condition_true = false;

				$left_value = null;
				$right_value = $condition->value;
				switch ($condition->left_entity) {
					case 'requests':
						switch ($condition->left_field) {
							case 'author':
								$sql = 'SELECT * FROM users WHERE id = :id';
								$params = array(':id' => $request->author_id);
								$sth = $this->db->prepare($sql);
								$sth->execute($params);
								$user = $sth->fetch(\PDO::FETCH_ASSOC);
								$left_value = $user[$condition->right_field];
								break;
							case 'status':
								$left_value = $request->status;
								break;
							case 'category':
								$left_value = $request->category_id;
								break;
							case 'amount':
								$left_value = $request->amount;
								break;
						}
						break;
				}

				switch($condition->cond) {
					case '==':
						$condition_true = $left_value == $right_value;
						break;
					case '!=':
						$condition_true = $left_value != $right_value;
						break;
					case '>':
						$condition_true = $left_value > $right_value;
						break;
					case '<':
						$condition_true = $left_value < $right_value;
						break;
					case '>=':
						$condition_true = $left_value >= $right_value;
						break;
					case '<=':
						$condition_true = $left_value <= $right_value;
						break;
				}

				if (!$condition_true) {
					continue(2);
				}

				if (count($condition->actions) != 0) {
					foreach ($condition->actions as $action) {
						switch($action->left_entity) {
							case 'requests':
								switch($action->left_field) {
									case 'status':
										switch($action->action) {
											case 'set':
												$request->status = $action->value;
												$request->rules[] = $rule->id;
												break;
											case 'inc':
												$request->status = $this->getNextStatus($request->status);
												break;
										}
								}
						}
						if ($action->stop == 1) {
							break(3);
						}
					}
				}
			}
		}

		return $request;
	}

	private function loadGroups() {
		$sth = $this->db->query('SELECT * FROM groups');
		$rows = $sth->fetchAll();

		foreach($rows as $row) {
			$this->groups[$row->sysname] = $row->id;
		}
	}

	private function loadStatuses() {
		$sth = $this->db->query('SELECT * FROM requests_statuses');
		$rows = $sth->fetchAll();

		foreach($rows as $row) {
			$this->statuses[$row->sysname] = $row->id;
		}
	}

	private function loadStatusesRegistry() {
		$sql = 'SELECT ra.id AS accept_id, ra.name AS approve_name, rd.id AS decline_id, rd.name AS decline_name, ra.ordering
			FROM requests_statuses AS ra
			LEFT OUTER JOIN requests_statuses AS rd ON rd.complement_id = ra.id
			WHERE ra.is_approve = 1
			ORDER BY ra.ordering asc;';
		$sth = $this->db->query($sql);
		$this->statuses_regisrty = $sth->fetchAll(\PDO::FETCH_ASSOC);
	}

	private function loadRules() {
		$sql = 'SELECT * FROM rules WHERE active = 1 ORDER BY ordering ASC';
		$result = $this->db->query($sql);
		$this->rules = $result->fetchAll();

		foreach($this->rules as $rule) {
			$sql = 'SELECT rc.id AS id,
						lre.sysname AS left_entity,
						lrf.sysname AS left_field,
						rc.cond AS cond,
						rre.sysname AS right_entity,
						rrf.sysname AS right_field,
						rc.value AS value
					FROM rules_entities AS lre, rules_fields AS lrf,
						rules_conditions AS rc
						LEFT JOIN rules_entities AS rre ON rc.right_entity_id = rre.id
						LEFT JOIN rules_fields AS rrf ON rc.right_field_id = rrf.id
					WHERE rc.left_entity_id = lre.id
							AND rc.left_field_id = lrf.id
							AND rule_id = :rule_id
							AND rc.active = 1
					ORDER BY rc.ordering ASC';
			$params = array(
				':rule_id' => $rule->id
			);
			$sth = $this->db->prepare($sql);
			$sth->execute($params);
			$conditions = $sth->fetchAll();
			foreach($conditions as &$condition) {
				$sql = 'SELECT ra.id AS id,
								ra.stop AS stop,
								lre.sysname AS left_entity,
								lrf.sysname AS left_field,
								ra.action AS action,
								rre.sysname AS right_entity,
								rrf.sysname AS right_field,
								ra.value AS value
							FROM rules_entities AS lre, rules_fields AS lrf, rules_actions AS ra
								LEFT JOIN rules_entities AS rre ON ra.right_entity_id = rre.id
								LEFT JOIN rules_fields AS rrf ON ra.right_field_id = rrf.id
							WHERE ra.left_entity_id = lre.id
								AND ra.left_field_id = lrf.id
								AND ra.condition_id = :condition_id
								AND ra.active = 1
							ORDER BY ra.id ASC';
				$params = array(
					':condition_id' => $condition->id
				);
				$sth = $this->db->prepare($sql);
				$sth->execute($params);
				$actions = $sth->fetchAll();
				if (!is_array($actions)) {
					$actions = array($actions);
				}
				$condition->actions = $actions;
				$rule->conditions[] = $condition;
			}

		}

	}

} 