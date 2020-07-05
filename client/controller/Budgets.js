/**
 * Created by Serhii Mykhailovskyi on 29.05.14.
 */

Ext.define('FR.controller.Budgets', {
	extend: 'Ext.app.Controller',

	stores: [
		'Budgets.Operational',
		'Budgets.Investment',
		'Months'
	],

	views: [
		'Budgets.BudgetsWindow',
		'Budgets.OperationalImportWindow',
		'Budgets.InvestmentImportWindow'
	],

	init: function() {
		this.control({
			'grid[itemId=operationalBudgetsGrid]': {
				render: this.doLoadOperationalStore
			},
			'grid[itemId=investmentBudgetsGrid]': {
				render: this.doLoadInvestmentStore
			},
			'button[action=showOperationalImportWindowAction]': {
				click: this.showOperationalImportWindow
			},
			'button[action=showInvestmentImportWindowAction]': {
				click: this.showInvestmentImportWindow
			},
			'button[action=sendOperationalBudgetAction]': {
				click: this.sendOperationalBudget
			},
			'button[action=sendInvestmentBudgetAction]': {
				click: this.sendInvestmentBudget
			},


			'button[action=doBudgetsPerCategoryDataFiltersAction]': {
				click: this.doBudgetsPerCategoryDataFilters
			},
			'button[action=clearBudgetsPerCategoryDataFiltersAction]': {
				click: this.clearBudgetsPerCategoryDataFilters
			},
			'button[action=doBudgetsPerNetworkDataFiltersAction]': {
				click: this.doBudgetsPerNetworkDataFilters
			},
			'button[action=clearBudgestPerNetworkDataFiltersAction]': {
				click: this.clearBudgetsPerNetworkDataFilters
			},
			'button[action=doBudgetsPerProjectDataFiltersAction]': {
				click: this.doBudgetsPerProjectDataFilters
			}
		});
	},

	doLoadOperationalStore: function() {
		Ext.data.StoreManager.lookup('Budgets.Operational').load();
	},

	doLoadInvestmentStore: function() {
		Ext.data.StoreManager.lookup('Budgets.Investment').load();
	},

	showOperationalImportWindow: function() {
		Ext.create('FR.view.Budgets.OperationalImportWindow').show();
	},

	showInvestmentImportWindow: function() {
		Ext.create('FR.view.Budgets.InvestmentImportWindow').show();
	},

	doBudgetsPerCategoryDataFilters: function(button) {
		var grid = button.up('grid');
		var store = grid.store;

		store.clearFilter();
		store.proxy.setExtraParam('month', Ext.Date.format(grid.down('[filterName=filterPeriod]').getValue(), 'Ym'));
		store.proxy.setExtraParam('target_id', grid.down('[filterName=filterNetwork]').getValue());
		store.load();

	},

	clearBudgetsPerCategoryDataFilters: function(button) {
		var grid = button.up('grid');
		var store = grid.store;
		store.clearFilter();

		grid.down('[filterName=filterPeriod]').setValue('');
		grid.down('[filterName=filterNetwork]').clearValue();

		store.removeAll();
	},

	doBudgetsPerNetworkDataFilters: function(button) {
		var grid = button.up('grid');
		var store = grid.store;

		store.clearFilter();
		store.proxy.setExtraParam('month', Ext.Date.format(grid.down('[filterName=filterPeriod]').getValue(), 'Ym'));
		store.load();
	},

	clearBudgetsPerNetworkDataFilters: function(button) {
		var grid = button.up('grid');
		var store = grid.store;
		store.clearFilter();

		grid.down('[filterName=filterPeriod]').setValue('');
		store.removeAll();
	},

	doBudgetsPerProjectDataFilters: function(button) {
		var grid = button.up('grid');
		var store = grid.store;
		store.load();
	},

	sendOperationalBudget: function(button) {
		this.sendBudget(button, 'budgets/operational/import', 'Budgets.Operational');
	},

	sendInvestmentBudget: function(button) {
		this.sendBudget(button, 'budgets/investment/import', 'Budgets.Investment');
	},

	sendBudget: function(button, url, storeName) {
		var form = button.up('form');
		var store = Ext.data.StoreManager.lookup(storeName);

		if (!form.isValid()) {
			Ext.Msg.show({
				title: 'Ошибка',
				msg: 'Форма не корректно заполнена!',
				icon: Ext.MessageBox.ERROR,
				buttons: Ext.MessageBox.OK
			});
			return false;
		}

		form.submit({
			url: url,
			waitMsg: 'Импорт файла. Подождите, пожалуйста...',
			success:function(form, action){
				form.reset();
				button.up('window').close();
				store.load();
				Ext.Msg.show({
					title: 'Успешно',
					msg: action.result.message,
					icon: Ext.MessageBox.INFO,
					buttons: Ext.MessageBox.OK
				});
			},
			failure: function(form, action) {
				switch (action.failureType) {
					case Ext.form.Action.CLIENT_INVALID:
						Ext.Msg.show({
							title: 'Ошибка',
							msg: 'Возможно поля формы были заполнены неверно!' + action.result.message,
							icon: Ext.MessageBox.ERROR,
							buttons: Ext.MessageBox.OK
						});
						break;
					case Ext.form.Action.CONNECT_FAILURE:
						Ext.Msg.show({
							title: 'Ошибка',
							msg: 'Ошибка связи с сервером!' + action.result.message,
							icon: Ext.MessageBox.ERROR,
							buttons: Ext.MessageBox.OK
						});
						break;
					case Ext.form.Action.SERVER_INVALID:
						Ext.Msg.show({
							title: 'Ошибка',
							msg:  action.result.message,
							icon: Ext.MessageBox.ERROR,
							buttons: Ext.MessageBox.OK
						});
						store.load();
						break;
					default:
						Ext.Msg.show({
							title: 'Ошибка',
							msg:  action.result.message,
							icon: Ext.MessageBox.ERROR,
							buttons: Ext.MessageBox.OK
						});
						store.load();
				}
			}

		})
	}

});