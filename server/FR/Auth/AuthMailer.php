<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 29.10.2014
 * Time: 22:27
 */

namespace FR\Auth;


use FR\Core\CoreMailer;

class AuthMailer extends CoreMailer {


	public function sendPasswordMail($user) {

		$params = array(
			'user_name' => $user->name,
			'user_login' => $user->login,
			'user_password' => $user->password,
			'URL' => $this->app->getConfig('url'),
			'admin_email' => $this->app->getConfig('admin_email'),
		);

		$message = $this->readTemplate('password_response');
		$message = $this->parseTemplate($message, $params);

		$this->sendMail($user->email, 'FINREQUEST - Новый пароль', $message);

	}

}