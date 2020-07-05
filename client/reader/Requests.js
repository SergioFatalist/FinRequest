/**
 * Created by Serhii Mykhailovskyi on 13.07.14.
 */

Ext.define('FR.reader.Requests',{
	extend: 'Ext.data.reader.Json',
	alias: 'reader.requests',
	amount: 0,

	getResponseData : function(response) {
		var data = this.callParent([response]);

		var resp = Ext.JSON.decode(response.responseText);
		this.amount = resp.amount;

		return data;
	}

});