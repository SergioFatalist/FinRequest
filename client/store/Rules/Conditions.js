/**
 * Created by Serhii Mykhailovskyi on 06.07.14.
 */

Ext.define('FR.store.Rules.Conditions',{
	extend: 'Ext.data.Store',
	fields: [
		{name: 'name', type: 'string'}
	],
	data: [
		{name: '=='},
		{name: '!='},
		{name: '>'},
		{name: '<'},
		{name: '>='},
		{name: '<='}
	]
});
