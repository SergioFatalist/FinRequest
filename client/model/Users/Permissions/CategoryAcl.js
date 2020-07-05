/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.model.Users.Permissions.CategoryAcl', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'parent_id', type: 'int'},
		{name: 'name', type: 'string'},
		{name: 'leaf', type: 'bool'},
		{name: 'permit', type: 'bool'}
	]
});

