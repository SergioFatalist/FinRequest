/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.model.Categories.Category', {
	extend: 'Ext.data.Model',
	idProperty: 'id',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'name', type: 'string'},
		{name: 'parent_id', type: 'int'},
		{name: 'active', type: 'boolean'},
		{name: 'planned', type: 'bool'},
		{name: 'investment', type: 'bool'}
	]
});
