/**
 * Created by Serhii Mykhailovskyi on 14.07.14.
 */

Ext.define('FR.controller.Request', {
	extend: 'Ext.app.Controller',

	stores: [
		'Requests.Requests',
		'Requests.MyRequests',
		'Requests.Points.RequestPoints',
		'Requests.Logs',
		'Requests.Statuses',
		'Contractors.Contractors',
		'Categories.Categories',
		'Nets.Nets',
		'Nets.Points',
		'Users.Users',
		'Requests.Templates.RequestTemplates',
		'Requests.Templates.RequestTemplatePoints',
		'PaymentTypes'
	],

	views: [
		'Requests.RequestEditWindow',
		'Requests.RequestLogWindow',
		'Nets.NetsPointsTreeWindow'
	],

	init: function() {

		this.control({
			//'button[action=addPointToRequestAction]':       { click: this.addPointToRequest },
			'button[action=saveRequestAction]':             { click: this.saveRequest },
			'button[action=approveRequestAction]':          { click: this.approveRequest },
			'button[action=declineRequestAction]':          { click: this.declineRequest },
			'button[action=distributeByPointsAction]':      { click: this.distributeByPoints },
			'button[action=showRequestLogAction]':          { click: this.showRequestLog }
		})
	},

	//addPointToRequest: function(button) {
	//	var grid = button.up('window').down('grid');
	//
	//	var editor = grid.plugins[0];
	//	var amount = 0;
	//
	//	if(grid.store.getTotalCount() == 0) {
	//		amount = grid.up('form').getForm().findField('amount').getValue();
	//	}
	//	var record = Ext.create('FR.model.Requests.RequestPoint', {net_id: null, point_id: null, point_status: 2, amount: amount});
	//	record.setDirty();
	//	grid.store.add(record);
	//	editor.startEdit(record, 0);
	//},

	saveRequest: function(button) {
		this.processSaveRequest(button, false);
	},

	approveRequest: function(button) {
		this.processSaveRequest(button, 'approved');
	},

	declineRequest: function(button) {
		this.processSaveRequest(button, 'declined');
	},

	processSaveRequest: function(button, approving) {

		var wnd    = button.up('window');
		var form   = wnd.down('form');
		var	record = form.getRecord();
		var	values = form.getValues(false, false, true, true);
		var p_store = Ext.getStore('Requests.Points.RequestPoints');
		var store = Ext.getStore(values.store);

		var checksum = 0;
		var p_items = p_store.getRange();
		for (var i=0; i<p_items.length; i++) {
			var amount = Math.round(parseFloat(p_items[i].get('amount')) * 100) / 100;
			checksum += amount;
			checksum =  Math.round(parseFloat(checksum) * 100) / 100;
			if (p_items[i].get('amount') * 100 == 0) {
				p_store.remove(p_items[i]);
			}
		}
		if (form.getForm().findField('amount').getValue() != checksum) {
			error('Общая и распределенная суммы не совпадают!');
			return false;
		}

		if (form.isValid() && p_items.length>0) {
			var nova = false;
			if (values.id !== undefined && values.id > 0){
				record.set(values);
			} else {
				nova = true;
				record = Ext.create('FR.model.Requests.Request');
				record.set(values);
				record.set('dt_created', new Date());
			}
			record.setDirty();

			var points_data = [];
			p_store.each(
				function(r) {
					points_data.push(r.data);
				}, this
			);

			if (nova) {
				store.add(record);
			}

			if (approving == 'declined') {
				var promptedString = window.prompt('Причина отклонения: ');
				if (promptedString === null || promptedString === false) {
					return;
				}
				promptedString = promptedString.trim();
				store.proxy.setExtraParam('decline_comment', promptedString);
			}
			store.proxy.setExtraParam('approving', approving);
			store.proxy.setExtraParam('points', Ext.JSON.encode(points_data));
			store.sync({
				callback: function() {
					wnd.close();
				},
				scope: this
			});
		} else {
			error('Форма заполнена некорректно!');
		}
	},

	distributeByPoints: function(button) {
		var money = Ext.getStore('Settings.Parameters').findRecord('sysname', 'money').get('value');
		var grid = button.up('grid');
		var label = grid.down('label[itemId=pointslistTotalRest]');
		var store = grid.store;
		var editor = grid.plugins[0];
		var requestTotal = grid.up('form').down('field[name=amount]').getValue();
		var countOfPoints = store.getCount();
		if (countOfPoints == 0) {
			return true;
		}

		editor.cancelEdit();
		var pointAmount = Math.floor(requestTotal / countOfPoints * 100) / 100;
		var totalRest = Math.floor(requestTotal * 10000 - pointAmount * 10000 * countOfPoints) / 10000;
		store.each(
			function (point) {
				point.beginEdit();
				point.set('amount', pointAmount);
				if (totalRest > 0) {
					point.set('amount', pointAmount + totalRest);
					totalRest = 0;
				}
				point.endEdit();
				point.setDirty();
			}
		);
		label.setText('Не распределено: ' + Ext.util.Format.number(totalRest, '0,000.00') + ' ' + money);
	},

	showRequestLog: function(button) {
		var id = button.up('window').down('field[name=id]').getValue();

		var wnd = Ext.create('FR.view.Requests.RequestLogWindow', {title: 'Просмотр лога заявки ' + id});
		var app = FR.getApplication();

		if (!app.principal.checkAccess('requests', 'admin')) {
			wnd.down('[itemId=detailsColumn]').setVisible(false);
		}

		var store = Ext.data.StoreManager.lookup('Requests.Logs');
		store.proxy.setExtraParam('request_id', id);
		store.load();

		wnd.show();
	}
});
