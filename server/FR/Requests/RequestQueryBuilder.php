<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 28.10.2014
 * Time: 21:41
 */

namespace FR\Requests;


use FR\Application;

class RequestQueryBuilder {

	public function buildRequestsListQuery($limited = false) {

		$app = Application::getInstance();
		$principal = $app->getPrincipal();
		$helper = new RequestHelper();
		
		$query['sql'] = 'SELECT SQL_CALC_FOUND_ROWS * FROM (
				SELECT count(*) as nets_count, r.*, sum(r.amount) FROM (
				SELECT requests.id, requests.dt_created, requests.company_id, points.net_id, points.id AS point_id,
					requests.dt_payment, requests.order_no, requests.p_l, requests.category_id, requests.amount, requests.payment_type,
					requests.description, requests.author_id, requests.status, requests.contractor, requests.request_type,
					authors.name as requester, authors.group_id as requester_level, authors.master_id,
					nets.curator_id as net_curator_id, nets.chief_operating_officer_id as net_chief_operating_officer_id,
					1 as allow_edit
				FROM requests, requests_points, contractors, users as authors, nets, points
				WHERE authors.id = requests.author_id
					AND contractors.id = requests.contractor
					AND requests_points.request_id = requests.id
					AND points.id = requests_points.point_id
					AND nets.id = points.net_id';

		$query['params'] = array();

		if(isset($_POST['startdate'])) {
			$query['sql'] .= ' AND requests.dt_created >= :startdate ';
			$query['params'][':startdate'] = $_POST['startdate'];
		}

		if(isset($_POST['enddate'])) {
			$query['sql'] .= ' AND requests.dt_created <= :enddate ';
			$query['params'][':enddate'] = $_POST['enddate'];
		}

		if(isset($_POST['status']) && $_POST['status'] > 0) {
			$query['sql'] .= ' AND requests.status = :status ';
			$query['params'][':status'] = (int)$_POST['status'];
		}

		if(isset($_POST['category']) && $_POST['category'] > 0) {
			$query['sql'] .= ' AND (requests.category_id = :category OR requests.p_l = :p_l) ';
			$query['params'][':category'] = (int)$_POST['category'];
			$query['params'][':p_l'] = (int)$_POST['category'];
		}

		if(isset($_POST['network']) && $_POST['network'] > 0) {
			$query['sql'] .= ' AND points.net_id = :network ';
			$query['params'][':network'] = (int)$_POST['network'];
		}

		if(isset($_POST['point']) && $_POST['point'] > 0) {
			$query['sql'] .= ' AND points.id = :point ';
			$query['params'][':point'] = (int)$_POST['point'];
		}

		if(isset($_POST['contractor']) && $_POST['contractor'] != 0) {
			$query['sql'] .= ' AND requests.contractor = :contractor';
			$query['params'][':contractor'] = $_POST['contractor'];
		}

		$query['sql'] .= ' GROUP BY requests.id, points.net_id) AS r ';
		$query['sql'] .= ' GROUP BY r.id) AS a ';
		$query['sql'] .= 'WHERE (1 <> 1 ';

		/*
		 * Если это руководитель и выше, то он должен
		 * видеть заявки своих подчиненных
		 */
		if($principal->group_id > $helper->getGroupId('user')) {
			$query['sql'] .= ' OR (a.master_id = :master_id AND (a.requester_level = 1 OR a.requester_level = 7) AND a.status = ' . $helper->getStatusId('created') . ')';
			$query['params'][':master_id'] = $principal->id;
		}

		/*
		 * Видимость заявок пользователям в зависимости от их принадлежности группе
		 */
		switch ($principal->group_id) {
			/*
			 * Если это руководитель сети, то он должен
			 * видеть заявки своих сетей утвержденные
			 * непосредственными руководителями
			 */
			case $helper->getGroupId('curator'):
				$query['sql'] .= ' OR (a.status = '. $helper->getStatusId('manager_approved') .' AND (a.nets_count = 1 AND a.net_curator_id = :net_curator_id ';
				$query['params'][':net_curator_id'] = $principal->id;

				if ($principal->id == $app->getConfig('complex_id')) {
					$query['sql'] .= ' OR a.nets_count > 1 ';
				}
				$query['sql'] .= ')) ';
				break;

			/*
			 * Если это операционный директор, то он должен
			 * видеть заявки своих сетей и утвержденные
			 * руководителем сети
			 */
			case $helper->getGroupId('coo'):
				$query['sql'] .= ' OR (a.status = '. $helper->getStatusId('curator_approved') .' AND (a.nets_count = 1 AND a.net_chief_operating_officer_id = :net_chief_operating_officer_id ';
				$query['params'][':net_chief_operating_officer_id'] = $principal->id;

				if ($principal->id == $app->getConfig('coo_id')) {
					$query['sql'] .= ' OR a.nets_count > 1 ';
				}
				$query['sql'] .= ')) ';
				break;

			/*
			 * Если это сотрудник СБ, то он должен
			 * видеть заявки утвержденные операционным
			 * директором
			 */
			case $helper->getGroupId('security'):
				$query['sql'] .= ' OR a.status = '. $helper->getStatusId('coo_approved');
				break;

			/*
			 * Если это финансовый руководитель, то он должен
			 * видеть заявки утвержденные сотрудником СБ,
			 * утвержденные/отклоненные генеральным директором,
			 * утвержденные/отклоненные финансовыми
			 * руководителями и оплаченные заявки
			 */
			case $helper->getGroupId('finance'):
				$query['sql'] .= ' OR a.status IN ('.
					$helper->getStatusId('finance_approved') . ','.
					$helper->getStatusId('finance_declined') . ','.
					$helper->getStatusId('ceo_approved') . ','.
					$helper->getStatusId('ceo_declined') . ','.
					$helper->getStatusId('paid') . ')';
				break;

			/*
			 * Если это генеральный директор, то он должен
			 * видеть заявки утвержденные финансовыми
			 * руководителями
			 */
			case $helper->getGroupId('ceo'):
				$query['sql'] .= ' OR a.status = '. $helper->getStatusId('security_approved');
				break;

			/*
			 * Если это администратор, то он должен
			 * видеть все заявки
			 */
			case $helper->getGroupId('admin'):
				$query['sql'] .= ' OR a.status BETWEEN 1 AND 100 ';
				break;
		}

		$query['sql'] .= ') ORDER BY a.id DESC';

		if ($limited) {
			if(isset($_POST['start']) AND is_numeric($_POST['start'])) {
				$start = (int)$_POST['start'];
			}

			if(isset($_POST['limit']) AND is_numeric($_POST['limit'])) {
				$limit = (int)$_POST['limit'];
			}

			if (isset($start) || isset($limit)) {
				$query['sql'] .= ' LIMIT ' . ($start ? $start : 0) . ', ' . ($limit ? $limit : 25);
			}
		}

		return $query;
	}

	public function buildMyRequestsListQuery($limited = false) {

		$app = Application::getInstance();
		$principal = $app->getPrincipal();
		$helper = new RequestHelper();

		$query['sql'] = 'SELECT SQL_CALC_FOUND_ROWS * FROM (
				SELECT count(*) as nets_count, r.* FROM (
				SELECT requests.id, requests.dt_created, requests.company_id, points.net_id, points.id AS point_id,
					requests.dt_payment, requests.order_no, requests.payment_type, requests.amount, requests.p_l, requests.category_id,
					requests.description, requests.author_id, requests.status, requests.contractor, requests.request_type,
					authors.name as requester, authors.group_id as requester_level, authors.master_id AS master_id,
					nets.curator_id as net_curator_id, nets.chief_operating_officer_id as net_chief_operating_officer_id,
					1 as allow_edit
				FROM requests, requests_points, contractors, users as authors, nets, points
				WHERE authors.id = requests.author_id
					AND contractors.id = requests.contractor
					AND requests_points.request_id = requests.id
					AND points.id = requests_points.point_id
					AND nets.id = points.net_id';
		$query['params'] = array();

		if(isset($_POST['startdate'])) {
			$query['sql'] .= ' AND requests.dt_created >= :startdate ';
			$query['params'][':startdate'] = $_POST['startdate'];
		}

		if(isset($_POST['enddate'])) {
			$query['sql'] .= ' AND requests.dt_created <= :enddate ';
			$query['params'][':enddate'] = $_POST['enddate'];
		}

		if(isset($_POST['status']) && $_POST['status'] > 0) {
			$query['sql'] .= ' AND requests.status = :status ';
			$query['params'][':status'] = (int)$_POST['status'];
		}

		if(isset($_POST['category']) && $_POST['category'] > 0) {
			$query['sql'] .= ' AND (requests.category_id = :category OR requests.p_l = :p_l) ';
			$query['params'][':category'] = (int)$_POST['category'];
			$query['params'][':p_l'] = (int)$_POST['category'];
		}

		if(isset($_POST['network']) && $_POST['network'] > 0) {
			$query['sql'] .= ' AND points.net_id = :network ';
			$query['params'][':network'] = (int)$_POST['network'];
		}

		if(isset($_POST['point']) && $_POST['point'] > 0) {
			$query['sql'] .= ' AND points.id = :point ';
			$query['params'][':point'] = (int)$_POST['point'];
		}

		if(isset($_POST['contractor']) && $_POST['contractor'] != 0) {
			$query['sql'] .= ' AND requests.contractor = :contractor';
			$query['params'][':contractor'] = $_POST['contractor'];
		}

		if(isset($_POST['start']) AND is_numeric($_POST['start'])) {
			$start = (int)$_POST['start'];
		}

		if(isset($_POST['limit']) AND is_numeric($_POST['limit'])) {
			$limit = (int)$_POST['limit'];
		}

		$query['sql'] .= ' GROUP BY requests.id, points.net_id) AS r ';
		$query['sql'] .= ' GROUP BY r.id) AS a ';
		$query['sql'] .= 'WHERE (a.author_id = :author_id ';
		$query['params'][':author_id'] = $principal->id;

		/*
		 * Если это руководитель и выше, то он должен
		 * видеть заявки своих подчиненных уровня USER
		 */
		if($principal->group_id >= $helper->getGroupId('manager')) {
			$query['sql'] .= ' OR (a.master_id = :master_id';

			/*
			 * Если это сотрудник СБ, то он должен
			 * видеть заявки своих подчиненных не
			 * взирая на уровень подчиненного
			 */
			if($principal->group_id == $helper->getGroupId('security')) {
				$query['sql'] .= ' AND a.requester_level = ' . $helper->getGroupId('user');
			}

			$query['sql'] .= ' )';
			$query['params'][':master_id'] = $principal->id;
		}

		switch ($principal->group_id) {
			/*
			 * Если это руководитель сети, то он должен
			 * видеть все заявки сетей руководителем
			 * которых он является
			 */
			case $helper->getGroupId('curator'):
				$query['sql'] .= ' OR a.net_curator_id = :curator_id ';
				$query['params'][':curator_id'] = $principal->id;
				break;

			/*
			 * Если это операционный директор, то он должен
			 * видеть все заявки сетей операционным
			 * директором которых он является
			 */
			case $helper->getGroupId('coo'):
				$query['sql'] .= ' OR a.net_chief_operating_officer_id = :coo_id ';
				$query['params'][':coo_id'] = $principal->id;
				break;

			/*
			 * Если это генеральный директор, то он должен
			 * видеть все заявки без возможности правки
			 *
			 * Если это финансовый руководитель, то он должен
			 * видеть все заявки с возможностью правки
			 */
			case $helper->getGroupId('ceo'):
			case $helper->getGroupId('finance'):
			case $helper->getGroupId('admin'):
				$query['sql'] .= ' OR 1=1 ';
				break;
		}
		$query['sql'] .= ') ORDER BY a.id DESC';

		if ($limited) {
			if(isset($_POST['start']) AND is_numeric($_POST['start'])) {
				$start = (int)$_POST['start'];
			}

			if(isset($_POST['limit']) AND is_numeric($_POST['limit'])) {
				$limit = (int)$_POST['limit'];
			}

			if (isset($start) || isset($limit)) {
				$query['sql'] .= ' LIMIT ' . ($start ? $start : 0) . ', ' . ($limit ? $limit : 25);
			}
		}

		return $query;

	}
} 