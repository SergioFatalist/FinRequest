/**
 * Created by Serhii Mykhailovskyi on 02.07.14.
 */

Ext.define('FR.model.Settings.Parameter', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'name', type: 'string'},
		{name: 'sysname', type: 'string'},
		{name: 'value', type: 'string'},
		{name: 'comment', type: 'string'}
	]
});
