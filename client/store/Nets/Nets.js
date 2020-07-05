/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.store.Nets.Nets', {
	extend: 'Ext.data.Store',
	model: 'FR.model.Nets.Net',
	autoLoad: true,
	autoSync: true,
	proxy: {
		type: 'ajax',
		api: {
			create:     'nets/nets/create',
			read:       'nets/nets/list',
			update:     'nets/nets/update'
		},
		actionMethods: {
			create : 'POST',
			read   : 'POST',
			update : 'POST'
		},
		reader: {
			type: 'json',
			root: 'nets'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			encode: true,
			root: 'nets'
		},
		listeners: {
			exception: function (proxy, response) {
				var text = Ext.JSON.decode(response.responseText);
				error(text.message);
			}
		}

	}
});
