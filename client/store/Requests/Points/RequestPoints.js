/**
 * Created by Serhii Mykhailovskyi on 27.05.14.
 */

Ext.define('FR.store.Requests.Points.RequestPoints',{
	extend: 'Ext.data.Store',
	model: 'FR.model.Requests.RequestPoint',
	autoLoad: false,
	autoSync: false,
	proxy: {
		type: 'ajax',
		api: {
			read:       '/requests/points/list'
		},
		actionMethods: {
			read   : 'POST'
		},
		reader: {
			type: 'json',
			root: 'requestspointslist'
		},
		listeners: {
			exception: function (proxy, response) {
				var text = Ext.JSON.decode(response.responseText);
				error(text.message);
			}
		}
	}
});
