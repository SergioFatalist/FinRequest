/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.store.Settings.Statuses',{
	extend: 'Ext.data.Store',
	autoLoad: true,
	autoSync: false,

	fields: [
		{name: 'id', type: 'int'},
		{name: 'approve_name', type: 'string'},
		{name: 'decline_id', type: 'int'},
		{name: 'decline_name', type: 'string'},
		{name: 'ordering', type: 'int'}
	],

	proxy: {
		type: 'ajax',
		api: {
			read:   'settings/statuses/list',
			update: 'settings/statuses/update'
		},
		actionMethods: {
			read  : 'POST',
			update: 'POST'
		},
		reader: {
			type: 'json',
			root: 'statuses',
			totalProperty: 'total'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			encode: true,
			root: 'statuses'
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
