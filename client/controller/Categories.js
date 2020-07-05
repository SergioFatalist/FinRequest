/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.controller.Categories', {
	extend: 'Ext.app.Controller',

	stores: [
		'Categories.Categories',
		'Categories.SubCategories',
		'Categories.CategoriesTree'
	],

	views: [
		'Categories.CategoriesWindow',
		'Categories.CategoryEditWindow'
	],

	refs: [
		{
			ref: 'categoriesTree',
			selector: 'categoriesTree'
		}
	],

	init: function() {
		this.control({
			'treepanel[itemId=categoriesTree]': {
				itemdblclick: this.showCategoryEditWindow,
				itemclick: this.updateButtonStates
			},
			'button[action=createCategoryAction]': {
				click: this.showCategoryCreateWindow
			},
			'button[action=saveCategoryAction]': {
				click: this.saveCategory
			}
		});

	},

	showCategoryEditWindow: function(view, record) {
		var wnd = Ext.create('FR.view.Categories.CategoryEditWindow', {title: 'Редактирование категории'});
		var store = Ext.data.StoreManager.lookup('Categories.CategoriesTree');
		var model = store.getById(record.raw.id);
		wnd.down('form').loadRecord(model);
		wnd.show();
	},

	showCategoryCreateWindow: function() {
		Ext.create('FR.view.Categories.CategoryEditWindow', {title: 'Создание категории'}).show();
	},

	saveCategory: function(button) {
		var win    = button.up('window');
		var form   = win.down('form');
		var	record = form.getRecord();
		var	values = form.getValues(false, false, true, true);
		var store  = Ext.data.StoreManager.lookup('Categories.CategoriesTree');
		var tree   = Ext.ComponentQuery.query('treepanel[itemId=categoriesTree]')[0];

		store.suspendAutoSync();
		if(form.isValid()) {
			if (values.id !== undefined && values.id > 0){
				record.set(values);
				record.setDirty();
				store.sync();
			} else {
				var selected = tree.getSelectionModel().getSelection()[0];
				if (selected !== undefined) {
					values.parent_id = selected.raw.id;
				} else {
					values.parent_id = -1;
				}
				record = Ext.create('FR.model.Categories.Category');
				record.set(values);

				var c_store = Ext.data.StoreManager.lookup('Categories.Categories');
				c_store.load();
				c_store.add(record);
				c_store.sync();
			}

			tree.store.reload();
			tree.getSelectionModel().deselectAll();
			Ext.ComponentQuery.query('button[action=createCategoryAction]')[0].setDisabled(false);
			win.close();
		}
		store.resumeAutoSync();
	},

	updateButtonStates: function(view, record) {
		Ext.ComponentQuery.query('button[action=createCategoryAction]')[0].setDisabled(record.get('leaf'));
	}

});