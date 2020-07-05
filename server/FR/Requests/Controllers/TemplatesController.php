<?php
/**
 * Created by PhpStorm.
 * User: sergio
 * Date: 27.07.14
 * Time: 12:33
 */

namespace FR\Requests\Controllers;


use FR\Application;
use FR\Core\Controllers\CoreController;
use FR\Core\JsonResponse;

class TemplatesController extends CoreController {

	protected $root = 'templates';

	public function listAction() {

		$principal = Application::getInstance()->getPrincipal();
		$sql = 'SELECT * FROM requests_templates WHERE author_id = :author_id ORDER BY id DESC';
		$params = array(
			':author_id' => $principal->id
		);

		$result = $this->query($sql, $params);
		$data = $result->fetchAll();

		$response = new JsonResponse();
		$response->success = true;
		$response->setData($this->root, $data);
		$response->total = count($data);

		echo $response;

	}

	public function createAction() {

		$template = $this->decodeData($this->root);
		if (is_array($template)) {
			$template = $template[0];
		}

		$points = array();
		if (array_key_exists('points', $_REQUEST)) {
			$points = $this->decodeData('points');
		}

		$sql = 'INSERT INTO requests_templates (dt_created, company_id, request_type, order_no, amount, category_id, p_l, contractor, description, dt_changed, author_id)
				VALUES (NOW(), :company_id, :request_type, :order_no, :amount, :category_id, :p_l, :contractor, :description, NOW(), :author_id)';
		$params = array(
			':company_id' => (int) $template->company_id,
			':request_type' => (int) $template->request_type,
			':order_no' => $template->order_no,
			':amount' => $template->amount,
			':category_id' => (int) $template->category_id,
			':p_l' => (int) $template->p_l,
			':contractor' => (int) $template->contractor,
			':description' => $template->description,
			':author_id' => Application::getInstance()->getPrincipal()->id
		);

		$this->query($sql, $params);
		$template_id = $this->db->lastInsertId();

		if (count($points) > 0) {
			$sql = 'INSERT INTO requests_templates_points (request_id, point_status, point_id, amount)
					VALUES (:request_id, :point_status, :point_id, :amount)';
			foreach($points as $point) {
				$params = array(
					':request_id' => $template_id,
					':point_status' => $point->point_status,
					':point_id' => $point->point_id,
					':amount' => $point->amount,
				);

				$this->query($sql, $params);
			}
		}

	}

	public function deleteAction() {

		$template = $this->decodeData($this->root);
		if (is_array($template)) {
			$template = $template[0];
		}

		if ($template->id > 0) {
			$sql = 'DELETE FROM requests_templates_points WHERE request_id = :id';
			$params = array(':id' => $template->id);
			$this->query($sql, $params);

			$sql = 'DELETE FROM requests_templates WHERE id = :id';
			$params = array(':id' => $template->id);
			$this->query($sql, $params);
		}
	}

	public function pointsAction() {

		$request_id = $this->requestField('request_id');

		$sql = 'SELECT nets.id AS net_id,
					requests_templates_points.point_id AS point_id,
					requests_templates_points.request_id AS request_id,
					requests_templates_points.point_status AS point_status,
					requests_templates_points.amount AS amount
				FROM requests_templates_points, points, nets
				WHERE requests_templates_points.point_id = points.id
					AND points.net_id = nets.id
					AND requests_templates_points.request_id = :request_id';

		$params = array(':request_id' => $request_id);

		$result = $this->query($sql, $params);
		$data = $result->fetchAll();

		$response = new JsonResponse();
		$response->success = true;
		$response->setData('points', $data);
		$response->total = count($data);

		echo $response;
	}
} 