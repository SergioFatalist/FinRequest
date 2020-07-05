/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.view.Nets.NetEditWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.netEditWindow',

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
				labelWidth: 150,
				anchor: '0'
			},

			items: [
				{
					fieldLabel: 'Наименование',
					name: 'name',
					allowBlank: false,
					maxLength: 64
				}, {
					fieldLabel: 'Руководитель сети',
					xtype: 'combo',
					editable: false,
					allowBlank: false,
					name: 'curator_id',
					emptyText:'Укажите руководителя сети...',
					typeAhead: true,
					triggerAction: 'all',
					mode:'local',
					store:'Users.Users',
					valueField:'id',
					displayField:'name',
					width: 300
				}, {
					fieldLabel: 'Операционный директор',
					xtype: 'combo',
					editable: false,
					allowBlank: false,
					name: 'chief_operating_officer_id',
					emptyText:'Укажите операционного директора сети...',
					typeAhead: true,
					triggerAction: 'all',
					mode:'local',
					store:'Users.Users',
					valueField:'id',
					displayField:'name',
					width: 300
				}, {
					fieldLabel: 'Активная',
					xtype: 'checkbox',
					name: 'active',
					inputValue: 'true'
				}, {
					fieldLabel: 'Каталог проектов',
					xtype: 'checkbox',
					name: 'projects',
					inputValue: 'true'
				}, {
					name: 'id',
					xtype: 'hidden'
				}
			],
			buttons: [{
				text: 'Сохранить',
				iconCls: 'save',
				action: 'saveNetAction'
			}]
		}
	],

	initComponent: function() {
		this.callParent(arguments);
	}
});
