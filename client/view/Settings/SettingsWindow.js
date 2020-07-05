/**
 * Created by Serhii Mykhailovskyi on 27.06.14.
 */


Ext.define('FR.view.Settings.SettingsWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.settingsWindow',

	title: 'Настройки',
	width: 800,
	closable: true,
	maximizable: false,
	iconCls: 'settings',
	layout: 'fit',
	forceFit: true,
	constrain: true,
	renderTo: 'content',

	items: [
		{
			xtype: 'tabpanel',
			frame: false,
			items: [
				{
					title: 'Общие параметры',
					layout: 'fit',
					border: false,
					items: [{
						xtype: 'grid',
						store: 'Settings.Parameters',
						border: false,
						forceFit: true,
						autoScroll: true,
						height: 400,
						margin: 0,
						plugins: [{
							ptype: 'cellediting'
						}],
						columns: [
							{
								text: "ID",
								sortable: true,
								dataIndex: 'id',
								align: 'right',
								flex: 1
							}, {
								text: "Параметр",
								sortable: true,
								dataIndex: 'name',
								flex: 4
							}, {
								text: "Значение",
								sortable: true,
								dataIndex: 'value',
								flex: 4,
								editor: {
									xtype: 'textfield',
									name: 'value',
									editable: true,
									allowBlank: true
								}
							}
						]
					}]
				}, {
					title: 'Порядок статусов',
					layout: 'fit',
					border: false,
					items: [{
						xtype: 'grid',
						store: 'Settings.Statuses',
						border: false,
						forceFit: true,
						autoScroll: true,
						height: 400,
						margin: 0,
						viewConfig: {
							plugins: [{
								ptype: 'gridviewdragdrop'
							}],
							listeners: {
								drop: function() {
									var i = 0;
									this.store.each(
										function(record) {
											record.set('ordering', i);
											i++;
											record.setDirty();
										},
										this
									);

									this.store.sync();
								}
							}
						},
						columns: [
							{
								text: "Утверждение",
								sortable: true,
								dataIndex: 'approve_name',
								flex: 4
							}, {
								text: "Отклонение",
								sortable: true,
								dataIndex: 'decline_name',
								flex: 4
							}
						]
					}]
				}, {
					title: 'Правила статусов',
					layout: 'fit',
					items: [{
						xtype: 'treepanel',
						itemId: 'rulesTreePanel',
						store: 'Rules.RulesTree',
						border: false,
						forceFit: true,
						rootVisible: false,
						autoScroll: true,
						useArrows: true,
						height: 400,
						margin: 0,
						viewConfig: {
							toggleOnDblClick: false,
							plugins: [{
								ptype: 'treeviewdragdrop'
							}],
							listeners: {
								beforedrop: function (node, data, target, dropPosition, dropHandlers) {
									var record = data.records[0];
									var dropOK = false;
									if (record.data.type == 'r' && target.data.type == 'r' && (dropPosition == 'before' || dropPosition == 'after')) {
										dropOK = true;
									} else if (record.data.type == 'c' && target.data.type == 'r' && dropPosition == 'append') {
										dropOK = true;
									} else if (record.data.type == 'c' && target.data.type == 'c' && (dropPosition == 'before' || dropPosition == 'after')) {
										dropOK = true;
									} else if (record.data.type == 'a' && target.data.type == 'c' && (dropPosition == 'append')) {
										dropOK = true;
									}

									if (dropOK) {
										dropHandlers.processDrop();
									} else {
										dropHandlers.cancelDrop();
									}
								},
								drop: function (node, data, target, dropPosition) {
									var store = Ext.getStore('Rules.RulesTree');
									store.suspendAutoSync();
									if (target.data.type == 'r' || target.data.type == 'c') {
										if (target.data.type == 'r' && (dropPosition == 'before' || dropPosition == 'after')) {
											for(var i=0; i<store.tree.root.childNodes.length; i++) {
												store.tree.root.childNodes[i].set('ordering', i);
												store.tree.root.childNodes[i].setDirty();
											}
										} else if (target.data.type == 'c' && (dropPosition == 'before' || dropPosition == 'after')) {
											var record = data.records[0];
											for(var i=0; i<record.parentNode.childNodes.length; i++) {
												record.parentNode.childNodes[i].set('ordering', i);
												record.parentNode.childNodes[i].setDirty();
											}
										} else {
											for(var i=0; i<target.childNodes.length; i++) {
												target.childNodes[i].set('ordering', i);
												target.childNodes[i].setDirty();
												var parent_id = target.internalId.substr(2);
												if (target.childNodes[i].data.type == 'c') {
													target.childNodes[i].data.rule_id = parent_id;
												} else if (target.childNodes[i].data.type == 'a') {
													target.childNodes[i].data.condition_id = parent_id;
												}
											}
										}
									}
									store.sync();
									store.resumeAutoSync();
								}
							}
						},
						tbar: [
							{
								text: 'Добавить',
								xtype: 'button',
								iconCls: 'add',
								menu:[
									{
										text: 'Правило',
										itemId: 'ruleAddButton',
										iconCls: 'rule'
									}, {
										text: 'Условие',
										itemId: 'conditionAddButton',
										iconCls: 'rule-condition',
										disabled: true
									}, {
										text: 'Действие',
										itemId: 'actionAddButton',
										iconCls: 'rule-action',
										disabled: true
									}
								]
							}, {
								text: 'Удалить',
								xtype: 'button',
								itemId: 'deleteRuleItemButton',
								iconCls: 'delete',
								disabled: true
							}
						],
						columns: [
							{
								text: 'Правила/Условия/Действия',
								xtype: 'treecolumn',
								sortable: false,
								dataIndex: 'name',
								flex: 6
							}, {
								text: 'Стоп',
								xtype: 'leafcheckcolumn',
								sortable: false,
								dataIndex: 'stop',
								flex: 1
							}, {
								text: 'Активное',
								xtype: 'checkcolumn',
								sortable: false,
								dataIndex: 'active',
								flex: 1
							}
						],

						listeners: {
							itemclick: function(view, record){
								var type = record.get('type');
								var addConditionButton = Ext.ComponentQuery.query('[itemId=conditionAddButton]')[0];
								var addActionButton = Ext.ComponentQuery.query('[itemId=actionAddButton]')[0];
								var deleteButton = Ext.ComponentQuery.query('[itemId=deleteRuleItemButton]')[0];

								if (type == 'r') {
									addConditionButton.setDisabled(false);
									addActionButton.setDisabled(true);
									deleteButton.setDisabled(false);
								} else if (type == 'c') {
									addConditionButton.setDisabled(true);
									addActionButton.setDisabled(false);
									deleteButton.setDisabled(false);
								} else {
									addConditionButton.setDisabled(true);
									addActionButton.setDisabled(true);
									deleteButton.setDisabled(true);
								}
							}
						}

					}]
				}
			]
		}
	],

	initComponent: function() {
		this.callParent(arguments);
	}
});