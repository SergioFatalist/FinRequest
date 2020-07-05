/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.model.Requests.RequestTemplate', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'dt_created', type: 'auto'},
		{name: 'company_id', type: 'int'},
		{name: 'request_type', type: 'int'},
		{name: 'net_id', type: 'int'},
		{name: 'point_id', type: 'int'},
		{name: 'point_status', type: 'int'},
		{name: 'dt_payment', type: 'auto'},
		{name: 'order_no', type: 'int'},
		{name: 'payment_type', type: 'int'},
		{name: 'budget_type', type: 'int'},
		{name: 'amount', type: 'float'},
		{name: 'p_l', type: 'int'},
		{name: 'category_id', type: 'int'},
		{name: 'status', type: 'int'},
		{name: 'contractor', type: 'int'},
		{name: 'allow_edit', type: 'boolean'},
		{name: 'allow_approve', type: 'boolean'},
		{name: 'requester', type: 'string'},
		{name: 'description'}
	]

});
