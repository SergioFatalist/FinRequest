/**
 * Created by Serhii Mykhailovskyi on 25.05.14.
 */

Ext.define('FR.view.Categories.CategoryEditWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.categoryEditWindow',

	width: 400,
	modal: true,
	closable: true,
	maximizable: false,
	iconCls: 'categories',
	layout: 'fit',
	forceFit: true,
	constrain: true,
	renderTo: 'content',

	items: [
		{
			xtype: 'form',
			border: false,
			defaultType: 'textfield',
			bodyPadding: '5 5',
			defaults: {
				labelAlign: 'left',
				labelWidth: 100,
				anchor: '0'
			},

			items: [
				{
					fieldLabel: 'Наименование',
					name: 'name',
					allowBlank: false,
					maxLength: 64,
					width: 300,
					tabIndex: 1
				}, {
					fieldLabel: 'Активная',
					xtype: 'checkbox',
					name: 'active',
					inputValue: 'true'
				}, {
					fieldLabel: 'Планируемая',
					xtype: 'checkbox',
					name: 'planned',
					inputValue: 'true'
				}, {
					fieldLabel: 'Инвестиционная',
					xtype: 'checkbox',
					name: 'investment',
					inputValue: 'true'
				}, {
					name: 'id',
					xtype: 'hidden'
				}, {
					name: 'parent_id',
					xtype: 'hidden'
				}
			],

			buttons: [{
				text: 'Сохранить',
				iconCls: 'save',
				action: 'saveCategoryAction'
			}]
		}
	],

	initComponent: function() {
		this.callParent(arguments);
	}
});
