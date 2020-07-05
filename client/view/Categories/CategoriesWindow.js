/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.view.Categories.CategoriesWindow', {
	extend: 'Ext.window.Window',

	title: 'Категории затрат',
	iconCls: 'categories',
	closable: true,
	maximizable: true,
	modal: false,
	width: 450,
	height: 500,
	layout: 'fit',
	constrain: true,
	renderTo: 'content',

	items: [{
		xtype: 'treepanel',
		store: 'Categories.CategoriesTree',
		loadMask: true,
		itemId: 'categoriesTree',
		displayField: 'name',
		border: false,
		forceFit: true,
		useArrows: true,
		rootVisible: false,
		autoScroll: true,
		animate: true,
		loadMask: true,

		tbar: [{
			text: 'Добавить',
			iconCls: 'add',
			action: 'createCategoryAction'
		}],

		viewConfig: {
			toggleOnDblClick: false
		},
		root: {
			text: 'Категории затрат',
			draggable: false,
			id: '-1'
		}
	}],

	initComponent: function() {
		this.callParent(arguments);
	}
});
