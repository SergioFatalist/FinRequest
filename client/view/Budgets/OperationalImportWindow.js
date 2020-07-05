/**
 * Created by Serhii Mykhailovskyi on 01.06.14.
 */

Ext.define('FR.view.Budgets.OperationalImportWindow', {
	extend: 'Ext.window.Window',

	title: 'Импорт данных операционного бюджета',
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
					fieldLabel: 'Сеть',
					xtype: 'combo',
					name: 'target_id',
					store: 'Nets.Nets',
					displayField: 'name',
					valueField: 'id',
					editable: false,
					forceSelection: true,
					emptyText:'Выберите сеть...',
					typeAhead: true,
					triggerAction: 'all',
					mode:'local',
					allowBlank: false,
					listeners: {
						render: function(combo) {
							combo.store.clearFilter();
							combo.store.filter('active', true);
							combo.store.filter('projects', false);
							return combo;
						}
					}
				},{
					fieldLabel: 'Период',
					xtype: 'combo',
					itemId: 'month',
					name: 'month',
					store: 'Months',
					displayField: 'name',
					valueField: 'code',
					editable: false,
					forceSelection: true,
					emptyText:'Выберите период действия бюджета...',
					typeAhead: true,
					triggerAction: 'all',
					mode:'local',
					allowBlank: false
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
				action: 'sendOperationalBudgetAction'
			}]
		}
	],

	initComponent: function() {
		this.callParent(arguments);
	}

});