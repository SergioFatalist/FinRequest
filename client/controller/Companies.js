/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.controller.Companies', {
	extend: 'Ext.app.Controller',

	stores: [
		'Companies.Companies'
	],

	views: [
		'Companies.CompaniesWindow',
		'Companies.CompanyEditWindow'
	],

	init: function() {
		this.control({
			'grid[itemId=companiesGrid]': {
				itemdblclick: this.showCompanyEditWindow
			},
			'button[action=createCompanyAction]': {
				click: this.showCompanyCreateWindow
			},
			'button[action=saveCompanyAction]': {
				click: this.saveCompany
			}
		})
	},

	showCompanyEditWindow: function(view, record) {
		var wnd = Ext.create('FR.view.Companies.CompanyEditWindow', {title: 'Редактирование юр.лица'});
		wnd.down('form').loadRecord(record);
		wnd.show();
	},

	showCompanyCreateWindow: function() {
		Ext.create('FR.view.Companies.CompanyEditWindow', {title: 'Создание юр.лица'}).show();
	},

	saveCompany: function(button) {
		var win    = button.up('window');
		var form   = win.down('form');
		var	record = form.getRecord();
		var	values = form.getValues(false, false, true, true);
		var store  = Ext.data.StoreManager.lookup('Companies.Companies');

		store.suspendAutoSync();
		if(form.isValid()) {

			if (values.id !== undefined && values.id > 0){
				record.set(values);
			} else {
				record = Ext.create('FR.model.Companies.Company');
				record.set(values);
				store.add(record);
			}

			store.sync();
			win.close();
		}
		store.resumeAutoSync();
	}


});