/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.store.Nets.Points', {
	extend: 'Ext.data.Store',
	model: 'FR.model.Nets.Point',
	autoLoad: true,
	autoSync: true,
	proxy: {
		type: 'ajax',
		api: {
			create:     'nets/points/create',
			read:       'nets/points/list',
			update:     'nets/points/update'
		},
		actionMethods: {
			create : 'POST',
			read   : 'POST',
			update : 'POST'
		},
		reader: {
			type: 'json',
			root: 'points',
			totalProperty: 'total'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			encode: true,
			root: 'points'
		},
		listeners: {
			exception: function (proxy, response, operation, eOpts) {
				var text = Ext.JSON.decode(response.responseText);
				error(text.message);
			}
		}
	}
});
