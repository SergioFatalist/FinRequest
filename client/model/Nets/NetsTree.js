/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.model.Nets.NetsTree', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'string'},
		{name: 'name', type: 'string'},
		{name: 'project', type: 'bool'},
		{name: 'leaf', type: 'bool'},
		{name: 'sel', type: 'bool'}
	]
});
