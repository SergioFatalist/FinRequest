<?php
/**
 * Created by PhpStorm.
 * User: sergio
 * Date: 28.07.14
 * Time: 23:23
 */

namespace FR\Requests\Controllers;


use FR\Core\Controllers\CoreController;
use FR\Requests\RequestHelper;

class ExportController extends CoreController {

	public function simpleAction() {

		$helper = new RequestHelper();
		$principal = $this->app->getPrincipal();

		$sql = 'SELECT requests.id,
					requests.dt_created,
					companies.name AS company,
					nets.name AS net,
					points.name AS point_name,
					requests_points.point_status,
					requests.dt_payment,
					requests.order_no,
					requests.payment_type,
					requests.amount,
					pl.name AS p_l_category,
					categories.name AS category,
					contractors.name AS contractor,
					requests.description,
					requests.dt_changed,
					requests.status,
					authors.name AS author,
					masters.name AS master,
					statuses.name AS status_name
				FROM requests,
					requests_points,
					users AS authors,
					users AS masters,
					companies,
					contractors,
					nets,
					points,
					categories,
					categories AS pl,
					requests_statuses AS statuses
				WHERE authors.id = requests.author_id
					AND masters.id = authors.master_id
					AND companies.id = requests.company_id
					AND contractors.id = requests.contractor
					AND requests_points.request_id = requests.id
					AND points.id = requests_points.point_id
					AND nets.id = points.net_id
					AND categories.id = requests.category_id
					AND pl.id = requests.p_l
					AND requests.status = statuses.id
					AND (authors.id = :author_id ';

		$payment_types = array(
			1 => 'Наличная',
			2 => 'Безналичная'
		);
		$point_statuses = array(
			0 => 'Существующая',
			1 => 'Новая',
			2 => 'Существующая'
		);

		$params = array(
			':author_id' => $principal->id
		);

		/*
		 * Если это руководитель и выше, то он должен
		 * видеть заявки своих подчиненных уровня USER
		 */
		if($principal->group_id > $helper->getGroupId('user')) {
			$sql .= ' OR (authors.master_id = :master_id';

			/*
			 * Если это сотрудник СБ, то он должен
			 * видеть заявки своих подчиненных не
			 * взирая на уровень подчиненного
			 */
			if ($principal->group_id != $helper->getGroupId('security')) {
				$sql .= ' AND authors.group_id = ' . $helper->getGroupId('user');
			}
			$sql .= ') ';
			$params[':master_id'] = $principal->id;
		}

		switch($principal->group_id) {
			/*
			 * Если это руководитель сети, то он должен
			 * видеть заявки своих сетей утвержденные
			 * непосредственными руководителями
			 */
			case $helper->getGroupId('curator'):
				$sql .= ' OR (
							-- requests.status = ' . $helper->getStatusId('manager_approved') . '
							AND nets.curator_id = :curator_id
							)';
				$params[':curator_id'] = $principal->id();
				break;
			/*
			 * Если это операционный директор, то он должен
			 * видеть заявки своих сетей и утвержденные
			 * руководителем сети
			 */
			case $helper->getGroupId('coo'):
				$sql .= ' OR (
							-- requests.status = ' . $helper->getStatusId('manager_approved') . '
							AND nets.chief_operating_officer_id = :chief_operating_officer_id
						)';
				$params[':chief_operating_officer_id'] = $principal->id();
				break;

			/*
			 * Если это финансовый руководитель, то он должен
			 * видеть заявки утвержденные сотрудником СБ,
			 * утвержденные/отклоненные генеральным директором,
			 * утвержденные/отклоненные финансовыми
			 * руководителями и оплаченные заявки
			 */
			case $helper->getGroupId('finance'):
				$sql .= ' OR 1=1 ';
				break;
			/*
			 * Если это генеральный директор, то он должен
			 * видеть заявки утвержденные финансовыми
			 * руководителями
			 */
			case $helper->getGroupId('ceo'):
//				$sql .= ' OR requests.status = ' . $helper->getStatusId('security_approved');
				$sql .= ' OR 1=1 ';
				break;
		}
		$sql .= ')';

		if(isset($_REQUEST['startdate'])) {
			$sql .= ' AND requests.dt_created >= :startdate ';
			$params[':startdate'] = $_REQUEST['startdate'];
		}

		if(isset($_REQUEST['enddate'])) {
			$sql .= ' AND requests.dt_created <= :enddate ';
			$params[':enddate'] = $_REQUEST['enddate'];
		}

		if(isset($_REQUEST['status']) && $_REQUEST['status'] > 0) {
			$sql .= ' AND requests.status = :status ';
			$params[':status'] = (int)$_REQUEST['status'];
		}

		if(isset($_REQUEST['category']) && $_REQUEST['category'] > 0) {
			$sql .= ' AND (requests.category_id = :category OR requests.p_l = :p_l) ';
			$params[':category'] = (int)$_REQUEST['category'];
			$params[':p_l'] = (int)$_REQUEST['category'];
		}

		if(isset($_REQUEST['network']) && $_REQUEST['network'] > 0) {
			$sql .= ' AND points.net_id = :network ';
			$params[':network'] = (int)$_REQUEST['network'];
		}

		if(isset($_REQUEST['point']) && $_REQUEST['point'] > 0) {
			$sql .= ' AND points.id = :point ';
			$params[':point'] = (int)$_REQUEST['point'];
		}

		if(isset($_REQUEST['contractor']) && $_REQUEST['contractor'] != 0) {
			$sql .= ' AND requests.contractor = :contractor';
			$params[':contractor'] = $_REQUEST['contractor'];
		}

		$sql .= ' GROUP BY id';

		$result = $this->query($sql, $params);
		$data = $result->fetchAll();


		$xls = new \PHPExcel();
		$xls->getProperties()
			->setCreator('FinRequest ' . VERSION);

		$xls->setActiveSheetIndex(0)
			->setCellValueByColumnAndRow(0, 1, 'ID')
			->setCellValueByColumnAndRow(1, 1, 'Дата оплаты')
			->setCellValueByColumnAndRow(2, 1, 'Юр. лицо')
			->setCellValueByColumnAndRow(3, 1, 'Сумма')
			->setCellValueByColumnAndRow(4, 1, 'Назначение платежа')
			->setCellValueByColumnAndRow(5, 1, 'Затраты P&L')
			->setCellValueByColumnAndRow(6, 1, 'Общие затраты P&L')
			->setCellValueByColumnAndRow(7, 1, 'Сеть')
			->setCellValueByColumnAndRow(8, 1, 'Торговая точка')
			->setCellValueByColumnAndRow(9, 1, 'Статус')
			->setCellValueByColumnAndRow(10, 1, 'Номер счета')
			->setCellValueByColumnAndRow(11, 1, 'Контрагент')
			->setCellValueByColumnAndRow(12, 1, 'Инициатор')
			->setCellValueByColumnAndRow(13, 1, 'Дата создания')
			->setCellValueByColumnAndRow(14, 1, 'Форма оплаты')
			->setCellValueByColumnAndRow(15, 1, 'Статус заявки');

		$i = 2;
		foreach ($data AS $row) {
			$xls->getActiveSheet()
				->setCellValueByColumnAndRow(0, $i, $row->id)
				->setCellValueByColumnAndRow(1, $i, $row->dt_payment == null ? '' : date_format(date_create($row->dt_payment), 'Y-m-d'))
				->setCellValueByColumnAndRow(2, $i, trim($row->company))
				->setCellValueByColumnAndRow(3, $i, $row->amount)
				->setCellValueByColumnAndRow(4, $i, trim($row->description))
				->setCellValueByColumnAndRow(5, $i, trim($row->p_l_category))
				->setCellValueByColumnAndRow(6, $i, trim($row->category))
				->setCellValueByColumnAndRow(7, $i, trim($row->net))
				->setCellValueByColumnAndRow(8, $i, trim($row->point_name))
				->setCellValueByColumnAndRow(9, $i, $point_statuses[$row->point_status])
				->setCellValueByColumnAndRow(10, $i, trim($row->order_no))
				->setCellValueByColumnAndRow(11, $i, trim($row->contractor))
				->setCellValueByColumnAndRow(12, $i, trim($row->author))
				->setCellValueByColumnAndRow(13, $i, $row->dt_created == null ? '' : date_format(date_create($row->dt_created), 'Y-m-d H:i'))
				->setCellValueByColumnAndRow(14, $i, $payment_types[$row->payment_type])
				->setCellValueByColumnAndRow(15, $i, $row->status_name);
			$i++;
		}

		for($col = 0; $col < 16; $col++) {
			if ($col == 4)
				continue;
			$xls->getActiveSheet()
				->getColumnDimensionByColumn($col)
				->setAutoSize(true);
		}
		$xls->getActiveSheet()->calculateColumnWidths();

		$writer = \PHPExcel_IOFactory::createWriter($xls, 'Excel2007');
		header('Content-Type: application/vnd.ms-excel');
		header('Content-Disposition: attachment;filename="export.xlsx"');
		header('Cache-Control: max-age=0');

		$writer->save('php://output');
	}

	public function extendedAction() {

		$helper = new RequestHelper();
		$principal = $this->app->getPrincipal();

		$sql = 'SELECT requests.id,
					requests.dt_created,
					companies.name AS company,
					nets.name AS net,
					points.name AS point_name,
					requests_points.point_status,
					requests.dt_payment,
					requests.order_no,
					requests.payment_type,
					requests.amount AS total_amount,
					requests_points.amount,
					pl.name AS p_l_category,
					categories.name AS category,
					contractors.name AS contractor,
					requests.description,
					requests.dt_changed,
					requests.status,
					authors.name AS author,
					masters.name AS master,
					statuses.name AS status_name
				FROM requests,
					requests_points,
					users AS authors,
					users AS masters,
					companies,
					contractors,
					nets,
					points,
					categories,
					categories AS pl,
					requests_statuses AS statuses
				WHERE authors.id = requests.author_id
					AND masters.id = authors.master_id
					AND companies.id = requests.company_id
					AND contractors.id = requests.contractor
					AND requests_points.request_id = requests.id
					AND points.id = requests_points.point_id
					AND nets.id = points.net_id
					AND categories.id = requests.category_id
					AND pl.id = requests.p_l
					AND requests.status = statuses.id
					AND (authors.id = :author_id ';

		$payment_types = array(
			1 => 'Наличная',
			2 => 'Безналичная'
		);
		$point_statuses = array(
			1 => 'Новая',
			2 => 'Существующая'
		);

		$params = array(
			':author_id' => $principal->id
		);

		/*
		 * Если это руководитель и выше, то он должен
		 * видеть заявки своих подчиненных уровня USER
		 */
		if($principal->group_id > $helper->getGroupId('user')) {
			$sql .= ' OR (authors.master_id = :master_id';

			/*
			 * Если это сотрудник СБ, то он должен
			 * видеть заявки своих подчиненных не
			 * взирая на уровень подчиненного
			 */
			if ($principal->group_id != $helper->getGroupId('security')) {
				$sql .= ' AND authors.group_id = ' . $helper->getGroupId('user');
			}
			$sql .= ') ';
			$params[':master_id'] = $principal->id;
		}

		switch($principal->group_id) {
			/*
			 * Если это руководитель сети, то он должен
			 * видеть заявки своих сетей утвержденные
			 * непосредственными руководителями
			 */
			case $helper->getGroupId('curator'):
				$sql .= ' OR (
							-- requests.status = ' . $helper->getStatusId('manager_approved') . '
							AND nets.curator_id = :curator_id
							)';
				$params[':curator_id'] = $principal->id();
				break;
			/*
			 * Если это операционный директор, то он должен
			 * видеть заявки своих сетей и утвержденные
			 * руководителем сети
			 */
			case $helper->getGroupId('coo'):
				$sql .= ' OR (
							-- requests.status = ' . $helper->getStatusId('manager_approved') . '
							AND nets.chief_operating_officer_id = :chief_operating_officer_id
						)';
				$params[':chief_operating_officer_id'] = $principal->id();
				break;

			/*
			 * Если это финансовый руководитель, то он должен
			 * видеть заявки утвержденные сотрудником СБ,
			 * утвержденные/отклоненные генеральным директором,
			 * утвержденные/отклоненные финансовыми
			 * руководителями и оплаченные заявки
			 */
			case $helper->getGroupId('finance'):
//				$sql .= ' OR requests.status IN ('.
//						$helper->getStatusId('finance_approved') . ','.
//						$helper->getStatusId('finance_approved') . ','.
//						$helper->getStatusId('ceo_approved') . ','.
//						$helper->getStatusId('ceo_approved') . ','.
//						$helper->getStatusId('paid') . ')';

				$sql .= ' OR 1=1 ';
				break;
			/*
			 * Если это генеральный директор, то он должен
			 * видеть заявки утвержденные финансовыми
			 * руководителями
			 */
			case $helper->getGroupId('ceo'):
//				$sql .= ' OR requests.status = ' . $helper->getStatusId('security_approved');
				$sql .= ' OR 1=1 ';
				break;
		}
		$sql .= ')';

		if(isset($_REQUEST['startdate'])) {
			$sql .= ' AND requests.dt_created >= :startdate ';
			$params[':startdate'] = $_REQUEST['startdate'];
		}

		if(isset($_REQUEST['enddate'])) {
			$sql .= ' AND requests.dt_created <= :enddate ';
			$params[':enddate'] = $_REQUEST['enddate'];
		}

		if(isset($_REQUEST['status']) && $_REQUEST['status'] > 0) {
			$sql .= ' AND requests.status = :status ';
			$params[':status'] = (int)$_REQUEST['status'];
		}

		if(isset($_REQUEST['category']) && $_REQUEST['category'] > 0) {
			$sql .= ' AND (requests.category_id = :category OR requests.p_l = :p_l) ';
			$params[':category'] = (int)$_REQUEST['category'];
			$params[':p_l'] = (int)$_REQUEST['category'];
		}

		if(isset($_REQUEST['network']) && $_REQUEST['network'] > 0) {
			$sql .= ' AND points.net_id = :network ';
			$params[':network'] = (int)$_REQUEST['network'];
		}

		if(isset($_REQUEST['point']) && $_REQUEST['point'] > 0) {
			$sql .= ' AND points.id = :point ';
			$params[':point'] = (int)$_REQUEST['point'];
		}

		if(isset($_REQUEST['contractor']) && $_REQUEST['contractor'] != 0) {
			$sql .= ' AND requests.contractor = :contractor';
			$params[':contractor'] = $_REQUEST['contractor'];
		}

//		$sql .= ' GROUP BY id';

		$result = $this->query($sql, $params);
		$data = $result->fetchAll();


		$xls = new \PHPExcel();
		$xls->getProperties()
			->setCreator('FinRequest ' . VERSION);

		$xls->setActiveSheetIndex(0)
			->setCellValueByColumnAndRow(0, 1, 'ID')
			->setCellValueByColumnAndRow(1, 1, 'Дата оплаты')
			->setCellValueByColumnAndRow(2, 1, 'Юр. лицо')
			->setCellValueByColumnAndRow(3, 1, 'Сумма')
			->setCellValueByColumnAndRow(4, 1, 'Назначение платежа')
			->setCellValueByColumnAndRow(5, 1, 'Затраты P&L')
			->setCellValueByColumnAndRow(6, 1, 'Общие затраты P&L')
			->setCellValueByColumnAndRow(7, 1, 'Сеть')
			->setCellValueByColumnAndRow(8, 1, 'Торговая точка')
			->setCellValueByColumnAndRow(9, 1, 'Номер счета')
			->setCellValueByColumnAndRow(10, 1, 'Контрагент')
			->setCellValueByColumnAndRow(11, 1, 'Инициатор')
			->setCellValueByColumnAndRow(12, 1, 'Дата создания')
			->setCellValueByColumnAndRow(13, 1, 'Форма оплаты')
			->setCellValueByColumnAndRow(14, 1, 'Статус заявки');

		$i = 2;
		foreach ($data AS $row) {
			$xls->getActiveSheet()
				->setCellValueByColumnAndRow(0, $i, $row->id)
				->setCellValueByColumnAndRow(1, $i, $row->dt_payment == null ? '' : date_format(date_create($row->dt_payment), 'Y-m-d'))
				->setCellValueByColumnAndRow(2, $i, trim($row->company))
				->setCellValueByColumnAndRow(3, $i, $row->amount)
				->setCellValueByColumnAndRow(4, $i, trim($row->description))
				->setCellValueByColumnAndRow(5, $i, trim($row->p_l_category))
				->setCellValueByColumnAndRow(6, $i, trim($row->category))
				->setCellValueByColumnAndRow(7, $i, trim($row->net))
				->setCellValueByColumnAndRow(8, $i, trim($row->point_name))
				->setCellValueByColumnAndRow(9, $i, trim($row->order_no))
				->setCellValueByColumnAndRow(10, $i, trim($row->contractor))
				->setCellValueByColumnAndRow(11, $i, trim($row->author))
				->setCellValueByColumnAndRow(12, $i, $row->dt_created == null ? '' : date_format(date_create($row->dt_created), 'Y-m-d H:i'))
				->setCellValueByColumnAndRow(13, $i, $payment_types[$row->payment_type])
				->setCellValueByColumnAndRow(14, $i, $row->status_name);
			$i++;
		}

		for($col = 0; $col < 16; $col++) {
			if ($col == 4)
				continue;
			$xls->getActiveSheet()
				->getColumnDimensionByColumn($col)
				->setAutoSize(true);
		}
		$xls->getActiveSheet()->calculateColumnWidths();

		$writer = \PHPExcel_IOFactory::createWriter($xls, 'Excel2007');
		header('Content-Type: application/vnd.ms-excel');
		header('Content-Disposition: attachment;filename="export.extended.xlsx"');
		header('Cache-Control: max-age=0');

		$writer->save('php://output');

	}

} 