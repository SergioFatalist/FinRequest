/**
 * Created by Serhii Mykhailovskyi on 27.05.14.
 */

Ext.define('FR.view.Requests.Request.PointsGridEditor', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.pointsGridEditor',
	store: 'Requests.Points.RequestPoints',
	name: 'points_list',
	height: 200,
	region: 'center',
	layout: 'fit',

	tbar:[
		{
		//	text: 'Добавить точку',
		//	iconCls: 'add',
		//	action: 'addPointToRequestAction'
		//}, {
			text: 'Выбрать точки',
			iconCls: 'accept',
			handler: function() {
				var me = this;
				var wnd = Ext.create('FR.view.Nets.NetsPointsTreeWindow');
				var form_wnd = me.up('window');
				var category = Ext.getStore('Categories.Categories').getById(form_wnd.down('field[name=category_id]').getValue());
				var store = Ext.data.StoreManager.lookup('Nets.NetsTree');

				store.proxy.setExtraParam('investment', category.get('investment'));
				store.load();
				wnd.show();
			}
		}, {
			text: 'Разбить поровну',
			action: 'distributeByPointsAction',
			disabled: false
		}, {
			xtype: 'label',
			itemId: 'pointslistTotalRest',
			cls: 'total',
			html: ''
		}
	],

	columns: [
		{
			xtype: 'actioncolumn',
			sortable: false,
			//width: '36px',
			flex: 1,
			stopSelection: true,
			items: [{
			},{
				icon: 'theme/images/delete.gif',
				handler: function(grid, rowIndex, colIndex) {
					grid.store.remove(grid.getStore().getAt(rowIndex));
				}
			}]
		}, {
			text: 'Сеть',
			flex: 3,
			sortable: true,
			dataIndex: 'net_id',
			allowBlank: false,
			align: 'left',
			renderer: function(value, metaData, record) {
				var data = Ext.getStore('Nets.Nets').getById(record.data.net_id);
				return (data) ? data.data.name : '';
			}
		}, {
			text: 'Точка',
			flex: 3,
			sortable: true,
			dataIndex: 'point_id',
			allowBlank: false,
			align: 'left',
			renderer: function(value, metaData, record, rowIndex, colIndex, store) {
				var data = Ext.getStore('Nets.Points').getById(record.data.point_id);
				return (data) ? data.data.name : '';
			}
		}, {
			xtype: 'numbercolumn',
			header: 'Платеж',
			dataIndex: 'amount',
			format: '0,000.00',
			align: 'right',
			flex: 2,
			sortable: true,
			editor: {
				align: 'right',
				xtype: 'numberfield',
				allowBlank: false,
				minValue: 0,
				decimalSeparator: '.',
				plugins: Ext.create('plugin.numberinputfilter')
			}
		}
	],

	plugins: [{
		ptype: 'cellediting',
		pluginId: 'pointCellEditor',
		clicksToEdit: 1,
		listeners: {
			edit: function(editor, e) {
				var money = Ext.getStore('Settings.Parameters').findRecord('sysname', 'money').get('value');
				var grid = e.grid;
				var label = grid.down('label[itemId=pointslistTotalRest]');
				var store = grid.store;
				var requestTotal = grid.up('form').down('field[name=amount]').getValue();
				var countOfPoints = store.getCount();
				if (countOfPoints == 0) {
					return true;
				}

				var totalRest = Math.floor(requestTotal * 10000 ) / 10000;
				store.each(
					function (point) {
						totalRest = totalRest - point.get('amount');
					}
				);
				label.setText('Не распределено: ' + Ext.util.Format.number(totalRest, '0,000.00') + ' ' + money);
			}
		}
	}]
});

