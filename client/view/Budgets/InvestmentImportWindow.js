/**
 * Created by Serhii Mykhailovskyi on 01.06.14.
 */

Ext.define('FR.view.Budgets.InvestmentImportWindow', {
	extend: 'Ext.window.Window',

	title: 'Импорт данных инвестиционного бюджета',
	width: 400,
	modal: true,
	closable: true,
	maximizable: false,
	iconCls: 'budgets',
	layout: 'fit',
	constrain: true,
	renderTo: 'content',

	items: [
		{
			xtype: 'form',
			bodyPadding: '5 5',
			defaultType: 'textfield',
			defaults: {
				labelAlign: 'left',
				labelWidth: 100,
				anchor: '0'
			},

			items: [
				{
					fieldLabel: 'Проект',
					xtype: 'combo',
					name: 'target_id',
					store: 'Nets.Points',
					displayField: 'name',
					valueField: 'id',
					editable: false,
					forceSelection: true,
					emptyText:'Выберите проект...',
					typeAhead: true,
					triggerAction: 'all',
					mode:'local',
					allowBlank: false,
					listeners: {
						render: function(combo) {
							combo.store.clearFilter();
							combo.store.filter('active', true);
							combo.store.filter('project', true);
							return combo;
						}
					}
				},{
					fieldLabel: 'Файл бюджета',
					xtype: 'filefield',
					name: 'budgetfile',
					emptyText: 'Укажите файл бюджета',
					buttonText: 'Найти...'
				}
			],

			buttons: [{
				text: 'Загрузить',
				iconCls: 'save',
				action: 'sendInvestmentBudgetAction'
			}]
		}
	],

	initComponent: function() {
		this.callParent(arguments);
	}

});