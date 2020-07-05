/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.model.Nets.Net', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'name', type: 'string'},
		{name: 'curator_id', type: 'int'},
		{name: 'chief_operating_officer_id', type: 'int'},
		{name: 'active', type: 'boolean'},
		{name: 'projects', type: 'boolean'}
	]
});
