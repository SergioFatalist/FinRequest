/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.model.Requests.Budgets.PerCategory', {
	extend: 'Ext.data.Model',
	idProperty: 'id',

	fields: [
		{name: 'category_id', type: 'int'},
		{name: 'category_name', type: 'string'},
		{name: 'allowed', type: 'float'},
		{name: 'used', type: 'float'},
		{name: 'in_progress', type: 'float'},
		{name: 'rest', type: 'float'},
		{name: 'planned', type: 'bool'}
	]
});
