/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.model.Requests.Log', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'request_id', type: 'int'},
		{name: 'dt', type: 'auto'},
		{name: 'user_id', type: 'int'},
		{name: 'status', type: 'int'},
		{name: 'comment', type: 'string'},
		{name: 'details', type: 'string'}
	]

});
