/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.store.Settings.Parameters', {
	extend: 'Ext.data.Store',
	model: 'FR.model.Settings.Parameter',
	autoLoad: true,
	autoSync: true,
	proxy: {
		type: 'ajax',
		api: {
			read:       'settings/parameters/list',
			update:     'settings/parameters/update'
		},
		actionMethods: {
			read   : 'POST',
			update : 'POST'
		},
		reader: {
			type: 'json',
			root: 'parameters'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			encode: true,
			root: 'parameters'
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