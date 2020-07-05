/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.store.Categories.Categories', {
	extend: 'Ext.data.Store',
	model: 'FR.model.Categories.Category',
	autoLoad: true,
	autoSync: false,
	proxy: {
		type: 'ajax',
		api: {
			create:     'categories/categories/create',
			read:       'categories/categories/list',
			update:     'categories/categories/update'
		},
		actionMethods: {
			create : 'POST',
			read   : 'POST',
			update : 'POST'
		},
		reader: {
			type: 'json',
			root: 'categories'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			encode: true,
			root: 'categories'
		},
		listeners: {
			exception: function (proxy, response) {
				var text = Ext.JSON.decode(response.responseText);
				error(text.message);
			}
		}
	}
});
