/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.view.Auth.LoginWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.loginWindow',

	title: 'Авторизация FinRequest ' + version,
	autoHeight: true,
	border: true,
	modal: false,
	closable: false,
	collapsible: false,
	maximizable: false,
	iconCls: 'users',
	renderTo: 'content',
	constrain: true,
	layout: 'fit',
	items: [
		{
			xtype: 'form',
			border: false,
			layout: 'anchor',
			defaultType: 'textfield',
			defaults: {
				labelAlign: 'left'
			},

			items: [
				{
					fieldLabel: 'Имя',
					padding: '5 5 5 5',
					allowBlank: false,
					name: 'loginUsername',
					width: 250
				}, {
					fieldLabel: 'Пароль',
					padding: '5 5 5 5',
					allowBlank: true,
					name: 'loginPassword',
					inputType: 'password',
					width: 250
				}
			],

			buttons: [
				{
					text: 'Забыли пароль?',
					xtype: 'button',
					action: 'rememberPasswordAction'
				}, {
					text: 'Войти',
					xtype: 'button',
					action: 'loginAction'
				}
			]
		}
	],


	initComponent: function() {
		this.callParent(arguments);
	}

});