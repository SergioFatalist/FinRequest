<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 17.06.14
 * Time: 15:30
 */

namespace FR;

class Router {

	public function route() {
		$uri = $_SERVER['REQUEST_URI'];
		if (strpos($uri, '?') != 0) {
			$uri = substr($uri, 0, strpos($uri, '?'));
		}
		$routes = explode('/', strtolower($uri));

		$controllerName = 'FR\Core\Controllers\IndexController';
		$actionMethod = 'indexAction';

		if (count($routes) == 4) {
			$controllerName = 'FR\\' . ucwords($routes[1]) . '\\Controllers\\' . ucwords($routes[2]) . "Controller";
			$actionMethod = $routes[3] . 'Action';
		}

		$controller = new $controllerName;
		$controller->$actionMethod();
	}

}
