/**
 * Created by Serhii Mykhailovskyi on 28.05.14.
 */

Ext.define('FR.model.Requests.RequestPoint', {
	extend: 'Ext.data.Model',
	idProperty: 'id',

	fields: [
		{name: 'id', type: 'string'},
		{name: 'net_id', type: 'int'},
		{name: 'request_id', type: 'int'},
		{name: 'point_id', type: 'int'},
		{name: 'point_status', type: 'int'},
		{name: 'amount', type: 'float'}
	]
});
