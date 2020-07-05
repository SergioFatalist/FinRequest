/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.store.Nets.NetsTree', {
	extend: 'Ext.data.TreeStore',
	model: 'FR.model.Nets.NetsTree',
	loadMask: true,
	autoSync: true,
	nodeParam: 'id',
	root: {
		draggable: false,
		text: 'ACLs',
		children: []
	},

	proxy: {
		type: 'ajax',
		api: {
			read: 'nets/nets/netstree',
			update: 'nets/nets/netstreeupdate'
		},
		actionMethods: {
			read   : 'POST',
			update : 'POST'
		},
		reader: {
			type: 'json',
			idProperty: 'id'
		},
		writer: {
			type: 'json',
			writeAllFields: true,
			encode: true,
			root: 'netacl'
		},
		listeners: {
			exception: function (proxy, response) {
				var text = Ext.JSON.decode(response.responseText);
				Ext.Msg.show({
					title: 'Ошибка',
					msg: text.message,
					icon: Ext.MessageBox.ERROR,
					buttons: Ext.MessageBox.OK
				});
			}
		}
	}

});
