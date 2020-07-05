/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.store.Users.Permissions.UsersAclTree', {
	extend: 'Ext.data.TreeStore',
	model: 'FR.model.Users.Permissions.UserAcl',
	loadMask: true,
	autoSync: true,
	nodeParam: 'id',
	root: {
		draggable: false,
		text: 'ACLs',
//		id: '-1',
		children: []
	},
	proxy: {
		type: 'ajax',
		api: {
			read: 'users/users/acltree',
			update: 'users/users/aclupdate'
		},
		actionMethods: {
			read   : 'POST',
			update : 'POST'
		},
		reader: {
			type: 'json',
			idProperty: 'ga_id'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			encode: true,
			root: 'useracl'
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
