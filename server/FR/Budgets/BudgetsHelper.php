<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 30.06.14
 * Time: 18:57
 */

namespace FR\Budgets;


class BudgetsHelper {

	public function parseBudgetFile($type, $name, $dir = null) {

		$store_dir = 'D:/www/finik.home/storage/budgets/' . $type . '/' . ($dir != null ? $dir : '');

		if (is_uploaded_file($_FILES['budgetfile']['tmp_name'])) {
			$path = realpath($store_dir);
			if(!$path) {
				try {
					if(!mkdir($store_dir, 0777, true)) {
						return 'Невозможно создать директорию для сохранения файлов бюджетов! Проверьте права на запись или создайте директорию "'.$store_dir.'" с правами записи для пользователя от имени которого выполняется приложение.';
					}
				} catch (\Exception $e) {
					return $e->getMessage();
				}
				$path = realpath($store_dir);
			}

			$file = $path . '/' . $name . substr($_FILES['budgetfile']['name'], strrpos($_FILES['budgetfile']['name'], '.'));
			if(!move_uploaded_file($_FILES['budgetfile']['tmp_name'], $file)) {
				return 'Невозможно сохранить загруженный файл бюджета! Проверьте права на запись в директории "'.$path.'" для пользователя от имени которого выполняется приложение.';
			}

			try {
				$parser = \PHPExcel_IOFactory::load($file);
				$sheet = $parser->getSheet(0);
				$rows = $sheet->getHighestDataRow();
				$data = array('filename' => $file);
				for ($r=1; $r<=$rows; $r++) {
					$data['rows'][] = array(
						'id' => $sheet->getCellByColumnAndRow(0, $r)->getValue(),
						'name' => $sheet->getCellByColumnAndRow(1, $r)->getValue(),
						'allowed' => $sheet->getCellByColumnAndRow(2, $r)->getValue(),
					);
				}

				return $data;

			} catch (\Exception $e) {
				return $e->getMessage();
			}
		}
		else {
			return 'Невозможно прочитать загруженный файл ' . $_FILES['budgetfile']['tmp_name'];
		}

	}
} 