/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.controller.Auth', {
	extend: 'Ext.app.Controller',

	views: [
		'Auth.LoginWindow',
		'Auth.ChangePasswordWindow'
	],

	refs: [
		{
			ref: 'loginWindow',
			selector: 'loginWindow'
		},
		{
			ref: 'changePasswordWindow',
			selector: 'changePasswordWindow'
		}
	],

	loginWindow: null,
	changePasswordWindow: null,

	init: function() {
		this.control({
			'field[name=loginUsername]': {
				specialkey: function(field, e) {
					if (e.getKey() == e.ENTER) {
						this.doLogin(field.up('form').getForm())
					}
				}
			},
			'field[name=loginPassword]': {
				specialkey: function(field, e) {
					if (e.getKey() == e.ENTER) {
						this.doLogin(field.up('form').getForm())
					}
				}
			},
			'field[name=loginUsername]': {
				specialkey: function(field, e) {
					if (e.getKey() == e.ENTER) {
						this.doChangePassword(field.up('form').getForm())
					}
				}
			},
			'field[name=loginEmail]': {
				specialkey: function(field, e) {
					if (e.getKey() == e.ENTER) {
						this.doChangePassword(field.up('form').getForm())
					}
				}
			},
			'button[action=loginAction]': {
				click: function(button) {
					this.doLogin(button.up('form').getForm());
				}
			},
			'button[action=logoutAction]': {
				click: this.doLogout
			},
			'button[action=rememberPasswordAction]': {
				click: this.doRememberPassword
			},
			'button[action=changePasswordAction]': {
				click: function(button) {
					this.doChangePassword(button.up('form').getForm());
				}
			},
			'button[action=showLoginWindow]' : {
				click: this.showLoginWindow
			}
		})
	},

	onLaunch: function() {
		if (user_id == 0) {
			this.showLoginWindow();
		}
	},

	doLogin: function(form) {
		if (form.isValid()) {
			form.submit({
				url: 'auth/auth/login',
				method: 'POST',
				success: function() {
					window.location = '';
				},
				failure: function(form, action) {
					if(action.response.status == 200) {
						Ext.Msg.show({
							title: 'Авторизация не пройдена!',
							msg: action.result.message,
							icon: Ext.MessageBox.ERROR,
							buttons: Ext.MessageBox.OK
						});
					} else {
						Ext.Msg.show({
							title: 'Внимание!',
							msg: 'Сервер авторизации недоступен: ' + action.response.responseText,
							icon: Ext.MessageBox.WARNING,
							buttons: Ext.MessageBox.OK
						});
					}
				}
			});
		}
	},

	doLogout: function() {
		Ext.MessageBox.show({
			title: 'Выход?',
			msg: 'Вы действительно хотите покинуть FinRequest?',
			icon: Ext.MessageBox.QUESTION,
			buttons: Ext.MessageBox.YESNO,
			buttonText:{
				yes: "Да",
				no: "Нет"
			},
			animEl: 'elId',
			fn: function(btn) {
				if (btn == 'yes'){ window.location='auth/auth/logout';	}
			}
		});
	},

	doRememberPassword: function() {
		if (this.loginWindow) {
			this.loginWindow.hide();
			this.loginWindow = null;
		}
		if (!this.changePasswordWindow) {
			this.changePasswordWindow = Ext.create('FR.view.Auth.ChangePasswordWindow');
		}
		this.changePasswordWindow.show();
	},

	doChangePassword: function(form) {
		if (form.isValid()) {
			form.submit({
				url: 'auth/auth/changepassword',
				method: 'POST',
				success: function() {
					Ext.Msg.show({
						title: 'Внимание!',
						msg: 'Ваш запрос обработан. Новые учетные данные высланы на электронную почту.',
						icon: Ext.MessageBox.INFO,
						buttons: Ext.MessageBox.OK,
						fn: function() {
							window.location = 'index.php';
						}
					});

				},
				failure: function(form, action) {
					if(action.response.status == 200) {
						Ext.Msg.show({
							title: 'Смена пароля не произведена!',
							msg: action.result.message,
							icon: Ext.MessageBox.ERROR,
							buttons: Ext.MessageBox.OK
						});
					} else {
						Ext.Msg.show({
							title: 'Внимание!',
							msg: 'Сервер авторизации недоступен: ' + action.response.responseText,
							icon: Ext.MessageBox.WARNING,
							buttons: Ext.MessageBox.OK
						});
					}
				}
			});
		}
	},

	showLoginWindow: function() {
		if (this.changePasswordWindow) {
			this.changePasswordWindow.hide();
			this.changePasswordWindow = null;
		}
		if (!this.loginWindow) {
			this.loginWindow = Ext.create('FR.view.Auth.LoginWindow');
		}
		this.loginWindow.show();
	}
});
