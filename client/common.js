/**
 * Created by Serhii Mykhailovskyi on 03.10.2014.
 */


function info(message) {
	Ext.Msg.show({
		title: 'Информация',
		msg: message,
		icon: Ext.MessageBox.INFO,
		buttons: Ext.MessageBox.OK
	});
}

function warning(message) {
	Ext.Msg.show({
		title: 'Предупреждение',
		msg: message,
		icon: Ext.MessageBox.WARNING,
		buttons: Ext.MessageBox.OK
	});
}

function error(message) {
	Ext.Msg.show({
		title: 'Ошибка',
		msg: message,
		icon: Ext.MessageBox.ERROR,
		buttons: Ext.MessageBox.OK
	});
}

