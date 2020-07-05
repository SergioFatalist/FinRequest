/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.model.Users.User', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'login', type: 'string'},
		{name: 'password', type: 'string'},
		{name: 'email', type: 'string'},
		{name: 'name', type: 'string'},
		{name: 'master_id', type: 'int'},
		{name: 'group_id', type: 'int'},
		{name: 'active', type: 'boolean'}
	]
});
