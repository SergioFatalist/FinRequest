/**
 * Created by Serhii Mykhailovskyi on 27.05.14.
 */

Ext.define('FR.view.Requests.RequestEditWindow', {
	extend: 'Ext.window.Window',
	width: 700,
	modal: true,
	closable: true,
	maximizable: false,
	iconCls: 'requests',
	layout: 'fit',
	constrain: true,
	renderTo: 'content',
	closeAction: 'hide',
	fieldsparam: '',

	items: [{
		xtype: 'form',
		defaultType: 'textfield',
		bodyPadding: '5 5',
		border: false,
		defaults: {
			labelAlign: 'left',
			//labelWidth: 80,
			anchor: '0'
		},
		items: [
			{
				xtype:'fieldcontainer',
				columnWidth: '100%',
				border: false,
				collapsible: false,
				layout: 'hbox',
				defaults: {
					padding: '0 2'
				},
				items :[{
					fieldLabel: "Статья P&L",
					xtype: 'combo',
					width: '50%',
					readOnly: true,
					matchFieldWidth: false,
					allowBlank: false,
					name: 'category_id',
					editable: true,
					forceSelection: true,
					emptyText: 'Укажите статью P&L...',
					typeAhead: true,
					triggerAction: 'all',
					queryMode: 'local',
					store: 'Categories.Categories',
					valueField: 'id',
					displayField: 'name',
					lastQuery: '',
					listeners: {
						select: function(combo) {
							var sub_combo = combo.up('form').down('[name=p_l]');
							var store = sub_combo.store;
							sub_combo.clearValue();
							sub_combo.enable();
							if (store.isFiltered) {
								store.clearFilter();
							}
							store.filter('parent_id', new RegExp("^" + combo.value + "$"));

						}
					}
				}, {
					xtype: 'combo',
					fieldLabel: "Подстатья P&L",
					width: '50%',
					readOnly: true,
					matchFieldWidth: false,
					disabled: true,
					allowBlank: false,
					name: 'p_l',
					editable: false,
					forceSelection: true,
					emptyText: 'Укажите подстатью P&L...',
					typeAhead: true,
					triggerAction: 'all',
					queryMode: 'local',
					store: 'Categories.SubCategories',
					valueField: 'id',
					displayField: 'name',
					lastQuery: '',
					listeners: {
						select: function(combo) {
							var sub_combo = combo.up('form').down('[name=pointsGridEditor]');
							sub_combo.enable();
						}
					}
				}]
			}, {
				xtype:'fieldcontainer',
				columnWidth: '100%',
				border: false,
				collapsible: false,
				layout: 'hbox',
				defaults: {
					padding: '0 2'
				},
				items :[{
					xtype: 'combo',
					fieldLabel: "Юр.лицо",
					width: '50%',
					readOnly: true,
					matchFieldWidth: false,
					allowBlank: false,
					name: 'company_id',
					editable: false,
					forceSelection: true,
					emptyText: 'Выберите юр. лицо...',
					typeAhead: true,
					triggerAction: 'all',
					queryMode: 'local',
					store: 'Companies.Companies',
					valueField: 'id',
					displayField: 'name',
					lastQuery: ''
				}, {
					fieldLabel: "Контрагент",
					xtype: 'combo',
					width: '50%',
					readOnly: true,
					allowBlank: false,
					name: 'contractor',
					editable: true,
					forceSelection: true,
					emptyText: 'Укажите контрагента...',
					typeAhead: true,
					triggerAction: 'all',
					queryMode: 'local',
					store: 'Contractors.Contractors',
					valueField: 'id',
					displayField: 'name',
					lastQuery: ''
				}]
			}, {
				xtype:'fieldcontainer',
				columnWidth: '100%',
				border: false,
				collapsible: false,
				layout: 'hbox',
				defaults: {
					padding: '0 2'
				},
				items :[{
					xtype: 'textfield',
					fieldLabel: "№ счета",
					width: '50%',
					readOnly: true,
					allowBlank: true,
					name: 'order_no'
				}, {
					xtype: 'numberfield',
					fieldLabel: "Сумма",
					width: '50%',
					readOnly: true,
					allowBlank: false,
					name: 'amount',
					align: 'right',
					allowNegative: false,
					enableKeyEvents: true,
					decimalSeparator: '.',
					plugins: Ext.create('plugin.numberinputfilter')
				}]
			}, {
				xtype: 'pointsGridEditor',
				name: 'pointsGridEditor',
				disabled: true
			}, {
				fieldLabel: "Назначение платежа",
				readOnly: true,
				allowBlank: false,
				margin: '5px 0 0 0',
				name: 'description',
				xtype: 'textarea'
			}, {
				fieldLabel: "Дата оплаты",
				itemId: 'paymentInfo',
				xtype: 'datefield',
				format: 'Y-m-d',
				altFormats: 'Y-m-d H:i:s|Y-m-d',
				readOnly: true,
				allowBlank: true,
				name: 'dt_payment'
			}, {
				xtype:'fieldcontainer',
				itemId: 'extraInfo',
				columnWidth: '100%',
				border: false,
				collapsible: false,
				layout: 'hbox',
				defaults: {
					padding: '0 2'
				},
				items :[{
					fieldLabel: "Дата создания:",
					xtype: 'datedisplay',
					width: '50%',
					name: 'dt_created',
					allowBlank: true
				}, {
					fieldLabel: "Автор:",
					xtype: 'displayfield',
					width: '50%',
					readOnly: true,
					allowBlank: true,
					name: 'requester'
				}]
			}, {
				xtype:'fieldcontainer',
				itemId: 'adminInfo',
				columnWidth: '100%',
				border: false,
				collapsible: false,
				layout: 'hbox',
				defaults: {
					padding: '0 2'
				},
				items :[{
					fieldLabel: "Статус:",
					xtype: 'combo',
					width: '50%',
					allowBlank: true,
					name: 'status',
					editable: false,
					forceSelection: true,
					emptyText: 'Укажите статус...',
					typeAhead: true,
					triggerAction: 'all',
					queryMode: 'local',
					store: 'Requests.Statuses',
					valueField: 'id',
					displayField: 'name',
					lastQuery: ''
				},{
					text: 'Просмотр лога заявки',
					xtype: 'button',
					width: '50%',
					scale: 'small',
					padding: '2px',
					iconCls: 'asterisk',
					action: 'showRequestLogAction'

				}]
			}, {
				name: 'status',
				xtype: 'hidden'
			}, {
				name: 'id',
				xtype: 'hidden'
			}, {
				name: 'store',
				xtype: 'hidden'
			}
		],

		buttons: [
			{
				text: 'Сохранить',
				iconCls: 'save',
				action: 'saveRequestAction',
				scope: this
			}, {
				text: 'Очистить',
				action: 'clearRequestAction',
				scope: this
			}, {
				text: 'Подтвердить',
				action: 'approveRequestAction',
				scope: this
			}, {
				text: 'Отклонить',
				action: 'declineRequestAction',
				scope: this
			}, {
				text: 'Сохранить шаблон',
				iconCls: 'save',
				action: 'saveRequestAsTemplateAction',
				scope: this
			}
		]

	}],

	initComponent: function() {
		this.callParent(arguments);

		if (this.fieldsparam == 'create') {
			this.down('[itemId=paymentInfo]').setVisible(false);
			this.down('[itemId=extraInfo]').setVisible(false);
			this.down('[itemId=adminInfo]').setVisible(false);
		}
	},

	listeners: {
		close: function() {
			Ext.getStore('Nets.Nets').clearFilter();
			Ext.getStore('Nets.Points').clearFilter();
			Ext.getStore('Categories.Categories').clearFilter();
			Ext.getStore('Categories.SubCategories').clearFilter();
		}
	}

});
