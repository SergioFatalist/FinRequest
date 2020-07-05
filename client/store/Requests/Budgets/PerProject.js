/**
 * Created by Serhii Mykhailovskyi on 29.05.14.
 */

Ext.define('FR.store.Requests.Budgets.PerProject',{
	extend: 'Ext.data.Store',
	model: 'FR.model.Requests.Budgets.PerProject',
	idProperty: 'category_id',
	groupField: 'planned',
	proxy: {
		type: 'ajax',
		api: {
			read: 'requests/budgets/perproject'
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
