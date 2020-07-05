/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.view.Auth.ChangePasswordWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.changePasswordWindow',

	title:  'Смена пароля FinRequest ' + version,
	autoHeight: true,
	border: true,
	modal: true,
	closable: false,
	collapsible: false,
	maximizable: false,
	iconCls: 'users',
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
					fieldLabel: 'E-mail',
					padding: '5 5 5 5',
					allowBlank: false,
					name: 'loginEmail',
					width: 250,
					vtype: 'email'
				}
			],

			buttons: [
				{
					text: 'Сменить пароль',
					action: 'changePasswordAction'
				}, {
					text: 'Вернуться',
					action: 'showLoginWindow'
				}
			]
		}
	],


	initComponent: function() {
		this.callParent(arguments);
	}

});