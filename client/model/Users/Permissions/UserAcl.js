/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.model.Users.Permissions.UserAcl', {
	extend: 'Ext.data.Model',
	idProperty: 'id',
	fields: [
		{name: 'ga_id', type: 'int'},
		{name: 'ga_permit', type: 'bool'},
		{name: 'action_id', type: 'int'},
		{name: 'id', type: 'string'},
		{name: 'text', type: 'string'},
		{name: 'leaf', type: 'bool'},
		{name: 'permit', type: 'bool'}
	]
});
