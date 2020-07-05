<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 27.06.14
 * Time: 11:48
 */

namespace FR\Core\Services;


use FR\Application;

class CoreService {

	private $db;

	private $sth;

	private $sql;


	public function __construct() {
		$this->db = Application::getInstance()->getDB();
	}

	protected function prepare($sql) {

		if ($this->sql === $sql && $this->sth !== null) {
			return $this->sth;
		}

		try {
			$this->sth = $this->db->prepare($sql);
			$this->sql = $sql;
		} catch (\PDOException $e) {
			debug_print_backtrace();
		}

		return $this->sth;
	}

	protected function execute($params) {

		if ($this->sth === null && $this->sql !== null) {
			$this->prepare($this->sql);
		}

		try {
			$this->sth->execute($params);
			return $this->sth;
		} catch (\PDOException $e) {
			debug_print_backtrace();
		}

	}

	protected function query($sql, $params) {

		$this->prepare($sql);

		return $this->execute($params);
	}
}