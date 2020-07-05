/**
 * Created by Serhii Mykhailovskyi on 06.07.14.
 */

Ext.define('FR.store.Rules.Actions',{
	extend: 'Ext.data.Store',
	fields: [
		{name: 'id', type: 'string'},
		{name: 'name', type: 'string'}
	],
	data: [
		{id: 'set', name: 'Присвоить'},
		{id: 'inc', name: 'Увеличить'},
		{id: 'dec', name: 'Уменьшить'}
	]
});
