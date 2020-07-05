/**
 * Created by Serhii Mykhailovskyi on 29.05.14.
 */

Ext.define('FR.view.Requests.TemplatesGrid',{
	extend: 'Ext.grid.Panel',
	store: 'Requests.Templates.RequestTemplates',
	alias: 'widget.requestTemplatesGrid',
	forceFit: true,
	selModel: 'rowmodel',

	tbar: [
		{
		//	xtype: 'button',
		//	text: 'Создать заявку по шаблону',
		//	iconCls: 'add',
		//	disabled: true,
		//	scope: this,
		//	action: 'createRequestFromTemplateAction'
		//}, '-', {
			xtype: 'button',
			text: 'Удалить шаблон',
			iconCls: 'delete',
			disabled: true,
			scope: this,
			action: 'deleteTemplateAction'
		}
	],

	columns: [
		{
			header: "ID",
			width: 40,
			sortable: true,
			dataIndex: 'id'
		}, {
			header: "Дата создания",
			width: 160,
			sortable: true,
			dataIndex: 'dt_created',
			renderer: function (value) {
				if (!value) return '';
				var d = moment(value, "YYYY-MM-DD HH:mm:ss");
				return  d.year() < 2000 ? '' : d.format('DD.MM.YYYY HH:mm');
			}
		}, {
			header: "Назначение платежа",
			width: 600,
			sortable: true,
			dataIndex: 'description'
		}
	],

	listeners: {
		select: function(grid, record, index) {

		}
	},

	initComponent: function() {
		this.callParent(arguments);
	}

});

