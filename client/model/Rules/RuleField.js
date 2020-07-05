/**
 * Created by Serhii Mykhailovskyi on 27.06.14.
 */

Ext.define('FR.model.Rules.RuleField', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'entity_id', type: 'int'},
		{name: 'name', type: 'string'},
		{name: 'sysname', type: 'string'},
		{name: 'mapped_to', type: 'string'},
		{name: 'mapped_fields', type: 'string'}
	]
});
