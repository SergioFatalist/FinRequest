/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.view.Requests.RequestsWindow', {
	extend: 'Ext.window.Window',
	title: 'Заявки',
	iconCls: 'requests',
	closable: true,
	closeAction: 'hide',
	maximizable: true,
	maximized: true,
	width: 1300,
	height: 540,
	layout: 'fit',
	autoFit: true,
	constrain: true,
	renderTo: 'content',

	items: [
		{
			xtype: 'tabpanel',
			border: false,
			//activeTab: 1,
			items: [
				{
					title: 'Все заявки',
					layout: 'fit',
					itemId: 'myrequestsGridTab',
					border: false,
					items: [{
						xtype: 'RequestsGridPanel',
						itemId: 'myrequestsGrid',
						store: 'Requests.MyRequests',
						autoFit: true,
						addButton: true,
						deleteButton: false,
						approveButton: false,
						declineButton: false
					}]
				}, {
					title: 'На утверждении',
					layout: 'fit',
					itemId: 'requestsGridTab',
					border: false,
					items: [{
						xtype: 'RequestsGridPanel',
						itemId: 'requestsGrid',
						store: 'Requests.Requests',
						autoFit: true,
						addButton: false,
						deleteButton: false,
						approveButton: true,
						declineButton: true
					}]
				}, {
					title: 'Шаблоны заявок',
					layout: 'fit',
					itemId: 'requestTemplatesGridTab',
					border: false,
					items: [{
						xtype: 'requestTemplatesGrid',
						itemId: 'requestTemplatesGrid',
						border: false
					}]
				}, {
					title: 'Бюджет по категориям',
					layout: 'fit',
					itemId: 'budgetsPerCategoryGridTab',
					border: false,
					items: [{
						xtype: 'budgetsPerCategoryGrid',
						border: false
					}]
				}, {
					title: 'Бюджет по сетям',
					layout: 'fit',
					itemId: 'budgetsPerNetworkGridTab',
					border: false,
					items: [{
						xtype: 'budgetsPerNetworkGrid',
						border: false
					}]
				}, {
					title: 'Бюджет по проектам',
					layout: 'fit',
					itemId: 'budgetsPerProjectGridTab',
					border: false,
					items: [{
						xtype: 'budgetsPerProjectGrid',
						border: false
					}]
				}
			]
		}
	],

	initComponent: function() {
		this.callParent(arguments);
		var app = FR.getApplication();

		if (!app.principal.checkAccess('budgets', 'read')) {
			this.down('tabpanel [itemId=budgetsPerCategoryGridTab]').close();
			this.down('tabpanel [itemId=budgetsPerNetworkGridTab]').close();
			this.down('tabpanel [itemId=budgetsPerProjectGridTab]').close();
		}
		if (!app.principal.checkAccess('requests', 'approve')) {
			this.down('tabpanel [itemId=requestsGridTab]').close();
			this.down('tabpanel').setActiveTab(0);
		} else {
			this.down('tabpanel').setActiveTab(1);
		}

	}
});