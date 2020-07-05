/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.store.Users.Permissions.CategoriesAclTree', {
	extend: 'Ext.data.TreeStore',
	model: 'FR.model.Users.Permissions.CategoryAcl',
	loadMask: true,
	autoSync: true,
	nodeParam: 'id',
	root: {
		draggable: false,
		text: 'ACLs',
		expanded: true,
//		id: '-1',
		children: []
	},
	proxy: {
		type: 'ajax',
		api: {
			read: 'users/users/categoriestree',
			update: 'users/users/categoriesupdate'
		},
		actionMethods: {
			read   : 'POST',
			update : 'POST'
		},
		reader: {
			type: 'json',
			idProperty: 'id'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			encode: true,
			root: 'categoryacl'
		},
		listeners: {
			exception: function (proxy, response) {
				var text = Ext.JSON.decode(response.responseText);
				Ext.Msg.show({
					title: 'Ошибка',
					msg: text.message,
					icon: Ext.MessageBox.ERROR,
					buttons: Ext.MessageBox.OK
				});
			}
		}
	}

});
