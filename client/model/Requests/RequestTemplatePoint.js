/**
 * Created by Serhii Mykhailovskyi on 28.05.14.
 */

Ext.define('FR.model.Requests.RequestTemplatePoint', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'net_id', type: 'int'},
		{name: 'point_id', type: 'int'},
		{name: 'point_status', type: 'int'},
		{name: 'amount', type: 'float'}
	]

});
