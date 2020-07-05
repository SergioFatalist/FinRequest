/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.store.PaymentTypes',{
	extend: 'Ext.data.Store',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'name', type: 'string'}
	],
	data: [
		{id: 1, name: 'Наличная'},
		{id: 2, name: 'Безналичная'}
	]
});
