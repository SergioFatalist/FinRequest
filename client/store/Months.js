/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.store.Months',{
	extend: 'Ext.data.Store',
	paging : false,
	idProperty: 'code',
	fields: [
		{name: 'code', type: 'string'},
		{name: 'name', type: 'string'}
	],
	data: aMonths
});
