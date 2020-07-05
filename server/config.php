<?php
	global $config;
	
	$config['baseurl'] = 'http://example.com.ua/';
	
	$config['db']['type']	= "mysql";
	$config['db']['host']	= "localhost";
	$config['db']['schema']	= "2019";
	$config['db']['user']	= "user";
	$config['db']['pass']	= "password";
	

function debug_var($var) {
	ob_start();
	var_dump($var);
	$output = ob_get_clean();
	file_put_contents('log.txt', $output, FILE_APPEND);

}

function dump_pre($var) {
	echo "<pre>";
	echo var_dump($var);
	echo "</pre>";
}

