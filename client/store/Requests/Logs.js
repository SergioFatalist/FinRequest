/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.store.Requests.Logs',{
	extend: 'Ext.data.Store',
	model: 'FR.model.Requests.Log',
	autoLoad: false,
	autoSync: false,

	proxy: {
		type: 'ajax',
		api: {
			read:    'requests/logs/list'
		},
		actionMethods: {
			read   : 'POST'
		},
		reader: {
			type: 'json',
			root: 'requestlogs',
			totalProperty: 'total'
		},
		listeners: {
			exception: function (proxy, response) {
				var text = Ext.JSON.decode(response.responseText);
				error(text.message);
			}
		}

	}
});
