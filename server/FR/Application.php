<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 17.06.14
 * Time: 17:00
 */


namespace FR;



class Application {

	/**
	 * @var Application
	 */
	private static $instance;

	/**
	 * @var Object
	 */
	private $db = null;

	/**
	 * @var Object
	 */
	private $principal = null;

	/**
	 * @var array
	 */
	private $config = array();

	/**
	 * @var string
	 */
	private $context_path;

	private function __construct() {
		$this->initErrorHandler();
		$this->initDatabase();
		if (FR_ENV == 'maintenance') {
			return;
		}
	}

	public static function getInstance() {
		if (self::$instance == null) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	public function run($context_path = null) {
		if (null === $context_path) {
			$this->context_path = realpath(__DIR__ . DS . '..' . DS . '..');
		} else {
			$this->context_path = $context_path;
		}
		$router = new Router();
		$router->route();
	}

	public function getDB() {
		return $this->db;
	}

	public function getPrincipal() {
		return $this->principal;
	}

	public function setPrincipal($principal) {
		$this->principal = $principal;
	}

	public function clearPrincipal() {
		$this->principal = null;
	}

	public function getConfig($key = null) {
		if (null === $key) {
			return $this->config;
		} else {
			return $this->config[$key];
		}
	}

	public function setConfig($data) {
		$this->config = $data;
	}

	public function getContextPath() {
		return $this->context_path;
	}

	private function initErrorHandler() {
		//set_error_handler(array($this, 'errorHandler'));
	}

	private function initDatabase() {
		global $config;

		$dsn = $config['db']['type'] . ':host=' . $config['db']['host'] . ';dbname=' . $config['db']['schema'] . ';charset=UTF8';
		$this->db = new \PDO($dsn, $config['db']['user'], $config['db']['pass'], array(
			\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_OBJ,
			\PDO::ATTR_PERSISTENT => true,
			\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
			\PDO::ATTR_EMULATE_PREPARES => false,
			\PDO::ATTR_STRINGIFY_FETCHES => false
		));
	}

	public function errorHandler($errno, $errstr, $errfile, $errline ) {
		throw new \ErrorException($errstr, $errno, 0, $errfile, $errline);
	}
}