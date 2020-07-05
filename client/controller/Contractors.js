/**
 * Created by Serhii Mykhailovskyi on 26.05.14.
 */

Ext.define('FR.controller.Contractors', {
	extend: 'Ext.app.Controller',

	stores: [
		'Contractors.Contractors'
	],

	views: [
		'Contractors.ContractorsWindow',
		'Contractors.ContractorEditWindow'
	],

	init: function() {
		this.control({
			'grid[itemId=contractorsGrid]': {
				itemdblclick: this.showContractorEditWindow
			},
			'button[action=createContractorAction]': {
				click: this.showContractorCreateWindow
			},
			'button[action=saveContractorAction]': {
				click: this.saveContractor
			}
		})
	},

	showContractorEditWindow: function(view, record) {
		var wnd = Ext.create('FR.view.Contractors.ContractorEditWindow', {title: 'Редактирование контрагента'});
		wnd.down('form').loadRecord(record);
		wnd.show();
	},

	showContractorCreateWindow: function() {
		Ext.create('FR.view.Contractors.ContractorEditWindow', {title: 'Создание контрагента'}).show();
	},

	saveContractor: function(button) {
		var win    = button.up('window');
		var form   = win.down('form');
		var	record = form.getRecord();
		var	values = form.getValues(false, false, true, true);
		var store  = Ext.getStore('Contractors.Contractors');

		store.suspendAutoSync();
		if(form.isValid()) {
			if (values.id !== undefined && values.id > 0){
				record.set(values);
			} else {
				record = Ext.create('FR.model.Contractors.Contractor');
				record.set(values);
				store.add(record);
			}

			store.sync();
			win.close();
		}
		store.resumeAutoSync();
	}


});