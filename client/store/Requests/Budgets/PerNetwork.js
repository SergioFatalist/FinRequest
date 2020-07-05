/**
 * Created by Serhii Mykhailovskyi on 29.05.14.
 */

Ext.define('FR.store.Requests.Budgets.PerNetwork',{
	extend: 'Ext.data.Store',
	model: 'FR.model.Requests.Budgets.PerNetwork',
	idProperty: 'net_id',
	groupField: 'planned',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		api: {
			type: 'json',
			read: 'requests/budgets/pernetwork'
		},
		actionMethods: {
			read: 'POST'
		},
		reader: {
			type: 'json',
			root: 'budgets'
		},
		listeners: {
			exception: function (proxy, response, operation, eOpts) {
				var text = Ext.JSON.decode(response.responseText);
				error(text.message);
			}
		}
	}

});
