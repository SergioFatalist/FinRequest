/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.view.Requests.RequestsGrid',{
	extend: 'Ext.grid.Panel',
	alias: 'widget.RequestsGridPanel',
	layout: 'fit',
	forceFit: true,
	loadMask: true,
	border: false,
	selType: 'checkboxmodel',
	selModel: {
		checkOnly: true
	},

	addButton: false,
	deleteButton: false,

	viewConfig: {
		getRowClass: function(record, index, rowParams, store) {
			var problem = false;
			var strong = false;

			var budget_info = record.get('budget_info');
			if (budget_info != null && budget_info != '') {
				budget_info.forEach(function(r){
					if (r.allowed != 0 && (r.allowed - r.in_progress - r.used) < 0) {
						strong = problem;
						problem = true;
					}
				});
			}
			return (problem) ? ( problem && strong ? 'strongred' : 'red') : '';
		}
	},

	tbar: [
		{
			text: 'Добавить',
			iconCls: 'add',
			itemId: 'addRequestButton',
			action: 'showRequestCreateWindowAction'
		}, {
			text: 'Удалить',
			itemId: 'deleteRequestButton',
			iconCls: 'delete',
			action: 'deleteSelectedRequestsAction'
		}, {
			text: 'Экспорт',
			itemId: 'exportListButton',
			iconCls: 'export',
			action: 'doExportAction'
		}, {
			text: 'Экспорт (расш.)',
			itemId: 'extendedExportListButton',
			iconCls: 'export',
			action: 'doExtendedExportAction'
		}, {
			text: 'Утвердить',
			itemId: 'approveRequestButton',
			iconCls: 'accept',
			disabled: true,
			action: 'approveSelectedRequestsAction'
		}, {
			text: 'Отклонить',
			itemId: 'declineRequestButton',
			iconCls: 'decline',
			disabled: true,
			action: 'declineSelectedRequestsAction'
		}, {
			xtype: 'pagingtoolbar',
			itemId: 'pager',
			displayInfo: true,
			pageSize: 25,
			beforePageText: 'Стр.',
			displayMsg: 'С {0} по {1} из {2}',
			emptyMsg: ''
		}, {
			xtype: 'label',
			itemId: 'totalAmount',
			cls: 'total',
			html: 'Заявки не выбраны'
		}
	],
	bbar: [
		{
			text: 'Показать',
			xtype: 'button',
			action: 'doRequestsFiltersAction'
		}, '-', {
			text: 'Очистить',
			xtype: 'button',
			action: 'clearRequestsFiltersAction'
		}, '-', {
			xtype: 'datefield',
			format: 'Y-m-d',
			filterName: 'filterStartDate',
			value: Ext.Date.format(dtStart, 'd-m-Y')
		}, {
			xtype: 'datefield',
			format: 'Y-m-d',
			filterName: 'filterEndDate',
			value: Ext.Date.format(dtEnd, 'd-m-Y')
		}, '-', {
			emptyText: 'Статус',
			xtype: 'combo',
			matchFieldWidth: false,
			filterName: 'filterStatus',
			editable: true,
			minChars: 1,
			forceSelection: true,
			typeAhead: true,
			triggerAction: 'all',
			mode: 'local',
			store: 'Requests.Statuses',
			displayField: 'name',
			valueField: 'id'
		}, '-', {
			emptyText: 'Статья P&L',
			xtype: 'combo',
			filterName: 'filterCategory',
			matchFieldWidth: false,
			editable: true,
			typeAhead: true,
			minChars: 1,
			triggerAction: 'all',
			mode: 'local',
			store: 'Categories.Categories',
			valueField: 'id',
			displayField: 'name',
			lastQuery: ''
		}, '-', {
			emptyText: 'Контрагент',
			xtype: 'combo',
			matchFieldWidth: false,
			filterName: 'filterContractor',
			editable: true,
			typeAhead: true,
			minChars: 1,
			triggerAction: 'all',
			queryMode: 'local',
			sortOnFilter: 'true',
			store: 'Contractors.Contractors',
			valueField: 'id',
			displayField: 'name',
			enableKeyEvents: true
		}, '-', {
			emptyText: 'Сеть',
			xtype: 'combo',
			matchFieldWidth: false,
			filterName: 'filterNetwork',
			editable: true,
			forceSelection: true,
			typeAhead: true,
			minChars: 1,
			triggerAction: 'all',
			queryMode: 'local',
			store: 'Nets.Nets',
			valueField: 'id',
			displayField: 'name',
			lastQuery: '',
			listeners: {
				select: function(combo) {
					var store = Ext.getStore('Nets.Points');
					store.clearFilter();
					store.filter('net_id', combo.getValue());
				}
			}
		}, '-', {
			emptyText: 'Точка',
			xtype: 'combo',
			matchFieldWidth: false,
			filterName: 'filterPoint',
			itemId: 'point_id',
			editable: true,
			forceSelection: true,
			typeAhead: true,
			minChars: 1,
			triggerAction: 'all',
			queryMode: 'local',
			store: 'Nets.Points',
			displayField: 'name',
			valueField: 'id',
			lastQuery: ''
		}
	],

	columns: [
		{
			text: "ID",
			sortable: true,
			dataIndex: 'id',
			align: 'right',
			flex: 1
		}, {
			text: "Дата создания",
			xtype:'datecolumn',
			sortable: true,
			dataIndex: 'dt_created',
			flex: 3,
			renderer: function (value) {
				if (!value) return '';
				var d = moment(value, "YYYY-MM-DD HH:mm:ss");
				return  d.year() < 2000 ? '' : d.format('DD.MM.YYYY HH:mm');
			}
		}, {
			text: "Автор",
			sortable: true,
			dataIndex: 'requester',
			flex: 3
		}, {
			text: "Юр.лицо",
			sortable: true,
			dataIndex: 'company_id',
			flex: 3,
			renderer: function (value) {
				return Ext.getStore('Companies.Companies').getById(value).get('name');
			}

		}, {
			text: "Сеть",
			sortable: true,
			dataIndex: 'net_id',
			flex: 3,
			renderer: function (value, metaData, record) {
				if (record.get('nets_count')==0) {
					return 'no data';
				} else if (record.get('nets_count')>1) {
					return 'Более одной';
				} else {
					var net = Ext.getStore('Nets.Nets').getById(value);
					var name = 'Сеть неактивна';
					if (net) {
						name = net.get('name');
					}
					return name;
				}
			}
		}, {
			header: "Торговая точка",
			sortable: true,
			dataIndex: 'point_id',
			flex: 3,
			renderer: function (value, metaData, record) {
				if (record.get('nets_count')==0 || record.get('nets_count')>1) {
					return '';
				} else {
					return Ext.getStore('Nets.Points').getById(record.get('point_id')).get('name');
				}
			}
		}, {
			header: "Дата оплаты",
			xtype:'datecolumn',
			sortable: true,
			dataIndex: 'dt_payment',
			flex: 3,
			renderer: function(value) {
				if (!value) return '';
				var d = moment(value, "YYYY-MM-DD HH:mm:ss");
				return  d.year() < 2000 ? '' : d.format('DD.MM.YYYY');
			}
		}, {
			header: "Форма оплаты",
			sortable: true,
			dataIndex: 'payment_type',
			flex: 3,
			renderer: function(value) {
				if (!value || value == 0) {
					return '';
				}
				return Ext.getStore('PaymentTypes').getById(value).get('name');
			}
		}, {
			header: "Сумма",
			itemId: 'amountCell',
			sortable: true,
			dataIndex: 'amount',
			xtype: 'numbercolumn',
			align: 'right',
			name: 'amount',
			flex: 3,
			renderer: function(value, meta, record) {
				var money = Ext.getStore('Settings.Parameters').findRecord('sysname', 'money');
				var budget_info = record.get('budget_info');
				var toolTipText = '';

				if (budget_info != null && budget_info != '') {
					budget_info.forEach(function(r){
						if (r.allowed != 0) {
							r.allowed = r.allowed ? r.allowed : 0;
							r.in_progress = r.in_progress ? r.in_progress : 0;
							r.used = r.used ? r.used : 0;
							var rest = r.allowed - r.in_progress - r.used;
							toolTipText += '<pre>Сеть: <b>' + r.net_name + '</b>, доступно: ' + Ext.util.Format.number(rest, "0,000.00") + ' ' + money.data.value + '<br />';
							toolTipText += '    Бюджет:' + Ext.util.Format.number(r.allowed, "0,000.00");
							toolTipText += ' В работе:' + Ext.util.Format.number(r.in_progress, "0,000.00");
							toolTipText += ' Оплачено:' + Ext.util.Format.number(r.used, "0,000.00") + '</pre>';
						}
					});
				}
				toolTipText = toolTipText == '' ? 'Нет данных' : toolTipText;

				return '<div data-qtip="' + toolTipText + '">' + Ext.util.Format.number(value, '0,000.00') + '</div>';
			}
		}, {
			header: "Назначение платежа",
			sortable: true,
			flex: 3,
			dataIndex: 'description'
		}, {
			header: "Статья P&L",
			sortable: true,
			dataIndex: 'category_id',
			flex: 3,
			renderer: function(value) {
				return Ext.getStore('Categories.Categories').getById(value).get('name');
			}
		}, {
			header: "Статус заявки",
			sortable: true,
			dataIndex: 'status',
			flex: 3,
			renderer: function(value) {
				if (!value || value == 0) {
					return '';
				}
				return Ext.getStore('Requests.Statuses').getById(value).get('name');
			}
		}
	],

	initComponent: function() {
		this.callParent(arguments);

		var app = FR.getApplication();

		this.down('[itemId=addRequestButton]').setVisible(this.addButton && app.principal.checkAccess('requests', 'create'));
		this.down('[itemId=deleteRequestButton]').setVisible(this.deleteButton && app.principal.checkAccess('requests', 'delete'));
		this.down('[itemId=exportListButton]').setVisible(app.principal.checkAccess('requests', 'export'));
		this.down('[itemId=extendedExportListButton]').setVisible(app.principal.checkAccess('requests', 'export'));
		this.down('[itemId=approveRequestButton]').setVisible(this.approveButton && app.principal.checkAccess('requests', 'approve'));
		this.down('[itemId=declineRequestButton]').setVisible(this.declineButton && app.principal.checkAccess('requests', 'approve'));

		this.store.on('load', this.updateTotalAmount, this);
		this.down('[itemId=pager]').bindStore(this.store);
	},

	updateTotalAmount: function(store) {
		var label = this.down('[itemId=totalAmount]');
		var money = Ext.getStore('Settings.Parameters').findRecord('sysname', 'money');
		var amount = store.proxy.reader.amount;
		if (amount == 0) {
			label.setText('Нет заявок');
		} else {
			label.setText('На сумму ' + Ext.util.Format.number(amount, '0,000.00') + ' ' + money.get('value'));
		}

	}

});