<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 17.06.14
 * Time: 19:00
 */

namespace FR\Core;


class JsonResponse {

	private $data = array('success' => false);

	public function __get($name) {
		if (!array_key_exists($name, $this->data)) {
			$this->data[$name] = false;
		}
		return $this->data[$name];
	}

	public function __set($name, $value) {
		$this->data[$name] = $value;
	}

	public function __call($name, array $value) {

		$modifier = substr($name, 0, 3);
		$key = substr($name, 3);

		switch($modifier) {
			case 'set':
				if ($key == 'Data') {
					$this->data[$value[0]] = $value[1];
				} else {
					$this->data[$key] = $value[0];
				}
				return $this;
			case 'get':
				return $this->data[$key];
			default:
				throw new \BadMethodCallException();
		}
	}

	public function __toString() {
		return json_encode($this->data);
	}

}