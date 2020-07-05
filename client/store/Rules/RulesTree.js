/**
 * Created by Serhii Mykhailovskyi on 27.06.14.
 */

Ext.define('FR.store.Rules.RulesTree', {
	extend: 'Ext.data.TreeStore',
	model: 'FR.model.Rules.Rule',
	loadMask: true,
	autoSync: true,
	nodeParam: 'id',
	root: {
		draggable: false,
		id: '-1',
		children: []
	},
	proxy: {
		type: 'ajax',
		api: {
			read: 'settings/rules/list',
			update: 'settings/rules/update'
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
			root: 'rules'
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
