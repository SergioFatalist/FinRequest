<?php
ini_set('session.cookie_lifetime', 0);

define('DS', DIRECTORY_SEPARATOR);

/*
 * Версия системы
 */
define('VERSION', '4.2.1');

/*
 * development  - режим разработки (загружается библиотека ExtJS в debug режиме с комментариями)
 * production   - режим регулярной работы - (загружается сжатая библиотека ExtJS)
 * maintenance  - режим обновления (работа заблокирована, выводится соотвюсообщение)
*/
define('FR_ENV', 'development');

if (FR_ENV == 'development') {
	error_reporting(E_ALL);
} else {
	error_reporting(E_ERROR & ~E_NOTICE);
}

require_once 'server/config.php';
require_once 'vendor/Symfony/Component/ClassLoader/UniversalClassLoader.php';

$loader = new \Symfony\Component\ClassLoader\UniversalClassLoader();
$loader->registerNamespaces(array(
	'FR' => __DIR__ . DS . 'server'
));
$loader->registerPrefixes(array(
	'PHPExcel' => __DIR__ . DS . 'vendor' . DS . 'PHPExcel',
	'PHPMailer' => __DIR__ . DS . 'vendor' . DS . 'PHPMailer',
));
$loader->useIncludePath(true);
$loader->register();

$app = \FR\Application::getInstance();
$app->run();
