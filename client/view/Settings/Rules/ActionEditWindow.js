/**
 * Created by Serhii Mykhailovskyi on 06.07.14.
 */

Ext.define('FR.view.Settings.Rules.ActionEditWindow', {
	extend: 'Ext.window.Window',

	autoWidth: true,
	modal: true,
	closable: true,
	maximizable: false,
	iconCls: 'rule-action',
	layout: 'fit',
	forceFit: true,
	closeAction: 'destroy',
	constrain: true,
	renderTo: 'content',

	items:[{
		xtype: 'form',
		border: false,
		defaultType: 'textfield',
		bodyPadding: '5 0',
		defaults: {
			margin: '0 5',
			labelAlign: 'top',
			labelWidth: 100,
			anchor: '0'
		},
		layout: 'hbox',
		items:[
			{
				fieldLabel: 'Сущность',
				xtype: 'combo',
				name: 'left_entity_id',
				allowBlank: false,
				forceSelection: true,
				store: 'Rules.LeftEntities',
				valueField: 'id',
				displayField: 'name',
				queryMode: 'local',
				listeners: {
					render: function(combo) {
						combo.store.clearFilter();
						combo.store.filter('is_left', 'true');
						if (combo.getValue() !== null) {
							var lf_store = Ext.data.StoreManager.lookup('Rules.LeftFields');
							lf_store.clearFilter();
							lf_store.filter('entity_id', combo.getValue());
						}
					},
					select: function(combo) {
						var lf_store = Ext.data.StoreManager.lookup('Rules.LeftFields');
						lf_store.clearFilter();
						lf_store.filter('entity_id', combo.getValue());
					}
				}
			}, {
				fieldLabel: 'Поле',
				xtype: 'combo',
				name: 'left_field_id',
				allowBlank: false,
				forceSelection: false,
				store: 'Rules.LeftFields',
				valueField: 'id',
				displayField: 'name',
				hidden: false,
				listeners: {
					render: function(combo) {
						if (combo.getValue() !== null) {
							var record = combo.store.getById(combo.getValue());
							var mapped_to = record.get('mapped_to').trim();
							if (mapped_to.length != 0) {
								var right_entity_component = combo.up('form').down('[name=right_entity_id]');
								right_entity_component.store.clearFilter();
								right_entity_component.store.load();
								right_entity_component.store.filter('sysname', mapped_to);
								right_entity_component.setReadOnly(false);
							}
						}
					},
					select: function(combo) {
						var record = combo.store.getById(combo.getValue());
						var value_field = combo.up('form').down('[itemId=value_field]');
						var mapped_to = record.get('mapped_to').trim();
						if (mapped_to.length != 0) {
							var right_entity_component = combo.up('form').down('[name=right_entity_id]');
							right_entity_component.store.clearFilter();
							right_entity_component.store.filter('sysname', mapped_to);
							right_entity_component.setReadOnly(false);
						} else {
							value_field.setReadOnly(false);
						}
					}
				}
			}, {
				fieldLabel: 'Операция',
				xtype: 'combo',
				allowBlank: false,
				name: 'action',
				forceSelection: false,
				store: 'Rules.Actions',
				valueField: 'id',
				displayField: 'name',
				listeners: {
					select: function(combo) {
						if (combo.getValue() != 'set') {
							var right_entity_component = combo.up('form').down('[name=right_entity_id]');
							var right_field_component = combo.up('form').down('[name=right_field_id]');
							var value_component = combo.up('form').down('[name=value]');

							right_entity_component.setReadOnly(true);
							right_field_component.setReadOnly(true);
							value_component.setReadOnly(true);
						}
					}
				}
			}, {
				fieldLabel: 'Сущность',
				xtype: 'combo',
				allowBlank: true,
				name: 'right_entity_id',
				itemId: 'right_entity_id',
				store: 'Rules.RightEntities',
				forceSelection: true,
				valueField: 'id',
				displayField: 'name',
				queryMode: 'local',
				readOnly: true,
				listeners: {
					render: function(combo) {
						if (combo.getValue() !== null) {
							var record = combo.store.getById(combo.getValue());
							var right_field_component = combo.up('form').down('[name=right_field_id]');

							right_field_component.store.clearFilter();
							right_field_component.store.load();
							right_field_component.store.filter('entity_id', record.get('id'));
							right_field_component.setReadOnly(false);
						}
					},
					select: function(combo) {
						var record = combo.store.getById(combo.getValue());
						var right_field_component = combo.up('form').down('[name=right_field_id]');

						right_field_component.store.clearFilter();
						right_field_component.store.filter('entity_id', record.get('id'));
						right_field_component.setReadOnly(false);
					}
				}
			}, {
				fieldLabel: 'Поле',
				xtype: 'combo',
				allowBlank: true,
				name: 'right_field_id',
				store: 'Rules.RightFields',
				valueField: 'id',
				displayField: 'name',
				queryMode: 'local',
				readOnly: true,
				listeners: {
					render: function(combo) {
						if (combo.getValue() !== null && combo.getValue() !== 0) {
							var record = combo.store.getById(combo.getValue());
							var value_field = combo.up('form').down('[itemId=value_field]');
							var mapped_to = record.get('mapped_to').trim();
							if (mapped_to.length > 0) {
								var value_store_name = '';
								if (mapped_to == 'users') {
									value_store_name = 'Users.Users';
								} else if (mapped_to == 'groups') {
									value_store_name = 'Users.Groups';
								} else if (mapped_to == 'statuses') {
									value_store_name = 'Requests.Statuses'
								} else if (mapped_to == 'categories') {
									value_store_name = 'Categories.Categories'
								} else {
									return false;
								}

								var r = combo.up('form').getForm().getRecord();
								var store = Ext.data.StoreManager.lookup(value_store_name);
								store.load();
								value_field.setReadOnly(false);
								value_field.bindStore(store);
								value_field.setValue(parseInt(r.get('value')));
							}
						}
					},
					select: function(combo) {
						var record = combo.store.getById(combo.getValue());
						var value_field = combo.up('form').down('[itemId=value_field]');
						var mapped_to = record.get('mapped_to').trim();
						if (mapped_to.length > 0) {
							var value_store_name = '';
							if (mapped_to == 'users') {
								value_store_name = 'Users.Users';
							} else if (mapped_to == 'groups') {
								value_store_name = 'Users.Groups';
							} else if (mapped_to == 'statuses') {
								value_store_name = 'Requests.Statuses'
							} else if (mapped_to == 'categories') {
								value_store_name = 'Categories.Categories'
							} else {
								return false;
							}

							var store = Ext.data.StoreManager.lookup(value_store_name);
							store.load();
							value_field.setReadOnly(false);
							value_field.bindStore(store);
						}
					}
				}
			}, {
				fieldLabel: 'Значение',
				xtype: 'combo',
				allowBlank: true,
				name: 'value',
				itemId: 'value_field',
				forceSelection: false,
				store: '',
				valueField: 'id',
				displayField: 'name',
				matchFieldWidth: false,
				queryMode: 'local',
				readOnly: true
			}, {
				fieldLabel: 'Стоп',
				xtype: 'checkbox',
				name: 'stop',
				inputValue: 'true'
			}, {
				fieldLabel: 'Активное',
				xtype: 'checkbox',
				name: 'active',
				inputValue: 'true'
			}, {
				name: 'id',
				xtype: 'hidden'
			}, {
				name: 'condition_id',
				xtype: 'hidden'
			}, {
				name: 'type',
				xtype: 'hidden',
				value: 'a'
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
	},
	listeners: {
		close: function(panel) {

		}
	}

});