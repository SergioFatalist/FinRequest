/**
 * Created by sergio on 27.07.14.
 */

Ext.define('FR.controller.Templates', {
	extend: 'Ext.app.Controller',

	stores: [
		'Requests.Points.RequestPoints',
		'Requests.Templates.RequestTemplates',
		'Requests.Templates.RequestTemplatePoints'
	],

	views: [
		'Requests.RequestsWindow',
		'Requests.RequestEditWindow',
		'Requests.TemplatesGrid'
	],

	init: function() {
		this.control({
			'button[action=saveRequestAsTemplateAction]': {
				click: this.saveRequestAsTemplate
			},
			'grid[itemId=requestTemplatesGrid]': {
				itemclick: this.selectTemplate
			},
			'button[action=deleteTemplateAction]': {
				click: this.deleteTemplate
			}
		});
	},


	saveRequestAsTemplate: function(button) {
		var wnd = button.up('window');
		var form = wnd.down('form');
		var grid = button.up('grid');
		var t_store = Ext.getStore('Requests.Templates.RequestTemplates');
		var rp_store = Ext.getStore('Requests.Points.RequestPoints');

		t_store.load();
		var values = form.getForm().getValues(false, false, true, true);
		var record = Ext.create('FR.model.Requests.RequestTemplate',{
			request_type: values.request_type,
			category_id: values.category_id,
			p_l: values.p_l,
			company_id: values.company_id,
			order_no: values.order_no,
			contractor: values.contractor,
			amount: values.amount,
			description: values.description
		});
		t_store.add(record);

		var points_data = [];
		rp_store.each(
			function(r) {
				points_data.push(r.data);
			}
		);

		t_store.proxy.setExtraParam('points', Ext.JSON.encode(points_data));
		t_store.sync({
			scope: this,
			callback: function() {
				wnd.close();
			}
		});
	},

	selectTemplate: function() {
		//Ext.ComponentQuery.query('button[action=createRequestFromTemplateAction]')[0].enable();
		Ext.ComponentQuery.query('button[action=deleteTemplateAction]')[0].enable();
	},

	deleteTemplate: function(button) {
		var grid = button.up('grid');
		var store = grid.store;
		var record = grid.getSelectionModel().getSelection()[0];
		store.remove(record);
		store.sync();
	}

});
