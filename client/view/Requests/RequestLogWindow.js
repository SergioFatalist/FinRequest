/**
 * Created by sergio on 22.10.14.
 */

Ext.define('FR.view.Requests.RequestLogWindow', {
	extend: 'Ext.window.Window',
	width: 900,
	maxHeight: 600,
	modal: true,
	closable: true,
	maximizable: false,
	iconCls: 'requests',
	layout: 'fit',
	constrain: true,
	renderTo: 'content',

	items: [{
		xtype: 'grid',
		layout: 'fit',
		forceFit: true,
		loadMask: true,
		border: false,
		store: 'Requests.Logs',
		columns: [{
			text: "ID",
			sortable: true,
			dataIndex: 'id',
			align: 'right',
			flex: 1
		}, {
			text: "Дата записи",
			xtype:'datecolumn',
			sortable: true,
			dataIndex: 'dt',
			flex: 3,
			renderer: function (value) {
				if (!value) return '';
				var d = moment(value, "YYYY-MM-DD HH:mm:ss");
				return  d.year() < 2000 ? '' : d.format('DD.MM.YYYY HH:mm:ss');
			}
		}, {
			text: "Пользователь",
			sortable: true,
			dataIndex: 'user_id',
			flex: 3,
			renderer: function (value) {
				return Ext.getStore('Users.Users').getById(value).get('name');
			}
		}, {
			text: "Статус",
			sortable: true,
			dataIndex: 'status',
			flex: 4,
			renderer: function (value) {
				return Ext.getStore('Requests.Statuses').getById(value).get('name');
			}
		}, {
			text: "Действие",
			sortable: false,
			flex: 4,
			dataIndex: 'comment'
		}, {
			text: "Подробности",
			sortable: false,
			itemId: 'detailsColumn',
			flex: 9,
			dataIndex: 'details',
			renderer: function(value){
				return '<div style="white-space:normal !important;">'+ value +'</div>';
			}
		}]
	}],

	initComponent: function() {
		this.callParent(arguments);
	}
});