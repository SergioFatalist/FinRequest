/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.model.Budgets.Budget', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'month', type: 'auto'},
		{name: 'target_id', type: 'int'},
		{name: 'categories', type: 'int'}
	]
});
