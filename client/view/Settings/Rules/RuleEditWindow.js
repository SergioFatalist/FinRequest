/**
 * Created by Serhii Mykhailovskyi on 06.07.14.
 */

Ext.define('FR.view.Settings.Rules.RuleEditWindow', {
	extend: 'Ext.window.Window',

	width: 300,
	modal: true,
	closable: true,
	maximizable: false,
	iconCls: 'rule',
	layout: 'fit',
	forceFit: true,
	constrain: true,
	renderTo: 'content',

	items:[{
		xtype: 'form',
		border: false,
		defaultType: 'textfield',
		bodyPadding: '5 5',
		defaults: {
			labelAlign: 'left',
			labelWidth: 100,
			anchor: '0'
		},

		items:[
			{
				fieldLabel: 'Название правила',
				name: 'name',
				allowBlank: false,
				maxLength: 32
			}, {
				fieldLabel: 'Правило активно',
				xtype: 'checkbox',
				name: 'active',
				inputValue: 'true'
			}, {
				name: 'id',
				xtype: 'hidden'
			}, {
				name: 'type',
				xtype: 'hidden',
				value: 'r'
			}
		],

		buttons: [{
				text: 'Сохранить',
				iconCls: 'save',
				action: 'saveRuleAction'
		}]
	}],

	initComponent: function() {
		this.callParent(arguments);
	}
});