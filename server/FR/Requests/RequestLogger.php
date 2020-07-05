<?php
/**
 * Created by PhpStorm.
 * User: sergio
 * Date: 22.10.14
 * Time: 00:12
 */

namespace FR\Requests;


use FR\Application;
use FR\Core\Services\CoreService;

class RequestLogger extends CoreService {

	public function logRequest($comment, $request) {

		$details = '(';
		$i = 0;
		foreach ($request as $k => $v) {
			$details .= $i ? ', ' : '';

			$details .= (is_array($k) || is_array($v)) ? '' : $k . '=' . $v;
			$i++;
		}
		$details .= ')';

		$this->log($comment, $details, $request->id, $request->status);
	}

	public function logPoints($comment, $request, $points) {

		$details = '[';
		$i = 0;
		foreach($points as $point) {
			$details .= $i ? ', ' : '';
			$details .= '(';
			$j = 0;
			foreach ($point as $k => $v) {
				$details .= $j ? ', ' : '';
				$details .= $k . '=' . $v;
				$j++;
			}
			$details .= ')';
			$i++;
		}
		$details .= ']';

		$this->log($comment, $details, $request->id, $request->status);
	}

	private function log($comment, $details, $request_id, $status) {

		$sql = 'INSERT INTO requests_history (request_id, user_id, status, dt, comment, details) VALUES (:request_id, :user_id, :status, NOW(), :comment, :details)';
		$params = array(
			':request_id' => $request_id,
			':user_id' => Application::getInstance()->getPrincipal()->id,
			':status' => $status,
			':comment' => $comment,
			':details' => $details
		);

		$this->query($sql, $params);
	}

}