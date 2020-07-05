/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.store.Requests.Statuses',{
	extend: 'Ext.data.Store',
	autoLoad: true,

	fields: [
		{name: 'id', type: 'int'},
		{name: 'name', type: 'string'}
	],

	proxy: {
		type: 'ajax',
		api: {
			read:    'requests/statuses/list'
		},
		actionMethods: {
			read   : 'POST'
		},
		reader: {
			type: 'json',
			root: 'statuseslist',
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
