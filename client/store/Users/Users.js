/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.store.Users.Users', {
	extend: 'Ext.data.Store',
	model: 'FR.model.Users.User',
	autoLoad: true,
	autoSync: false,
	proxy: {
		type: 'ajax',
		api: {
			create:     'users/users/create',
			read:       'users/users/list',
			update:     'users/users/update'
		},
		actionMethods: {
			create : 'POST',
			read   : 'POST',
			update : 'POST'
		},
		reader: {
			type: 'json',
			root: 'userslist'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			encode: true,
			root: 'userslist'
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