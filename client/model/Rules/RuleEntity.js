/**
 * Created by Serhii Mykhailovskyi on 27.06.14.
 */

Ext.define('FR.model.Rules.RuleEntity', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'name', type: 'string'},
		{name: 'sysname', type: 'string'},
		{name: 'is_left', type: 'bool'}
	]
});
