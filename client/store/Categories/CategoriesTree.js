/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.store.Categories.CategoriesTree', {
	extend: 'Ext.data.TreeStore',
	model: 'FR.model.Categories.Category',
	nodeParam: 'id',
	root: {
		draggable: false,
		id: '-1'
	},
	proxy: {
		type: 'ajax',
		api: {
			read:   'categories/categories/tree',
			update: 'categories/categories/update'
		},
		actionMethods: {
			read:   'POST',
			update: 'POST'
		},
		reader: {
			type: 'json',
			idProperty: 'id'
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
