/**
 * Created by Serhii Mykhailovskyi on 07.06.14.
 */

Ext.Loader.setConfig({
	enabled: true,
	disableCaching: true,
	paths: {
		FR: 'client'
	}
});

Ext.application({
	name: 'FR',
	requires: ['Ext.container.Viewport'],
	appFolder: 'client',
	controllers: ['FR.controller.Auth'],

	launch: function() {
		Ext.create('Ext.container.Viewport', {
			layout: 'border',
			defaults: {
				border: false
			},

			items: [{
				xtype: 'box',
				region: 'center',
				collapsible: false,
				id: 'content',
				style: 'background: transparent;'
			}]
		});
	}
});