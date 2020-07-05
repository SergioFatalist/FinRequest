/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.store.Users.Groups', {
	extend: 'Ext.data.Store',
	model: 'FR.model.Users.Group',
	autoLoad: false,
	autoSync: true,
	proxy: {
		type: 'ajax',
		api: {
			read:    'users/groups/list',
			update:  'users/groups/update'
		},
		actionMethods: {
			read   : 'POST',
			update : 'POST'
		},
		reader: {
			type: 'json',
			root: 'groupslist'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			encode: true,
			root: 'groupslist'
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