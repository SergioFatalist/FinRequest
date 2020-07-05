/**
 * Created by Serhii Mykhailovskyi on 20.05.14.
 */

var dtEnd = Ext.Date.add(new Date(), Ext.Date.DAY, 1);
var dtStart = Ext.Date.add(dtEnd, Ext.Date.DAY, -14);

var now = moment(new Date()).lang('ru');
var nowYear = now.format('YYYY');
var nowMonth = now.format('MM');

var aMonths = [];
aMonths[aMonths.length] = {code: nowYear+nowMonth, name: now.format('MMMM')+' '+nowYear};

for(var i=1; i<12; i++) {
	var nextMonth = now.clone();
	nextMonth.add('M', i);
	aMonths[aMonths.length] = {code: nextMonth.format('YYYYMM'), name: nextMonth.format('MMMM YYYY')};
}

Ext.Loader.setConfig({
	enabled: true,
	disableCaching: true,
	paths: {
		FR: 'client'
	}
});

Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
	expires: new Date(new Date().getTime()+(1000*60*60*24*7)) //7 days from now
}));

Ext.Ajax.on('requestexception', function (conn, response, options) {
	if (response.status === 401) {
		window.location = '/';
	}
});

Ext.application({
	name: 'FR',
	appFolder: 'client',
	principal: Ext.create('FR.model.Users.Principal'),

	requires: [
		'Ext.container.Viewport',
		'FR.grid.LeafCheckColumn',
		'FR.tree.TreeStateful',
		'FR.model.Users.Principal',
		'FR.reader.Requests',
		'FR.form.UkrNumber',
		'FR.form.DateDisplayField',
		'FR.form.NumberInputFilter'
	],

	controllers: [
		'Nets',
		'Companies',
		'Contractors',
		'Categories',
		'Requests',
		'Templates',
		'Request',
		'Budgets',
		'Users',
		'Auth',
		'Settings'
	],

	stores: [
		'PaymentTypes',
		'Contractors.Contractors',
		'Categories.Categories',
		'Nets.Nets',
		'Nets.Points'
	],

	init: function(application ) {
		FR.model.Users.Principal.load(0, {
			scope: this,
			success: function(record) {
				application.principal = record;
				application.onLaunch();
			}
		});
	},

	onLaunch: function() {

		Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
			expires: new Date(new Date().getTime()+(1000*60*60*24*10))
		}));
		var toolBar = new Array();

		toolBar.push({
			xtype: 'label',
			html: '<div>FinRequest ' + version + '</div>',
			componentCls: 'appname'
		});

		if (this.principal.checkAccess('requests', 'read')) {
			toolBar.push('-', {
				text: 'Заявки',
				xtype: 'button',
				iconCls: 'requests',
				handler: function() {
					var wnd = Ext.create('FR.view.Requests.RequestsWindow');

					var store = Ext.getStore('Requests.MyRequests');
					store.clearFilter();
					store.proxy.setExtraParam('startdate', Ext.Date.format(dtStart, 'Y-m-d'));
					store.proxy.setExtraParam('enddate', Ext.Date.format(dtEnd, 'Y-m-d'));

					var store = Ext.getStore('Requests.Requests');
					store.clearFilter();
					store.proxy.setExtraParam('startdate', Ext.Date.format(dtStart, 'Y-m-d'));
					store.proxy.setExtraParam('enddate', Ext.Date.format(dtEnd, 'Y-m-d'));

					wnd.show();
				}
			});
		}

		if (this.principal.checkAccess('users', 'admin')) {
			toolBar.push('-', {
				text:'Пользователи',
				xtype:'button',
				iconCls:'users',
				handler: function() {
					Ext.getStore('Users.Groups').load();
					Ext.getStore('Users.Users').load();
					Ext.create('FR.view.Users.UsersWindow').show();
				}
			});
		}

		if (this.principal.checkAccess('companies', 'admin')) {
			toolBar.push('-', {
				text:'Юр лица',
				xtype:'button',
				iconCls:'companies',
				handler: function() {
					Ext.create('FR.view.Companies.CompaniesWindow').show();
				}
			});
		}

		if (this.principal.checkAccess('contractors', 'admin')) {
			toolBar.push('-', {
				text:'Контрагенты',
				xtype:'button',
				iconCls:'contractors',
				handler: function() {
					Ext.create('FR.view.Contractors.ContractorsWindow').show();
				}
			});
		}

		if (this.principal.checkAccess('categories', 'admin')) {
			toolBar.push('-', {
				text:'Категории затрат',
				xtype:'button',
				iconCls:'categories',
				handler: function() {
					Ext.create('FR.view.Categories.CategoriesWindow').show();
				}
			});
		}
//
		if (this.principal.checkAccess('nets', 'admin')) {
			toolBar.push('-', {
				text:'Сети и точки',
				xtype:'button',
				iconCls:'nets',
				handler: function() {
					Ext.create('FR.view.Nets.NetsWindow').show();
				}
			});
		}

		if (this.principal.checkAccess('budgets', 'load')) {
			toolBar.push('-', {
				text:'Бюджеты',
				xtype:'button',
				iconCls:'budgets',
				handler: function() {
					Ext.create('FR.view.Budgets.BudgetsWindow').show();
				}
			});
		}

		if (this.principal.checkAccess('settings', 'admin')) {
			toolBar.push('-', {
				text: 'Настройки',
				xtype: 'button',
				iconCls: 'settings',
				handler: function() {
					var wnd = Ext.create('FR.view.Settings.SettingsWindow');
					Ext.getStore('Rules.RulesTree').load();
					wnd.show();
				}
			});
		}

		toolBar.push('-',{
			text:'Выход',
			xtype: 'button',
			iconCls: 'logout',
			align: 'right',
			action: 'logoutAction'
		});

		toolBar.push('->',{
			xtype: 'label',
			html: '<div>' + this.principal.get('name') + '</div>',
			componentCls: 'username'
		});

		Ext.create('Ext.container.Viewport', {
			layout: 'border',
			defaults: {
				border: false
			},

			items: [{
				xtype: 'toolbar',
				region: 'north',
				id: 'menu',
				border: true,
				items: toolBar,
				height: 28
			},{
				xtype: 'box',
				region: 'center',
				collapsible: false,
				id: 'content',
				style: 'background: transparent;'
			}]
		});

		Ext.apply(Ext.form.field.VTypes, {
			notzero: function(value, field) {
				return value != 0;
			},
			notzeroText: 'Необходимо выбрать значение',
			notzeroMask: /[\d]/i
		});

		Ext.tip.QuickTipManager.init();
	}
});

function getLocalDateTime(value) {
	if (!value) return '';
	var d = moment(value, "YYYY-MM-DD HH:mm:ss");
	return  d.year() < 2000 ? '' : d.format('DD.MM.YYYY HH:mm:ss');
}

function getPeriod(value) {
	if (!value) return '';
	var d = moment(value, "YYYYMM");
	return  d.format('MMMM, YYYY');
}

if (typeof String.prototype.trim != 'function') { // detect native implementation
	String.prototype.trim = function () {
		return this.replace(/(^\s+|\s+$)/g, '');
	};
}
