/**
 * Created by Serhii Mykhailovskyi on 29.05.14.
 */

Ext.define('FR.view.Requests.Budgets.PerCategoryGrid',{
	extend: 'Ext.grid.Panel',
	store: 'Requests.Budgets.PerCategory',
	alias: 'widget.budgetsPerCategoryGrid',
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
			action: 'doBudgetsPerCategoryDataFiltersAction'
		},'-',{
			xtype: 'button',
			text: 'Очистить',
			action: 'clearBudgetsPerCategoryDataFiltersAction'
		},'-',{
			xtype: 'datefield',
			format: 'Y-m',
			filterName: 'filterPeriod',
			value: Ext.Date.format(dtStart, 'Ym')
		},'-',{
			xtype: 'combo',
			width: 120,
			matchFieldWidth: false,
			filterName: 'filterNetwork',
			editable: true,
			forceSelection: true,
			emptyText: 'Сеть',
			typeAhead: true,
			triggerAction: 'all',
			mode: 'local',
			store: 'Nets.Nets',
			valueField: 'id',
			displayField: 'name',
			lastQuery: ''
		}
	],

	columns: [
		{
			header: "Категория",
			flex: 3,
			sortable: true,
			dataIndex: 'category_name',
			summaryType: 'count',
			summaryRenderer: function(value) {
				return 'Итого';
			}
		}, {
			xtype: 'numbercolumn',
			header: "Разрешено",
			flex: 1,
			sortable: true,
			dataIndex: 'allowed',
			format: '0,000.00',
			summaryType: 'sum',
			align: 'right'
		}, {
			xtype: 'numbercolumn',
			header: "Использовано",
			flex: 1,
			sortable: true,
			dataIndex: 'used',
			format: '0,000.00',
			summaryType: 'sum',
			align: 'right'
		}, {
			xtype: 'numbercolumn',
			header: "В работе",
			flex: 1,
			sortable: true,
			dataIndex: 'in_progress',
			format: '0,000.00',
			summaryType: 'sum',
			align: 'right'
		}, {
			xtype: 'numbercolumn',
			header: "Доступно",
			flex: 1,
			sortable: true,
			dataIndex: 'rest',
			format: '0,000.00',
			summaryType: 'sum',
			align: 'right'
//		}, {
//			header: "planned",
//			flex: 1,
//			sortable: true,
//			dataIndex: 'planned',
//			align: 'right'
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

