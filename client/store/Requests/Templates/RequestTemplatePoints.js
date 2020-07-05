/**
 * Created by Serhii Mykhailovskyi on 27.05.14.
 */

Ext.define('FR.store.Requests.Templates.RequestTemplatePoints',{
	extend: 'Ext.data.Store',
	model: 'FR.model.Requests.RequestTemplatePoint',
	autoLoad: false,
	autosync: false,
	proxy: {
		type: 'ajax',
		api: {
			read:       'requests/templates/points'
		},
		actionMethods: {
			create : 'POST'
		},
		reader: {
			type: 'json',
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
