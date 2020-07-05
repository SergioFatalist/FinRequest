/**
 * Created by Serhii Mykhailovskyi on 27.06.14.
 */

Ext.define('FR.model.Rules.Rule', {
	extend: 'Ext.data.Model',
	idProperty: 'id',
	fields: [
		{name: 'id', type: 'string'},
		{name: 'name', type: 'string'},
		{name: 'type', type: 'string'},
		{name: 'active', type: 'bool'},
		{name: 'stop', type: 'bool'},
		{name: 'leaf', type: 'bool'},
		{name: 'ordering', type: 'int'},

		// Condition fields
		{name: 'rule_id', type: 'int'},
		{name: 'left_entity_id', type: 'int'},
		{name: 'left_field_id', type: 'int'},
		{name: 'cond', type: 'string'},
		{name: 'right_entity_id', type: 'int'},
		{name: 'right_field_id', type: 'int'},
		{name: 'mapped_to', type: 'string'},
		{name: 'mapped_fields', type: 'string'},
		{name: 'value', type: 'string'},

		// Action fields
		{name: 'condition_id', type: 'int'},
		{name: 'action', type: 'string'},

		{name: 'expanded', type: 'boolean', defaultValue: true, persist: false}
	]
});
