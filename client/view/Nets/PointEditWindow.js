/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.view.Nets.PointEditWindow', {
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
					fieldLabel: 'Наименование',
					name: 'name',
					allowBlank: false,
					maxLength: 64
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
				}, {
					fieldLabel: 'Сеть',
					xtype: 'combo',
					allowBlank: false,
					editable: false,
					forceSelection: true,
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
								return !record.get('projects');
							});
						}
					}
				}, {
					fieldLabel: 'Активная',
					xtype: 'checkbox',
					name: 'active',
					inputValue: 'true'
				}, {
					name: 'project_id',
					xtype: 'hidden'
				}, {
					name: 'project',
					xtype: 'hidden',
					value: 0
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
