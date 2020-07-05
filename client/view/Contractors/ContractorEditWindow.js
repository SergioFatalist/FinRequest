/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.view.Contractors.ContractorEditWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.contractorEditWindow',

	width: 400,
	modal: true,
	closable: true,
	maximizable: false,
	iconCls: 'contractors',
	layout: 'fit',
	constrain: true,
	renderTo: 'content',
	renderTo: 'content',

	items: [
		{
			xtype: 'form',
			defaultType: 'textfield',
			bodyPadding: '5 5',
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
				},{
					fieldLabel: 'Комментарий',
					xtype: 'textarea',
					name: 'comment',
					rows: 6,
					allowBlank: true
				}, {
					fieldLabel: 'Активный',
					xtype: 'checkbox',
					name: 'active',
					inputValue: 'true'
				}, {
					name: 'id',
					xtype: 'hidden'
				}
			],

			buttons: [{
					text: 'Сохранить',
					iconCls: 'save',
					action: 'saveContractorAction'
			}]
		}
	],

	initComponent: function() {
		this.callParent(arguments);
	}
});
