/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.model.Users.Permissions.NetAcl', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'string'},
		{name: 'name', type: 'string'},
		{name: 'leaf', type: 'bool'},
		{name: 'permit', type: 'bool'}
	]
});
