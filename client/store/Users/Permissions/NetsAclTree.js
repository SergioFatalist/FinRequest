/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.store.Users.Permissions.NetsAclTree', {
	extend: 'Ext.data.TreeStore',
	model: 'FR.model.Users.Permissions.NetAcl',
	loadMask: true,
	autoSync: false,
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
			read: 'users/users/netstree',
			update: 'users/users/netsupdate'
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
			root: 'netacl'
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
