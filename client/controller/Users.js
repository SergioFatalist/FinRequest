/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.controller.Users', {
	extend: 'Ext.app.Controller',

	stores: [
		'Users.Users',
		'Users.Groups',
		'Users.Permissions.CategoriesAclTree',
		'Users.Permissions.NetsAclTree',
		'Users.Permissions.GroupsAclTree',
		'Users.Permissions.UsersAclTree'
	],

	views: [
		'Users.UsersWindow',
		'Users.UserEditWindow',
		'Users.GroupEditWindow'
	],

	init: function() {
		this.control({
			'button[action=saveUserAction]': {
				click: this.saveUser
			},
			'button[action=saveAndCloseUserAction]': {
				click: this.saveUserAndClose
			},
			'button[action=saveGroupAction]': {
				click: this.saveGroup
			},
			'button[action=createUserAction]': {
				click: this.showUserCreateWindow
			},
			'grid[itemId=usersGrid]': {
				itemdblclick: this.showUserEditWindow
			},
			'grid[itemId=groupsGrid]': {
				itemdblclick: this.showGroupEditWindow
			},
			'field[name=level]': {
				change: this.updateRightsBySelectedLevel
			}
		})
	},

	showUserEditWindow: function(view, record) {
		var wnd = Ext.create('FR.view.Users.UserEditWindow', {title: 'Редактирование пользователя'});
		wnd.down('form').loadRecord(record);
		wnd.show();
	},

	showGroupEditWindow: function(view, record) {
		var wnd = Ext.create('FR.view.Users.GroupEditWindow', {title: 'Редактирование группы'}); //, group_id: record.get('id')
		var store = Ext.data.StoreManager.lookup('Users.Permissions.GroupsAclTree');
		store.proxy.setExtraParam('group_id', record.get('id'));
		store.load();

		wnd.down('form').loadRecord(record);
		wnd.show();
	},

	showUserCreateWindow: function() {
		var wnd = Ext.create('FR.view.Users.UserEditWindow', {title: 'Создание пользователя'});
		wnd.show();
	},

	saveUser: function(button) {
		var wnd    = button.up('window');
		var form   = wnd.down('form');
		var	record = form.getRecord();
		var	values = form.getValues(false, false, true, true);
		var store  = Ext.data.StoreManager.lookup('Users.Users');

		store.suspendAutoSync();
		if(form.isValid()) {
			var nova = false;
			if (values.id !== undefined && values.id > 0){
				record.set(values);
				record.setDirty();
			} else {
				record = Ext.create('FR.model.Users.User');
				record.set(values);
				record.setDirty();
				store.add(record);
				nova = true;
			}
			store.sync();
			if (nova) {
				form.loadRecord(record);
			}
		} else {
			Ext.Msg.alert('Ошибка!', "Form is invalid.");
			return false;
		}
		store.resumeAutoSync();
	},

	saveUserAndClose: function(button) {
		this.saveUser(button);
		button.up('window').close();
	},

	saveGroup: function(button) {
		var wnd    = button.up('window');
		var form   = wnd.down('form');
		var	record = form.getRecord();
		var	values = form.getValues(false, false, true, true);
		var store  = Ext.data.StoreManager.lookup('Users.Groups');

		if(form.isValid()) {
			if (values.id !== undefined && values.id > 0){
				record.set(values);
			} else {
				record = Ext.create('FR.model.Group');
				record.set(values);
				store.add(record);
			}

			store.sync({
				callback: function() {
					wnd.close();
					return true;
				},
				scope: this
			});

		} else {
			Ext.Msg.alert('Ошибка!', "Form is invalid.");
			return false;
		}
		wnd.close();
	},

	updateRightsBySelectedLevel: function(combo) {
	}

});
