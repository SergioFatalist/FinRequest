/**
 * Created by Serhii Mykhailovskyi on 27.06.14.
 */

Ext.define('FR.store.Rules.RightEntities', {
	extend: 'Ext.data.Store',
	model: 'FR.model.Rules.RuleEntity',
	autoLoad: true,
	proxy: {
		type: 'ajax',
		api: {
			read: 'settings/rules/entities'
		},
		reader: {
			type: 'json',
			root: 'entities'
		},
		listeners: {
			exception: function (proxy, response) {
				error(Ext.JSON.decode(response.responseText).message);
			}
		}

	}
});
