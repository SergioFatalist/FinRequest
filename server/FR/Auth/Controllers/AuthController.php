<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 17.06.14
 * Time: 17:42
 */

namespace FR\Auth\Controllers;


use FR\Application;
use FR\Auth\AuthMailer;
use FR\Auth\Models\Principal;
use FR\Auth\PrincipalService;
use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class AuthController extends CoreController {

	public function loginAction() {

		$ps = new PrincipalService();

		$login = array_key_exists('loginUsername', $_POST) ? $_POST['loginUsername'] : '';
		$password = array_key_exists('loginPassword', $_POST) ? $_POST['loginPassword'] : '';

		$response = new JsonResponse();
		if (strlen($login) == 0 || strlen($password) == 0) {
			$response->message = 'Логин и/или пароль не могут быть пустыми';
			echo $response;
			return;
		}

		$principal = $ps->getByCredentials($login, $password);

		if (NULL === $principal) {
			$response->message = 'Неверное имя пользователя или пароль!';
		} else if (0 === $principal->active) {
			$response->message = 'Ваш профиль заблокирован администратором!';
		} else {
			$_SESSION['last_activity'] = time();
			$_SESSION['user_id'] = $principal->id;

			$this->app->setPrincipal($principal);
			$response->success = true;
		}

		echo $response;
	}

	public function logoutAction() {
		$this->app->clearPrincipal();
		session_unset();
		session_destroy();
		header("Location: /");
	}

	public function principalAction() {

		$srv = new PrincipalService();
		$id = (int) $this->decodeData('id');

		$principal = ($id == 0) ? Application::getInstance()->getPrincipal() : $srv->getById($id);

		$response = new JsonResponse();
		$response->success = true;
		$response->setData('principal', $principal);

		echo $response;
	}

	public function changePasswordAction() {

		$ps = new PrincipalService();
		$login = array_key_exists('loginUsername', $_POST) ? $_POST['loginUsername'] : '';
		$email = array_key_exists('loginEmail', $_POST) ? $_POST['loginEmail'] : '';

		$response = new JsonResponse();

		$principal = $ps->getByLoginAndEmail($login, $email);

		if (NULL === $principal) {
			$response->message = 'Пользователь с такими данными не найден!';
		} else if (0 === $principal->active) {
			$response->message = 'Ваш профиль заблокирован администратором!';
		} else {
			$principal->password = substr(str_shuffle("abcdefghijklmnopqrstuvwxyzZ0123456789"), 0, 6);

			$sql = 'UPDATE users SET password = PASSWORD(:password) WHERE id = :id';
			$params = array(
				':password' => $principal->password,
				':id' => $principal->id
			);
			$this->query($sql, $params);

			debug_var($principal);

			$mailer = new AuthMailer();
			$mailer->sendPasswordMail($principal);

			$response->success = true;
		}

		echo $response;
	}


}