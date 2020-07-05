/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.store.Users.Permissions.GroupsAclTree', {
	extend: 'Ext.data.TreeStore',
	model: 'FR.model.Users.Permissions.GroupAcl',
	loadMask: true,
	autoSync: true,
	nodeParam: 'id',
	root: {
		draggable: false,
		text: 'ACLs',
//		id: '-1',
		expanded: true,
		children: []
	},
	proxy: {
		type: 'ajax',
		api: {
			read: 'users/groups/acltree',
			update: 'users/groups/aclupdate'
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
			root: 'groupacl'
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
