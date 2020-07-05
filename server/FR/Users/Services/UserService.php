<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 27.06.14
 * Time: 11:47
 */

namespace FR\Users\Services;


use FR\Core\Services\CoreService;

class UserService extends CoreService {

	private $cachedUser = null;

	public function findById($id) {

		if ($id === null) {
			return null;
		}

		if ($this->cachedUser === null || $this->cachedUser->id !== $id) {
			$sql = "SELECT * FROM users where id = :id";
			$params = array(
				':id' => $id
			);

			$result = $this->query($sql, $params);
			$data = $result->fetch();
			$this->cachedUser = new User($data);
		}

		return $this->cachedUser;
	}
}