<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 17.06.14
 * Time: 22:11
 */

namespace FR\Core\Models;


abstract class CoreEntity {

	protected $data;

	public function __construct($data = null) {
		if (!$data === null) {
			$this->data = is_array($data) ? $data : array();
		}
	}

	public function __get($name) {
		return $this->data[$name];
	}

	public function __set($name, $value) {
		$this->data[$name] = $value;
	}

	public function __call($name, array $value) {

		$modifier = substr($name, 0, 3);
		$key = substr($name, 3);
		$param = $value[0];

		switch($modifier) {
			case 'set':
				if ($key == 'Data' && is_array($param)) {
					$this->data = array_merge($this->data, $param);
				} else {
					$this->$key = $param;
				}
				return $this;
			case 'get':
				if ($key == 'Data') {
					return $this->data;
				}
				return $this->data[$key];
			default:
				throw new \BadMethodCallException();
		}
	}

	public function __toString() {
		return json_encode($this->data);
	}

}