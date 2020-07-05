<?php
/**
 * Created by PhpStorm.
 * User: Serhii Mykhailovskyi
 * Date: 17.06.14
 * Time: 17:37
 */

namespace FR\Core\Controllers;


use FR\Application;

class IndexController extends CoreController
{

	public function indexAction() {

		?>
		<!DOCTYPE html>
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<?php if (FR_ENV != 'maintenance'): ?>
			<link rel="stylesheet" type="text/css" href="vendor/ExtJS/theme-classic/ext-theme-classic-all.css"/>
			<link rel="stylesheet" type="text/css" href="theme/css/style.css"/>
			<script type="text/javascript" src="vendor/Moment/js/moment-with-langs.min.js"></script>
			<script type="text/javascript" src="vendor/Cursor/js/cursor.js"></script>
			<script type="text/javascript" src="vendor/ExtJS/js/<?php echo (FR_ENV == 'development') ? 'ext-all-debug-w-comments.js' : 'ext-all.js' ?>"></script>
			<script type="text/javascript" src="vendor/ExtJS/js/ext-lang-ru.js"></script>
			<script type="text/javascript" src="client/common.js"></script>
			<script type="text/javascript">
				moment.lang('ru');
				var money = '<?php echo $this->app->getConfig('money') ?>';
				var version = '<?php echo VERSION ?>';
			</script>
			<script type="text/javascript">
				var ua = navigator.userAgent;
				var browserName = function() {
					if (ua.search(/MSIE/) > -1) return "ie";
					if (ua.search(/Firefox/) > -1) return "firefox";
					if (ua.search(/Opera/) > -1) return "opera";
					if (ua.search(/Chrome/) > -1) return "chrome";
					if (ua.search(/Safari/) > -1) return "safari";
					if (ua.search(/Konqueror/) > -1) return "konqueror";
					if (ua.search(/Iceweasel/) > -1) return "iceweasel";
					if (ua.search(/SeaMonkey/) > -1) return "seamonkey";
				}
				var browserVersion = function() {
					var name = browserName();
					switch (name) {
						case "ie" : return (ua.split("MSIE ")[1]).split(";")[0];break;
						case "firefox" : return ua.split("Firefox/")[1];break;
						case "opera" : return ua.split("Version/")[1];break;
						case "chrome" : return (ua.split("Chrome/")[1]).split(" ")[0];break;
						case "safari" : return (ua.split("Version/")[1]).split(" ")[0];break;
						case "konqueror" : return (ua.split("KHTML/")[1]).split(" ")[0];break;
						case "iceweasel" : return (ua.split("Iceweasel/")[1]).split(" ")[0];break;
						case "seamonkey" : return ua.split("SeaMonkey/")[1];break;
					}
				};

			</script>
			</head>

			<body>
			<?php if ($this->app->getPrincipal() == null || isset($_SESSION['message'])): ?>
				<script type="text/javascript" src="client/Auth.js"></script>
				<script >
					var user_id = 0;
				</script>
				<?php if (isset($_SESSION['message'])): ?>
					<div style="margin-top:100px; text-align: center; color: red; font-weight: bold;"><?php echo $_SESSION['message'] ?></div>
					<?php unset($_SESSION['message']) ?>
				<?php endif; ?>
			<?php else : ?>
				<script type="text/javascript">
					var user_id = <?php echo $this->app->getPrincipal()->id ?>;
				</script>
				<script type="text/javascript" src="client/Application.js"></script>
			<?php endif; ?>
			</body>
		<?php else: ?>
			</head>

			<body>
			<div style="margin-top:100px; text-align: center; color: red; font-weight: bold;">FinRequest находится на обслуживании. Попробуйте позже.</div>
			</body>
		<?php endif; ?>
		</html>
	<?php
	}
}
