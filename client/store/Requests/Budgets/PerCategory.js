/**
 * Created by Serhii Mykhailovskyi on 29.05.14.
 */

Ext.define('FR.store.Requests.Budgets.PerCategory',{
	extend: 'Ext.data.Store',
	model: 'FR.model.Requests.Budgets.PerCategory',
	idProperty: 'category_id',
	groupField: 'planned',
	groupDir: 'DESC',
	proxy: {
		type: 'ajax',
		api: {
			read: 'requests/budgets/percategory'
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
