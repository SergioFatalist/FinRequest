<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 01.07.14
 * Time: 0:31
 */

namespace FR\Auth;


use FR\Application;
use FR\Core\Services\CoreService;

class PrincipalService extends CoreService {

	public function getById($id) {

		$sql = 'SELECT * FROM users WHERE id = :id';
		$params = array(
			':id' => $id
		);
		$result = $this->query($sql, $params);

		if ($result == null) {
			return null;
		}
		$principal = $result->fetch();
		$principal->password = '';
		$principal->access = $this->getAccess($id);

		return $principal;
	}

	public function getByLoginAndEmail($login, $email) {
		$sql = 'SELECT * FROM users WHERE login = :login AND email = :email';
		$params = array(
			':login' => $login,
			':email' => $email
		);
		$result = $this->query($sql, $params);

		if ($result == null) {
			return null;
		}
		$principal = $result->fetch();
		if (is_object($principal) && NULL !== $principal->login) {
			$principal->password = '';
			$principal->access = $this->getAccess($principal->id);
		} else {
			$principal = null;
		}

		return $principal;
	}

	public function getByCredentials($login, $password) {
		$sql = 'SELECT * FROM users WHERE login = :login AND password = PASSWORD(:passwd)';
		$params = array(
			':login' => $login,
			':passwd' => $password
		);

		$result = $this->query($sql, $params);
		$principal = $result->fetch();

        if (is_object($principal) && NULL !== $principal->login) {
            $principal->password = '';
            $principal->access = $this->getAccess($principal->id);
        } else {
            $principal = null;
        }

		return $principal;
	}

	public function getAccess($id) {

		$sql = 'SELECT modules.sysname AS module, modules_actions.sysname AS action, group_actions.permit AS group_permit, user_actions.permit AS user_permit
				FROM users, modules, (group_actions group_actions
				INNER JOIN modules_actions modules_actions
				ON (group_actions.action_id = modules_actions.id))
				LEFT OUTER JOIN user_actions user_actions
				ON (user_actions.action_id = modules_actions.id AND user_actions.user_id = :uid1)
				WHERE (group_actions.group_id = users.group_id) AND (modules_actions.module_id = modules.id) AND users.id = :uid2';
		$params = array(
			':uid1' => $id,
			':uid2' => $id
		);
		$result = $this->query($sql, $params);
		$acls = $result->fetchAll();

		$access = array();
		foreach($acls as $acl) {
			if ($acl->user_permit === null) {
				if ($acl->group_permit == 1) {
					$access[$acl->module][] = $acl->action;
				}
			} else {
				if ($acl->user_permit == 1) {
					$access[$acl->module][] = $acl->action;
				}
			}
		}

		return $access;
	}

	public function checkAccess($module, $action, $principal = null) {
		if ($principal === null) {
			$principal = Application::getInstance()->getPrincipal();
		}
		if (array_key_exists($module, $principal->access)) {
			foreach($principal->access[$module] as $k => $perm) {
				if ($perm == $action) {
					return true;
				}
			}
		}
		return false;
	}
}