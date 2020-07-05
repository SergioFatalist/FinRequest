/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.view.Companies.CompaniesWindow', {
	extend: 'Ext.window.Window',

	title: 'Юр.лица',
	iconCls: 'companies',
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
		itemId: 'companiesGrid',
		border: false,
		store: 'Companies.Companies',
		forceFit: true,

		tbar: [{
				text: 'Добавить',
				iconCls: 'add',
				action: 'createCompanyAction'
		}],

		columns: [
			{
				header: "ID",
				width: 20,
				editable: false,
				dataIndex: 'id'
			},
			{
				header: "Юр.лицо",
				width: 250,
				editable: false,
				dataIndex: 'name'
			},
			{
				header: "Комментарий",
				width: 450,
				editable: false,
				dataIndex: 'comment'
			}, {
				header: "Активный",
				xtype: 'checkcolumn',
				width: 80,
				dataIndex: 'active'
			}

		]

	}],

	initComponent: function() {
		this.callParent(arguments);
	}
});
