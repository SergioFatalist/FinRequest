/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.view.Users.UserEditWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.userEditWindow',

	width: 600,
	modal: true,
	closable: true,
	maximizable: false,
	iconCls: 'users',
	layout: 'fit',
	forceFit: true,

	items:[{
		xtype: 'tabpanel',
		border: false,
		items: [
			{
				title: 'Общая информация',
				layout: 'fit',
				border: false,
				items: [{
					xtype: 'form',
					itemId: 'userForm',
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
							fieldLabel: 'Login',
							name: 'login',
							allowBlank: false,
							maxLength: 32
						}, {
							fieldLabel: 'Ф.И.О',
							name: 'name',
							allowBlank: false,
							maxLength: 128
						}, {
							fieldLabel: 'E-mail',
							name: 'email',
							allowBlank: false,
							vtype: 'email',
							maxLength: 128
						}, {
							fieldLabel: 'Пароль',
							name: 'password',
							allowBlank: true,
							inputType: 'password',
							maxLength: 32
						}, {
							fieldLabel: 'Руководитель',
							xtype: 'combo',
							editable: false,
							name: 'master_id',
							emptyText: 'Укажите руководителя...',
							forceSelection: true,
							typeAhead: true,
							triggerAction: 'all',
							mode: 'local',
							store: 'Users.Users',
							valueField: 'id',
							displayField: 'name',
							allowBlank: false
						}, {
							fieldLabel: 'Группа',
							xtype: 'combo',
							editable: false,
							name: 'group_id',
							emptyText: 'Укажите группу...',
							forceSelection: true,
							typeAhead: true,
							triggerAction: 'all',
							mode: 'local',
							store: 'Users.Groups',
							valueField: 'id',
							displayField: 'name',
							allowBlank: false
						}, {
							fieldLabel: 'Активный',
							name: 'active',
							xtype: 'checkbox',
							inputValue: 'true'
						}, {
							name: 'id',
							xtype: 'hidden'
						}
					]
				}]
			}, {
				title: 'Доступ к модулям',
				itemId: 'modulesAccessTab',
				layout: 'fit',
				border: false,
				items: [{
					xtype: 'treepanel',
					rootVisible: false,
					autoScroll: true,
					useArrows: true,
					border: false,
					height: 300,
					margin: 0,
					anchor: '0',
					store: 'Users.Permissions.UsersAclTree',
					columns: [
						{
							text: 'Модуль/Функция',
							xtype: 'treecolumn',
							sortable: false,
							dataIndex: 'text',
							flex: 3
						}, {
							text: 'Доступ',
							xtype: 'leafcheckcolumn',
							dataIndex: 'permit',
							sortable: false,
							flex: 1
						}
					]
				}],
				listeners: {
					beforeactivate: function() {
						var form = Ext.ComponentQuery.query('form[itemId=userForm]')[0];
						var id = parseInt(form.getForm().findField('id').getValue());
						var group_id = parseInt(form.getForm().findField('group_id').getValue());
						if (isNaN(id)) {
							warning('Сперва необхоимо сохранить общую информацию о пользователе на вкладке "Общая информация". Для этого нажмите кнопку "Сохранить".');
							return false;
						} else {
							var store = Ext.data.StoreManager.lookup('Users.Permissions.UsersAclTree');
							store.proxy.setExtraParam('user_id', form.getForm().getRecord().get('id'));
							store.proxy.setExtraParam('group_id', form.getForm().getRecord().get('group_id'));
							store.load();
						}
						return true;
					}
				}
			}, {
				title: 'Доступ к точкам',
				itemId: 'netsAccessTab',
				layout: 'fit',
				border: false,
				items: [{
					xtype: 'treepanel',
					rootVisible: false,
					autoScroll: true,
					useArrows: true,
					border: false,
					height: 300,
					margin: 0,
					anchor: '0',
					store: 'Users.Permissions.NetsAclTree',
					columns: [
						{
							text: 'Сеть/точка',
							xtype: 'treecolumn',
							sortable: false,
							dataIndex: 'name',
							flex: 3
						}, {
							text: 'Доступ',
							xtype: 'checkcolumn',
							dataIndex: 'permit',
							sortable: false,
							flex: 1,
							listeners: {
								checkchange: function(col, rowIndex, checked, eOpts) {
									var store = Ext.data.StoreManager.lookup('Users.Permissions.NetsAclTree');
									var recs = store.getModifiedRecords();
									for (var i=0; i<recs.length; i++) {
										if(recs[i].isLeaf()) {
											continue;
										} else {
											recs[i].eachChild(function (r){
												r.set('permit', checked);
												r.setDirty();
											})
										}
									}
									return true;
								}
							}

						}
					]

				}],
				listeners: {
					activate: function() {
						var form = Ext.ComponentQuery.query('form[itemId=userForm]')[0];
						var id = form.getForm().findField('id').getValue();
						if (isNaN(parseInt(id))) {
							warning('Сперва необхоимо сохранить общую информацию о пользователе на вкладке "Общая информация". Для этого нажмите кнопку "Сохранить".');
							return false;
						} else {
							var store = Ext.data.StoreManager.lookup('Users.Permissions.NetsAclTree');
							store.proxy.setExtraParam('user_id', form.getForm().getRecord().get('id'));
							store.load();
						}
						return true;
					}
				}
			}, {
				title: 'Доступ к категориям',
				itemId: 'categoriesAccessTab',
				layout: 'fit',
				border: false,
				items: [{
					xtype: 'treepanel',
					rootVisible: false,
					autoScroll: true,
					useArrows: true,
					border: false,
					height: 300,
					margin: 0,
					anchor: '0',
					store: 'Users.Permissions.CategoriesAclTree',
					viewConfig: {
						stateful: true,
						stateId: 'categoriesAccessTree',
						plugins: [ 'treestateful' ]
					},
					columns: [
						{
							text: 'Статья P&L/Категория',
							xtype: 'treecolumn',
							sortable: false,
							dataIndex: 'name',
							flex: 3
						}, {
							text: 'Доступ',
							xtype: 'checkcolumn',
							dataIndex: 'permit',
							sortable: false,
							flex: 1,
							listeners: {
								checkchange: function(col, rowIndex, checked) {
									var store = Ext.data.StoreManager.lookup('Users.Permissions.CategoriesAclTree');
									var recs = store.getModifiedRecords();
									for (var i=0; i<recs.length; i++) {
										if(recs[i].isLeaf()) {
											continue;
										} else {
											recs[i].eachChild(function (r){
												r.set('permit', checked);
												r.setDirty();
											})
										}
									}
									store.load();
									return true;
								}
							}

						}
					]

				}],
				listeners: {
					activate: function() {
						var form = Ext.ComponentQuery.query('form[itemId=userForm]')[0];
						var id = form.getForm().findField('id').getValue();
						if (isNaN(parseInt(id))) {
							warning('Сперва необхоимо сохранить общую информацию о пользователе на вкладке "Общая информация". Для этого нажмите кнопку "Сохранить".');
							return false;
						} else {
							var store = Ext.data.StoreManager.lookup('Users.Permissions.CategoriesAclTree');
							store.proxy.setExtraParam('user_id', form.getForm().getRecord().get('id'));
							store.load();
						}
						return true;
					}
				}
			}
		],

		buttons: [
			{
				text: 'Сохранить',
				iconCls: 'save',
				action: 'saveUserAction',
				scope: this
			}, {
				text: 'Сохранить и закрыть',
				iconCls: 'save',
				action: 'saveAndCloseUserAction',
				scope: this
			}
		]
	}],

	initComponent: function() {
		this.callParent(arguments);
	}

});
