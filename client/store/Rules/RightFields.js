/**
 * Created by Serhii Mykhailovskyi on 27.06.14.
 */

Ext.define('FR.store.Rules.RightFields', {
	extend: 'Ext.data.Store',
	model: 'FR.model.Rules.RuleField',
	autoLoad: true,
	proxy: {
		type: 'ajax',
		api: {
			read: 'settings/rules/fields'
		},
		reader: {
			type: 'json',
			root: 'fields'
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
