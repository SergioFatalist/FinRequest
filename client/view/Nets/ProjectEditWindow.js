/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.view.Nets.ProjectEditWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.pointEditWindow',

	width: 500,
	modal: true,
	closable: true,
	maximizable: false,
	iconCls: 'nets',
	layout: 'fit',
	forceFit: true,
	constrain: true,
	renderTo: 'content',

	items: [
		{
			xtype: 'form',
			border: false,
			bodyPadding: '5 5',
			defaultType: 'textfield',
			defaults: {
				labelAlign: 'left',
				labelWidth: 100,
				anchor: '0'
			},

			items: [
				{
					fieldLabel: 'Название',
					name: 'name',
					allowBlank: false,
					maxLength: 64
				}, {
					fieldLabel: 'Сеть',
					xtype: 'combo',
					allowBlank: false,
					editable: false,
					name: 'net_id',
					emptyText: 'Укажите сеть...',
					typeAhead: true,
					triggerAction: 'all',
					queryMode: 'local',
					store: 'Nets.Nets',
					valueField: 'id',
					displayField: 'name',
					lastQuery: '',
					listeners: {
						render: function (combo) {
							combo.store.filterBy(function (record) {
								return record.get('projects');
							});
						}
					}

				}, {
					fieldLabel: 'Куратор',
					xtype: 'combo',
					allowBlank: false,
					editable: false,
					name: 'curator_id',
					emptyText: 'Укажите куратора...',
					typeAhead: true,
					triggerAction: 'all',
					queryMode: 'local',
					store: 'Users.Users',
					valueField: 'id',
					displayField: 'name'
				}, {
					fieldLabel: 'Город',
					name: 'city',
					allowBlank: true,
					maxLength: 64
				}, {
					fieldLabel: 'Адрес',
					name: 'address',
					allowBlank: true,
					maxLength: 128
				}, {
					fieldLabel: 'Телефон',
					name: 'phone',
					allowBlank: true,
					maxLength: 14
				},{
					fieldLabel: 'Дата создания',
					xtype: 'datefield',
					name: 'dt_created',
					format: 'Y-m-d',
					altFormats: 'Y-m-d H:i:s|Y-m-d',
					allowBlank: true
				}, {
					fieldLabel: 'Дата завершения',
					xtype: 'datefield',
					name: 'dt_finished',
					format: 'Y-m-d',
					altFormats: 'Y-m-d H:i:s|Y-m-d',
					allowBlank: true
				}, {
					fieldLabel: 'Завершен',
					xtype: 'checkbox',
					name: 'finished',
					inputValue: 'true'
				}, {
					fieldLabel: 'Активный',
					xtype: 'checkbox',
					name: 'active',
					inputValue: 'true'
				}, {
					name: 'project',
					xtype: 'hidden',
					value: 1
				}, {
					name: 'id',
					xtype: 'hidden'
				}
			],
			buttons: [{
				text: 'Сохранить',
				iconCls: 'save',
				action: 'savePointAction'
			}]
		}
	],

	initComponent: function() {
		this.callParent(arguments);
	}

});
