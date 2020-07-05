/**
 * Created by Serhii Mykhailovskyi on 29.05.14.
 */

Ext.define('FR.view.Requests.Budgets.PerProjectGrid',{
	extend: 'Ext.grid.Panel',
	store: 'Requests.Budgets.PerProject',
	alias: 'widget.budgetsPerProjectGrid',
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
			action: 'doBudgetsPerProjectDataFiltersAction'
		}
	],

	columns: [
		{
			header: "Проект",
			width: 200,
			sortable: true,
			dataIndex: 'target_id',
			summaryType: 'count',
			summaryRenderer: function(value) {
				return 'Итого';
			},
			renderer: function(value){
				return Ext.getStore('Nets.Points').getById(value).get('name');
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

