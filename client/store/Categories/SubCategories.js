/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.store.Categories.SubCategories', {
	extend: 'Ext.data.Store',
	model: 'FR.model.Categories.Category',
	autoLoad: true,
	autosync: false,
	proxy: {
		type: 'ajax',
		api: {
			read: 'categories/categories/sublist'
		},
		reader: {
			type: 'json',
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
