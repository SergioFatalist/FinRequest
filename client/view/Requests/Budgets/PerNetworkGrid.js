/**
 * Created by Serhii Mykhailovskyi on 29.05.14.
 */

Ext.define('FR.view.Requests.Budgets.PerNetworkGrid',{
	extend: 'Ext.grid.Panel',
	store: 'Requests.Budgets.PerNetwork',
	alias: 'widget.budgetsPerNetworkGrid',
	forceFit: true,
	viewConfig: {
		getRowClass: function(record, index, rowParams, store) {
			return (record.get('rest') < 0) ? 'red' : '';
		}
	},

	bbar: [
		{
			xtype: 'button',
			text: 'Показать',
			action: 'doBudgetsPerNetworkDataFiltersAction'
		},'-',{
			xtype: 'button',
			text: 'Очистить',
			action: 'clearBudgestPerNetworkDataFiltersAction'
		},'-',{
			xtype: 'datefield',
			format: 'Y-m',
			filterName: 'filterPeriod',
			value: Ext.Date.format(dtStart, 'Ym')
		}
	],

	columns: [
		{
			header: "Сеть",
			width: 200,
			sortable: true,
			dataIndex: 'target_id',
			summaryType: 'count',
			summaryRenderer: function(value) {
				return 'Итого';
			},
			renderer: function(value){
				return Ext.getStore('Nets.Nets').getById(value).get('name');
			}
		}, {
			header: "Разрешено",
			xtype: 'numbercolumn',
			width: 150,
			sortable: true,
			dataIndex: 'allowed',
			format: '0,000.00',
			summaryType: 'sum',
			align: 'right'
		}, {
			header: "Использовано",
			xtype: 'numbercolumn',
			width: 150,
			sortable: true,
			dataIndex: 'used',
			format: '0,000.00',
			summaryType: 'sum',
			align: 'right'
		}, {
			header: "В работе",
			xtype: 'numbercolumn',
			width: 150,
			sortable: true,
			dataIndex: 'in_progress',
			format: '0,000.00',
			summaryType: 'sum',
			align: 'right'
		}, {
			header: "Доступно",
			xtype: 'numbercolumn',
			width: 150,
			sortable: true,
			dataIndex: 'rest',
			format: '0,000.00',
			summaryType: 'sum',
			align: 'right'
		}
	],

	features: [{
		ftype: 'groupingsummary',
		groupHeaderTpl: ['{name:this.formatName}', {
			formatName: function(name) {
				return (name == 1) ? 'Планируемые' : 'Не планируемые';
			}
		}],
		hideGroupedHeader: false,
		enableGroupingMenu: false
	}]
});

