/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.store.Requests.MyRequests',{
	extend: 'Ext.data.Store',
	model: 'FR.model.Requests.Request',
	pageSize: 25,
	autoLoad: false,
	autoSync: false,
	proxy: {
		type: 'ajax',
		api: {
			read:    'requests/requests/mylist',
			create:  'requests/requests/create',
			update:  'requests/requests/update'
		},
		actionMethods: {
			create : 'POST',
			read   : 'POST',
			update : 'POST'
		},
		reader: {
			type: 'requests',
			root: 'requests',
			totalProperty: 'total'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			encode: true,
			root: 'requests'
		},
		listeners: {
			exception: function (proxy, response, operation, eOpts) {
				var text = Ext.JSON.decode(response.responseText);
				error(text.message);
			}
		}
	}

});
