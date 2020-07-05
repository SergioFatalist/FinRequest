/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.model.Requests.Budgets.PerProject', {
	extend: 'Ext.data.Model',
	idProperty: 'id',

	fields: [
		{name: 'target_id', type: 'int'},
		{name: 'allowed', type: 'float'},
		{name: 'used', type: 'float'},
		{name: 'in_progress', type: 'float'},
		{name: 'rest', type: 'float'},
		{name: 'planned', type: 'bool'}
	]
});
