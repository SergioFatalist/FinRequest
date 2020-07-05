/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.view.Users.GroupEditWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.groupEditWindow',

	width: 380,
	modal: true,
	closable: true,
	maximizable: false,
	iconCls: 'users',
	layout: 'fit',
	forceFit: true,

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
					fieldLabel: 'Название',
					name: 'name',
					allowBlank: false
				}, {
					xtype: 'treepanel',
					itemId: 'groupAclsTree',
					rootVisible: false,
					useArrows: true,
					autoScroll: true,
					height: 200,
					store: 'Users.Permissions.GroupsAclTree',
					columns: [
						{
							header: 'Модуль/Функция',
							xtype: 'treecolumn',
							sortable: false,
							dataIndex: 'text',
							flex: 1
						}, {
							header: 'Доступ',
							xtype: 'leafcheckcolumn',
							sortable: false,
							dataIndex: 'permit',
							flex: 1
						}
					]
				}, {
					name: 'id',
					xtype: 'hidden'
				}
			]
		}
	],

	buttons: [{
		text: 'Сохранить',
		iconCls: 'save',
		action: 'saveGroupAction',
		scope: this
	}],

	initComponent: function() {
		this.callParent(arguments);
	}

});