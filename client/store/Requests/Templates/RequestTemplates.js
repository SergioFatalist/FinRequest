/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.store.Requests.Templates.RequestTemplates',{
	extend: 'Ext.data.Store',
	model: 'FR.model.Requests.RequestTemplate',
	autoLoad: false,
	autoSync: false,
	proxy: {
		type: 'ajax',
		api: {
			read:       'requests/templates/list',
			create:     'requests/templates/create',
			destroy:    'requests/templates/delete'
		},
		actionMethods: {
			create : 'POST',
			read   : 'POST',
			destroy: 'POST'
		},
		reader: {
			type: 'json',
			root: 'templates',
			totalProperty: 'total'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			encode: true,
			root: 'templates'
		},
		listeners: {
			exception: function (proxy, response, operation, eOpts) {
				var text = Ext.JSON.decode(response.responseText);
				error(text.message);
			}
		}
	}
});
