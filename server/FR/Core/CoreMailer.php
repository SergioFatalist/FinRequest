<?php
/**
 * Created by PhpStorm.
 * User: sergio
 * Date: 23.10.14
 * Time: 03:06
 */

namespace FR\Core;


use FR\Application;

class CoreMailer {

	protected $mailer;

	protected $app;

	public function __construct() {

		$this->app = Application::getInstance();

		$this->mailer = new \PHPMailer();
		$this->mailer->setLanguage('ru');

		if (strtolower($this->app->getConfig('mail_factory')) == 'smtp') {
			$this->mailer->isSMTP();
			$this->mailer->Host = $this->app->getConfig('mail_host');
			$this->mailer->Port = $this->app->getConfig('mail_port');
			$this->mailer->SMTPAuth = in_array(strtoupper($this->app->getConfig('mail_auth')), array('YES', 'TRUE'));
			$this->mailer->Username = $this->app->getConfig('mail_user');
			$this->mailer->Password = $this->app->getConfig('mail_pass');
		} else {
			$this->mailer->isSendmail($this->app->getConfig('mail_sendmail_path'));
		}

		$this->mailer->From = $this->app->getConfig('mail_from');
		$this->mailer->FromName = $this->app->getConfig('mail_mailer');
		$this->mailer->Encoding = $this->app->getConfig('mail_mime_encoding');
		$this->mailer->CharSet = $this->app->getConfig('mail_encoding');
		$this->mailer->Hostname = $this->app->getConfig('mail_ehlo');
		$this->mailer->WordWrap = 50;

	}

	protected function sendMail($addresses, $subject, $message) {

		$this->mailer->clearAddresses();

		$addresses = is_array($addresses) ? $addresses : array($addresses);
		foreach($addresses as $address) {
			$this->mailer->addAddress($address);
		}

		$this->mailer->Subject = $subject;
		$this->mailer->Body = $message;
		$this->mailer->isHTML(true);

		if (!$this->mailer->send()) {
			return $this->mailer->ErrorInfo;
		}

		return null;
	}

	protected function readTemplate($name) {
		$filename = $this->app->getContextPath() . DS . 'theme' . DS . 'emails' . DS . $name . '.html';

		return file_get_contents($filename);
	}

	protected function parseTemplate($template, $params) {

		foreach ($params as $var => $value) {
			$search = '{' . $var . '}';
			$template = str_replace($search, $value, $template);
		}

		return $template;
	}

} 