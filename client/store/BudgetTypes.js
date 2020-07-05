/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.store.BudgetTypes',{
	extend: 'Ext.data.Store',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'name', type: 'string'}
	],
	data: [
		{id: 0, name: 'Текущий'},
		{id: 1, name: 'Следующий период'}
	]
});
