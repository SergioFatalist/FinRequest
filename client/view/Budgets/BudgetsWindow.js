/**
 * Created by Serhii Mykhailovskyi on 01.06.14.
 */

Ext.define('FR.view.Budgets.BudgetsWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.BudgetsWindow',

	title: 'Бюджетирование',
	iconCls: 'budgets',
	closable: true,
	maximizable: true,
	modal: false,
	width: 600,
	height: 500,
	layout: 'fit',
	constrain: true,
	renderTo: 'content',

	items: [{
		xtype: 'tabpanel',
		border: false,
		items: [{
			title: 'Операционные',
			layout: 'fit',
			border: false,
			items: [{
				xtype: 'grid',
				store: 'Budgets.Operational',
				itemId: 'operationalBudgetsGrid',
				border: false,
				forceFit: true,

				tbar: [
					{
						text: 'Добавить',
						iconCls: 'add',
						itemId: 'save',
						action: 'showOperationalImportWindowAction'
					}
				],

				columns: [
					{
						text: "ID",
						sortable: true,
						align: 'right',
						dataIndex: 'id',
						flex: 1
					}, {
						text: "Сеть",
						sortable: true,
						dataIndex: 'target_id',
						renderer: function(value) {
							var data = Ext.data.StoreManager.lookup('Nets.Nets').getById(value);
							return (data) ? data.data.name : ' ';
						},
						flex: 5
					}, {
						text: "Период",
						sortable: true,
						dataIndex: 'month',
						renderer: function(value) {
							if (!value) return '';
							var d = moment(value, "YYYYMM");
							return  d.format('MMMM, YYYY');
						},
						flex: 5
					}, {
						text: "Загружено категорий",
						sortable: true,
						dataIndex: 'categories',
						flex: 3
					}
				]
			}]
		},{
			title: 'Инвестиционные',
			layout: 'fit',
			border: false,
			items: [{
				xtype: 'grid',
				store: 'Budgets.Investment',
				itemId: 'investmentBudgetsGrid',
				border: false,
				forceFit: true,

				tbar: [
					{
						text: 'Добавить',
						iconCls: 'add',
						itemId: 'save',
						action: 'showInvestmentImportWindowAction'
					}
				],

				columns: [
					{
						text: "ID",
						sortable: true,
						align: 'right',
						dataIndex: 'id',
						flex: 1
					}, {
						text: "Проект",
						sortable: true,
						dataIndex: 'target_id',
						renderer: function(value) {
							var data = Ext.data.StoreManager.lookup('Nets.Points').getById(value);
							return (data) ? data.get('name') : ' ';
						},
						flex: 5
					}, {
						text: "Загружено категорий",
						sortable: true,
						dataIndex: 'categories',
						flex: 3
					}
				]
			}]

		}]
	}],

	initComponent: function() {
		this.callParent(arguments);
	}

});
