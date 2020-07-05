/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.controller.Nets', {
	extend: 'Ext.app.Controller',

	stores: [
		'Nets.Nets',
		'Nets.Points',
		'Users.Users'
	],

	views: [
		'Nets.NetsWindow',
		'Nets.PointEditWindow',
		'Nets.NetEditWindow',
		'Nets.ProjectEditWindow'
	],

	init: function() {
		this.control({
			'grid[itemId=netsGrid]':                    { render: this.clearStoreFilters, itemdblclick: this.showNetEditWindow },
			'button[action=createNetAction]':           { click: this.showNetCreateWindow },
			'button[action=saveNetAction]':             { click: this.saveNet },

			'grid[itemId=pointsGrid]':                  { render: this.clearStoreFilters, itemdblclick: this.showPointEditWindow },
			'button[action=savePointAction]':           { click: this.savePoint },
			'button[action=createPointAction]':         { click: this.showPointCreateWindow },

			'grid[itemId=projectsGrid]':                { render: this.clearStoreFilters, itemdblclick: this.showProjectEditWindow },
			'button[action=createProjectAction]':       { click: this.showProjecttCreateWindow },
			'button[action=saveProjectAction]':         { click: this.saveProject },
			'button[action=createProjectPointAction]':  { click: this.createProjectPoint }
		})
	},

	clearStoreFilters: function(grid) {
		grid.store.clearFilter();
	},

	showPointEditWindow: function(view, record) {
		var wnd = Ext.create('FR.view.Nets.PointEditWindow', {title: 'Редактирование точки'});
		wnd.down('form').loadRecord(record);
		wnd.show();
	},

	showPointCreateWindow: function() {
		Ext.create('FR.view.Nets.PointEditWindow', {title: 'Создание точки'}).show();
	},

	savePoint: function(button) {
		var win    = button.up('window');
		var form   = win.down('form');
		var	record = form.getRecord();
		var	values = form.getValues(false, false, true, true);
		var store  = Ext.data.StoreManager.lookup('Nets.Points');

		store.suspendAutoSync();
		if(form.isValid()) {
			if (values.id !== undefined && values.id > 0){
				record.set(values);
			} else {
				record = Ext.create('FR.model.Nets.Point');
				record.set(values);
				store.add(record);
			}
			store.sync();
			win.close();
		}
		store.resumeAutoSync();
	},

	showNetEditWindow: function(view, record) {
		var wnd = Ext.create('FR.view.Nets.NetEditWindow', {title: 'Редактирование сети'});
		wnd.down('form').loadRecord(record);
		wnd.show();
	},

	showNetCreateWindow: function() {
		 Ext.create('FR.view.Nets.NetEditWindow', {title: 'Создание сети'}).show();
	},

	saveNet: function(button, event) {
		var win    = button.up('window');
		var form   = win.down('form');
		var	record = form.getRecord();
		var	values = form.getValues(false, false, true, true);
		var store  = Ext.data.StoreManager.lookup('Nets.Nets');

		store.suspendAutoSync();
		if(form.isValid()) {
			if (values.id !== undefined && values.id > 0){
				record.set(values);
			} else {
				record = Ext.create('FR.model.Nets.Net');
				record.set(values);
				store.add(record);
			}

			store.sync();
			win.close();
		}
		store.resumeAutoSync();
	},

	showProjecttCreateWindow: function() {
		Ext.create('FR.view.Nets.ProjectEditWindow', {title: 'Создание проекта'}).show();
	},

	showProjectEditWindow: function(view, record) {
		var wnd = Ext.create('FR.view.Nets.ProjectEditWindow', {title: 'Редактирование проекта'});
		wnd.down('form').loadRecord(record);
		wnd.show();
	},

	saveProject:  function(button) {
		var win    = button.up('window');
		var form   = win.down('form');
		var	record = form.getRecord();
		var	values = form.getValues(false, false, true, true);
		var store  = Ext.data.StoreManager.lookup('Nets.Projects');

		store.suspendAutoSync();
		if(form.isValid()) {
			if (values.id !== undefined && values.id > 0){
				record.set(values);
			} else {
				record = Ext.create('FR.model.Nets.Project');
				record.set(values);
				store.add(record);
			}

			store.sync();
			win.close();
		}
		store.resumeAutoSync();
	},

	createProjectPoint: function(button) {
		var win    = button.up('window');
		var form   = win.down('form');
		var	record = form.getRecord();

		var store  = Ext.data.StoreManager.lookup('Nets.Points');

		win.close();

		win = Ext.create('FR.view.Nets.PointEditWindow', {title: 'Создание точки из проекта'});
		form = win.down('form');
		form.getForm().findField('name').setValue(record.get('name'));
		form.getForm().findField('city').setValue(record.get('city'));
		form.getForm().findField('address').setValue(record.get('address'));
		form.getForm().findField('phone').setValue(record.get('phone'));
		form.getForm().findField('active').setValue(record.get('active'));
		form.getForm().findField('project_id').setValue(record.get('id'));

		win.show();
	},

	listeners: {
		close: function() {
			Ext.getStore('Nets.Nets').clearFilter();
			Ext.getStore('Nets.Points').clearFilter();
			Ext.getStore('Categories.Categories').clearFilter();
			Ext.getStore('Categories.SubCategories').clearFilter();
		}
	}

});
