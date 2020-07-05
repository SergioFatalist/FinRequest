/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.model.Users.Permissions.GroupAcl', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'string'},
		{name: 'text', type: 'string'},
		{name: 'leaf', type: 'bool'},
		{name: 'permit', type: 'bool'}
	]
});
