/**
 * Created by Serhii Mykhailovskyi on 02.07.14.
 */

Ext.define('FR.model.Users.Principal', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'login', type: 'string'},
		{name: 'email', type: 'string'},
		{name: 'name', type: 'string'},
		{name: 'master_id', type: 'int'},
		{name: 'group_id', type: 'string'},
		{name: 'access', type: 'auto'}
	],
	proxy: {
		type: 'ajax',
		api: {
			read:    'auth/auth/principal'
		},
		actionMethods: {
			read   : 'POST'
		},
		reader: {
			type: 'json',
			root: 'principal'
		}
	},

	checkAccess: function(module, permission) {
		var perms = eval("this.get('access')." + module);
		if (perms != undefined) {
			return perms.indexOf(permission) >= 0;
		}
		return false;
	}
});
