/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.view.Nets.NetsWindow', {
	extend: 'Ext.window.Window',

	title: 'Сети и точки',
	iconCls: 'nets',
	closable: true,
	closeAction: 'hide',
	maximizable: true,
	modal: false,
	width: 900,
	height: 400,
	layout: 'fit',
	autoFit: true,
	constrain: true,
	renderTo: 'content',

	items: [{
		xtype: 'tabpanel',
		border: false,
		items: [{
			title: 'Сети',
			layout: 'fit',
			border: false,
			listeners: {
				activate: function() {
					var store = Ext.getStore('Nets.Nets');
					store.clearFilter();
				}
			},
			items: [{
				xtype: 'grid',
				itemId: 'netsGrid',
				store: 'Nets.Nets',
				border: false,
				forceFit: true,

				tbar: [{
					text: 'Добавить',
					iconCls: 'add',
					action: 'createNetAction'
				}],

				columns: [
					{
						text: "ID",
						sortable: true,
						dataIndex: 'id',
						align: 'right',
						flex: 1
					}, {
						text: "Наименование",
						sortable: true,
						dataIndex: 'name',
						flex: 3
					}, {
						text: "Руководитель",
						sortable: true,
						dataIndex: 'curator_id',
						flex: 3,
						renderer: function(value, metaData, record) {
							var user = Ext.data.StoreManager.lookup('Users.Users').getById(record.get('curator_id'));
							return (user) ? user.get('name') : 'Не указан';
						}
					}, {
						text: "Опер.директор",
						sortable: true,
						dataIndex: 'chief_operating_officer_id',
						flex: 3,
						renderer: function(value, metaData, record, rowIndex, colIndex, store) {
							var user = Ext.data.StoreManager.lookup('Users.Users').getById(record.get('chief_operating_officer_id'));
							return (user) ? user.data.name : 'Не указан';
						}
					}, {
						header: "Активный",
						xtype: 'checkcolumn',
						dataIndex: 'active',
						flex: 2
					}, {
						header: "Проекты",
						xtype: 'checkcolumn',
						dataIndex: 'projects',
						flex: 2
					}
				]
			}]
		}, {
			title: 'Точки',
			layout: 'fit',
			border: false,
			listeners: {
				activate: function() {
					var store = Ext.getStore('Nets.Points');
					store.clearFilter();
					store.filter('project', false);
				}
			},

			items: [{
				xtype: 'grid',
				itemId: 'pointsGrid',
				store: 'Nets.Points',
				border: false,
				forceFit: true,

				tbar: [{
					text: 'Добавить',
					iconCls: 'add',
					action: 'createPointAction'
				}],

				columns: [
					{
						text: 'ID',
						sortable: true,
						dataIndex: 'id',
						align: 'right',
						flex: 1
					}, {
						text: 'Наименование',
						sortable: true,
						dataIndex: 'name',
						flex: 4
					}, {
						text: 'Сеть',
						sortable: true,
						dataIndex: 'net_id',
						flex: 3,
						renderer: function(value) {
							var data = Ext.data.StoreManager.lookup('Nets.Nets').getById(value);
							return (data) ? data.data.name : ' ';
						}
					}, {
						text: 'Город',
						dataIndex: 'city',
						flex: 2
					}, {
						text: 'Адрес',
						dataIndex: 'address',
						flex: 3
					}, {
						text: 'Телефон',
						dataIndex: 'phone',
						flex: 2
					}, {
						header: "Активный",
						xtype: 'checkcolumn',
						dataIndex: 'active',
						flex: 2
					}
				]
			}]
		}, {
			title: 'Проекты',
			layout: 'fit',
			border: false,
			listeners: {
				activate: function() {
					var store = Ext.getStore('Nets.Points');
					store.clearFilter();
					store.filter('project', true);
				}
			},

			items: [{
				xtype: 'grid',
				itemId: 'projectsGrid',
				store: 'Nets.Points',
				border: false,
				forceFit: true,

				tbar: [{
					text: 'Добавить',
					iconCls: 'add',
					action: 'createProjectAction'
				}],

				columns: [
					{
						text: 'ID',
						sortable: true,
						dataIndex: 'id',
						align: 'right',
						flex: 1
					}, {
						text: 'Наименование',
						sortable: true,
						dataIndex: 'name',
						flex: 4
					}, {
						text: 'Сеть',
						sortable: true,
						dataIndex: 'net_id',
						flex: 3,
						renderer: function(value) {
							var data = Ext.data.StoreManager.lookup('Nets.Nets').getById(value);
							return (data) ? data.data.name : ' ';
						}
					}, {
						text: 'Куратор',
						sortable: true,
						dataIndex: 'curator_id',
						flex: 3,
						renderer: function(value) {
							var data = Ext.data.StoreManager.lookup('Users.Users').getById(value);
							return (data) ? data.data.name : ' ';
						}
					}, {
						header: "Дата начала",
						dataIndex: 'dt_created',
						flex: 2,
						renderer: function(value) {
							if (!value) return 'Не определена';
							var d = moment(value, "YYYY-MM-DD HH:mm:ss");
							return  d.year() < 2000 ? 'Не определена' : d.format('DD.MM.YYYY');

						}
					}, {
						header: "Дата завершения",
						dataIndex: 'dt_finished',
						flex: 2,
						renderer: function(value) {
							if (!value) return 'В процессе';
							var d = moment(value, "YYYY-MM-DD HH:mm:ss");
							return  d.year() < 2000 ? 'В процессе' : d.format('DD.MM.YYYY');
						}
					}, {
						text: 'Город',
						dataIndex: 'city',
						flex: 2
					}, {
						header: "Активный",
						xtype: 'checkcolumn',
						dataIndex: 'active',
						flex: 2
					}
				]
			}]
		}]
	}],

	initComponent: function() {
		this.callParent();
	}
});
