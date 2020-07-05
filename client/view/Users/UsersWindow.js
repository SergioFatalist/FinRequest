/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.view.Users.UsersWindow', {
	extend: 'Ext.window.Window',

	title: 'Пользователи',
	iconCls: 'users',
	closable: true,
	maximizable: true,
	modal: false,
	width: 900,
	height: 400,
	layout: 'fit',
	constrain: true,
	renderTo: 'content',

	items: [
		{
			xtype: 'tabpanel',
			border: false,
			items: [
				{
					layout: 'fit',
					title: 'Пользователи',
					border: false,
					items: [
						{
							xtype: 'grid',
							itemId: 'usersGrid',
							store: 'Users.Users',
							border: false,
							forceFit: true,

							tbar: [{
								text: 'Добавить',
								iconCls: 'add',
								action: 'createUserAction'
							}],

							columns: [
								{
									text: 'ID',
									sortable: true,
									dataIndex: 'id',
									flex: 1
								}, {
									text: 'Логин',
									sortable: true,
									dataIndex: 'login',
									flex: 3
								}, {
									text: 'Ф.И.О.',
									sortable: true,
									dataIndex: 'name',
									flex: 3
								}, {
									text: 'Email',
									sortable: true,
									dataIndex: 'email',
									flex: 3
								}, {
									text: 'Группа',
									sortable: true,
									dataIndex: 'group_id',
									flex: 3,
									renderer: function(value, metaData, record) {
										var group = Ext.data.StoreManager.lookup('Users.Groups').getById(record.get('group_id'));
										return (group) ? group.get('name') : '';
									}
								}
							]
						}
					]
				}, {
					layout: 'fit',
					title: 'Группы',
					border: false,
					items: [
						{
							xtype: 'grid',
							store: 'Users.Groups',
							itemId: 'groupsGrid',
							border: false,
							forceFit: true,

							columns: [
								{
									text: 'ID',
									width:40,
									sortable: true,
									dataIndex: 'id'
								}, {
									text: 'Группа',
									width:280,
									sortable: true,
									dataIndex: 'name'
								}
							]
						}
					]
				}
			]
		}
	],

	initComponent: function() {
		this.callParent(arguments);
	}
});
