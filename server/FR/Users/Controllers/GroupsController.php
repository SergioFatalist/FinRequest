<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 22.06.14
 * Time: 18:12
 */

namespace FR\Users\Controllers;


use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class GroupsController extends CoreController {

	protected  $root = 'groupslist';
	protected  $aclRoot = 'groupacl';

	public function listAction() {

		$response = new JsonResponse();

		$result = $this->query("SELECT * FROM groups");
		$rows = $result->fetchAll(\PDO::FETCH_ASSOC);

		$response->success = true;
		$response->setData($this->root, $rows);
		$response->total = count($rows);

		echo $response;
	}

	public function updateAction() {

		$sql = "UPDATE groups SET name = :name WHERE id = :id";

		$data = $this->decodeData();

		if (is_array($data)) {
			foreach($data as $row) {
				$params = array(
					':name' => $row->name,
					':id' => $row->id
				);
				$this->query($sql, $params);
			}
		} else {
			$params = array(
				':name' => $data->name,
				':id' => $data->id
			);
			$this->query($sql, $params);
		}
	}

	public function aclTreeAction() {

		$group_id = (int) $this->decodeData('group_id');

		$mod_res = $this->query("SELECT id, name as `text`, 0 as leaf FROM modules");
		$modules = $mod_res->fetchAll();
		$nodes = array();

		$sql = "SELECT ga.id, ga.group_id as group_id, ma.name as text, 1 as leaf, ga.permit as permit
				FROM group_actions AS ga LEFT JOIN modules_actions AS ma ON ga.action_id = ma.id WHERE ma.module_id = :module_id AND ga.group_id = :group_id";
		foreach($modules as $module) {
			$params = array(':module_id' => (int) $module->id, ':group_id' => $group_id);
			$perm_res =  $this->query($sql, $params);
			$perms = $perm_res->fetchAll();
			$module->id = 'm-' . $module->id;
			//$module->children = $perms;
			foreach($perms as $perm) {
				$perm->id = 'p-' . $perm->id;
				$module->children[] = $perm;
			}
			$nodes[] = $module;
		}

		echo json_encode($nodes);
	}

	public function aclUpdateAction() {

		$data = $this->decodeData($this->aclRoot);
		if (!is_array($data)) {
			$data = array($data);
		}

		$sql = "UPDATE group_actions SET permit = :permit WHERE id = :id";
		foreach($data as $acl) {
			list($t, $id) = preg_split('/-/', $acl->id);
			$params =  array(
				':permit' => (int) $acl->permit,
				':id' => (int) $id
			);
			$this->query($sql, $params);
		}

	}

}