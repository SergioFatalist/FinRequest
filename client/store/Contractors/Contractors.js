/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.store.Contractors.Contractors', {
	extend: 'Ext.data.Store',
	model: 'FR.model.Contractors.Contractor',
	autoLoad: true,
	autoSync: true,
	sorters: [{
		property: 'name',
		direction: 'ASC'
	}],
	proxy: {
		type: 'ajax',
		api: {
			create:  'contractors/contractors/create',
			read:    'contractors/contractors/adminlist',
			update:  'contractors/contractors/update'
		},
		actionMethods: {
			create : 'POST',
			read   : 'POST',
			update : 'POST'
		},
		reader: {
			type: 'json',
			root: 'contractors'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			encode: true,
			root: 'contractors'
		},
		listeners: {
			exception: function (proxy, response) {
				var text = Ext.JSON.decode(response.responseText);
				error(text.message);
			}
		}

	}
});
