/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.model.Nets.Point', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'net_id', type: 'int'},
		{name: 'project_id', type: 'int'},
		{name: 'active', type: 'boolean'},
		{name: 'project', type: 'boolean'},
		{name: 'name', type: 'string'},
		{name: 'city', type: 'string'},
		{name: 'address', type: 'string'},
		{name: 'phone', type: 'string'},
		{name: 'dt_created', type: 'auto'},
		{name: 'dt_finished', type: 'auto'},
		{name: 'finished', type: 'boolean'},
		{name: 'curator_id', type: 'int'}

	],
	validations: [
		{type: 'presence', field: 'name'},
		{type: 'presence', field: 'net_id'}
	]
});
