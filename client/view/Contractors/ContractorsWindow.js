/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.view.Contractors.ContractorsWindow', {
	extend: 'Ext.window.Window',

	title: 'Контрагенты',
	iconCls: 'contractors',
	closeAction: 'hide',
	closable: true,
	maximizable: true,
	modal: false,
	width: 800,
	height: 400,
	layout: 'fit',
	constrain: true,
	renderTo: 'content',

	items: [{
		xtype: 'grid',
		store: 'Contractors.Contractors',
		itemId: 'contractorsGrid',
		border: false,
		forceFit: true,

		tbar: [{
			text: 'Добавить',
			iconCls: 'add',
			action: 'createContractorAction'
		}],

		columns: [
			{
				header: "ID",
				editable: false,
				dataIndex: 'id',
				flex: 1
			},
			{
				header: "Наименование",
				editable: false,
				dataIndex: 'name',
				flex: 2
			},
			{
				header: "Комментарий",
				editable: false,
				dataIndex: 'comment',
				flex: 3
			}, {
				header: "Активный",
				xtype: 'checkcolumn',
				dataIndex: 'active',
				flex: 1
			}

		]
	}],

	initComponent: function() {
		this.callParent(arguments);
	}
});
