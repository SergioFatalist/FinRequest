/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.store.Companies.Companies', {
	extend: 'Ext.data.Store',
	model: 'FR.model.Companies.Company',
	autoLoad: true,
	autoSync: true,
	proxy: {
		type: 'ajax',
		api: {
			read:       'companies/companies/list',
			create:     'companies/companies/create',
			update:     'companies/companies/update'
		},
		actionMethods: {
			create : 'POST',
			read   : 'POST',
			update : 'POST'
		},
		reader: {
			type: 'json',
			root: 'companieslist'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			encode: true,
			root: 'companieslist'
		},
		listeners: {
			exception: function (proxy, response) {
				var text = Ext.JSON.decode(response.responseText);
				error(text.message);
			}
		}
	}
});
