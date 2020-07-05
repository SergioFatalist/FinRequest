/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.view.Companies.CompanyEditWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.companyEditWindow',

	width: 400,
	modal: true,
	closable: true,
	maximizable: false,
	iconCls: 'companies',
	layout: 'fit',
	forceFit: true,
	constrain: true,
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
				}, {
					fieldLabel: 'Тип оплаты',
					xtype: 'combo',
					allowBlank: false,
					editable: false,
					autoSelect: true,
					name: 'payment_type',
					submitValue: true,
					typeAhead: true,
					triggerAction: 'all',
					store: 'PaymentTypes',
					valueField: 'id',
					displayField: 'name'
				},{
					fieldLabel: 'Комментарий',
					xtype: 'textarea',
					name: 'comment',
					allowBlank: true,
					rows: 10
				}, {
					fieldLabel: 'Активная',
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
					action: 'saveCompanyAction',
					scope: this
			}]
		}
	],

	initComponent: function() {
		this.callParent(arguments);
	}
});
