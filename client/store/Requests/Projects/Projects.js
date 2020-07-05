/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.store.Requests.Projects.Projects', {
	extend: 'Ext.data.Store',
	model: 'FR.model.Nets.Point',
	autoLoad: true,
	autoSync: false,
	proxy: {
		type: 'ajax',
		api: {
			read:       'projects/projects/list'
		},
		reader: {
			type: 'json',
			root: 'projectslist',
			totalProperty: 'total'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			encode: true,
			root: 'projectslist'
		},
		listeners: {
			exception: function (proxy, response) {
				var text = Ext.JSON.decode(response.responseText);
				showError(text.message);
			}
		}
	}
});
