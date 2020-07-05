<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 17.06.14
 * Time: 16:58
 */

namespace FR\Core\Controllers;


use FR\Application;
use FR\Auth\PrincipalService;
use FR\Core\JsonResponse;

abstract class CoreController {

	protected $db = null;
	protected $app = null;
	protected $root = 'data';

	private $cachedQuery = '';
	private $cachedSth = null;

	public function __construct() {
		$this->app = Application::getInstance();
		$this->db = $this->app->getDB();
		$this->init();
	}

	protected function init() {

		$this->initConfig();
		$this->initSession();

	}

	protected function query($sql, array $params = null) {
		try {
			if ($sql !== $this->cachedQuery) {
				$this->cachedQuery = $sql;
				$this->cachedSth = $this->db->prepare($sql);
			}
			$this->cachedSth->execute($params);

			return $this->cachedSth;

		} catch (\PDOException $e) {
			$response = new JsonResponse();
			$response->message = get_called_class() . " <br /> " . $e->getMessage();

			die($response);
		}
		return null;
	}

	protected function decodeData($root = null, $default = null) {

		$root = ($root == null) ? $this->root : $root;

		if (!array_key_exists($root, $_REQUEST) && $default === null) {
			$response = new JsonResponse();
			$response->message = 'Неверно сформированы данные запроса';
			die($response);
		}

		return array_key_exists($root, $_REQUEST) ? json_decode($_REQUEST[$root]) : $default;
	}

	protected function requestField($name = null, $default = null) {

		if (!array_key_exists($name, $_REQUEST) && $default === null) {
			$response = new JsonResponse();
			$response->message = 'Неверно сформированы данные запроса';
			die($response);
		}

		return array_key_exists($name, $_REQUEST) ? $_REQUEST[$name] : $default;
	}

	private function initConfig() {

		$sth = $this->db->prepare('SELECT * FROM parameters');
		$sth->execute();
		$rows = $sth->fetchAll();

		$config_data = array();
		foreach($rows as $row) {
			$config_data[$row->sysname] = $row->value;
		}

		$this->app->setConfig($config_data);
	}


	private function initSession() {

		if(!session_id()){
			session_start();
		}

		$now = time();

		if (isset($_SESSION['user_id']) && $_SESSION['user_id']>0) {
			if (!isset($_SESSION['message'])) {
				if (isset($_SESSION['last_activity']) && ($now - $_SESSION['last_activity'] < $this->app->getConfig('user_idle'))) {
					$_SESSION['last_activity'] = $now;
					$srv = new PrincipalService();
					$principal = $srv->getById((int)$_SESSION['user_id']);
					$this->app->setPrincipal($principal);
				} else {
					$_SESSION['message'] = 'Превышено время бездействия пользователя. Авторизуйтесь повторно.';
					if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
						header('HTTP/1.1 401 Unauthorized');
					} else {
						header('Refresh: 0; url=/');
					}
					unset($_SESSION['user_id']);
					exit;
				}
			}
			return;
		}

//		unset($_SESSION['message']);

//		if (isset($_SESSION['message'])) {
//			unset($_SESSION['message']);
//			return;
//		}

	}

}
