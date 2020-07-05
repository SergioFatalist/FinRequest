/**
 * Created by Serhii Mykhailovskyi on 09.10.2014.
 */

Ext.define('FR.view.Nets.NetsPointsTreeWindow', {
	extend: 'Ext.window.Window',

	title: 'Сети и точки11',
	iconCls: 'nets',
	closable: true,
	closeAction: 'hide',
	maximizable: true,
	modal: true,
	width: 500,
	height: 400,
	layout: 'fit',
	autoFit: true,
	constrain: true,
	renderTo: 'content',

	items: [{
		xtype: 'treepanel',
		rootVisible: false,
		autoScroll: true,
		useArrows: true,
		border: false,
		height: 300,
		margin: 0,
		anchor: '0',
		store: 'Nets.NetsTree',
		columns: [
			{
				text: 'Сеть/точка',
				xtype: 'treecolumn',
				sortable: false,
				dataIndex: 'name',
				flex: 3
			}, {
				text: 'Выбрать',
				xtype: 'checkcolumn',
				dataIndex: 'sel',
				sortable: false,
				flex: 1,
				listeners: {
					checkchange: function(col, rowIndex, checked) {
						var store = Ext.data.StoreManager.lookup('Nets.NetsTree');
						var recs = store.getModifiedRecords();
						for (var i=0; i<recs.length; i++) {
							if(recs[i].isLeaf()) {
								recs[i].parentNode.set('sel', checked);
								break;
							} else {
								recs[i].eachChild(function (r){
									r.set('sel', checked);
									r.setDirty();
								})
							}
						}
						return true;
					}
				}
			}
		]
	}],

	buttons: [
		{
			text: 'Добавить в заявку',
			iconCls: 'add',
			action: 'addPointsToRequestAction',
			scope: this
		}
	]
});
