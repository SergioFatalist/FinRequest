/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.controller.Requests', {
	extend: 'Ext.app.Controller',

	stores: [
		'Requests.Requests',
		'Requests.MyRequests',
		'Requests.Points.RequestPoints',
		'Contractors.Contractors',
		'Nets.Nets',
		'Nets.Points',
		'Nets.NetsTree',
		'Requests.Budgets.PerCategory',
		'Requests.Budgets.PerNetwork',
		'Requests.Budgets.PerProject',
		'Requests.Templates.RequestTemplates',
		'Requests.Templates.RequestTemplatePoints'
	],

	views: [
		'Requests.RequestsWindow',
		'Requests.RequestsGrid',
		'Requests.RequestEditWindow',
		'Requests.TemplatesGrid',
		'Requests.Budgets.PerCategoryGrid',
		'Requests.Budgets.PerNetworkGrid',
		'Requests.Budgets.PerProjectGrid',
		'Requests.Request.PointsGridEditor',
		'Nets.NetsPointsTreeWindow'
	],

	refs: [
		{
			ref: 'requestEditWindow',
			selector: 'requestEditWindow'
		}, {
			ref: 'requestsWindow',
			selector: 'requestsWindow'
		}, {
			ref: 'pointsGridEditor',
			selector: 'pointsGridEditor'
		}, {
			ref: 'requestTemplatesGrid',
			selector: 'requestTemplatesGrid'
		}, {
			ref: 'budgetsPerCategoryGrid',
			selector: 'budgetsPerCategoryGrid'
		}, {
			ref: 'budgetsPerNetworkGrid',
			selector: 'budgetsPerNetworkGrid'
		}
	],

	init: function() {

		this.control({
			'tabpanel [itemId=requestsGridTab]': {
				activate: this.activateTab
			},
			'tabpanel [itemId=myrequestsGridTab]': {
				activate: this.activateTab
			},
			'tabpanel [itemId=requestTemplatesGridTab]': {
				activate: this.activateTab
			},
			'button[action=doRequestsFiltersAction]': {
				click: this.doRequestsFilters
			},
			'button[action=clearRequestsFiltersAction]': {
				click: this.clearRequestsFilters
			},
			'button[action=showRequestCreateWindowAction]': {
				click: this.showRequestCreateWindow
			},
			'grid[itemId=requestsGrid]': {
				itemclick: this.showRequestEditWindow
			},
			'grid[itemId=myrequestsGrid]': {
				itemclick: this.showRequestEditWindow
			},
			'button[action=approveSelectedRequestsAction]': {
				click: this.approveSelectedRequests
			},
			'button[action=declineSelectedRequestsAction]': {
				click: this.declineSelectedRequests
			},
			'grid[itemId=requestTemplatesGrid]': {
				select: this.createRequestFromTemplate
			},
			'button[action=doExportAction]': {
				click: this.doExport
			},
			'button[action=doExtendedExportAction]': {
				click: this.doExtendedExport
			},
			'button[action=addPointsToRequestAction]': {
				click: this.addPointsToRequest
			}
		})
	},

	activateTab: function(tab) {
		var store = tab.down('grid').store;
		store.load();
	},

	doRequestsFilters: function(button) {
		var grid = button.up('grid');
		var store = grid.store;
		var status = grid.down('[filterName=filterStatus]').getValue(true);

		store.clearFilter();
		store.proxy.setExtraParam('startdate', Ext.Date.format(grid.down('[filterName=filterStartDate]').getValue(false), 'Y-m-d'));
		store.proxy.setExtraParam('enddate', Ext.Date.format(grid.down('[filterName=filterEndDate]').getValue(false), 'Y-m-d'));
		store.proxy.setExtraParam('status', grid.down('[filterName=filterStatus]').getValue(true));
		store.proxy.setExtraParam('category', grid.down('[filterName=filterCategory]').getValue(true));
		store.proxy.setExtraParam('contractor', grid.down('[filterName=filterContractor]').getValue(true));
		store.proxy.setExtraParam('network',  grid.down('[filterName=filterNetwork]').getValue(true));
		store.proxy.setExtraParam('point', grid.down('[filterName=filterPoint]').getValue(true));


		grid.down('button[action=approveSelectedRequestsAction]').setDisabled(!(status>0));
		grid.down('button[action=declineSelectedRequestsAction]').setDisabled(!(status>0));
		store.load();
	},

	clearRequestsFilters: function(button) {
		var grid = button.up('grid');
		var store = grid.store;
		store.clearFilter();

		store.proxy.setExtraParam('startdate', Ext.Date.format(dtStart, 'Y-m-d'));
		store.proxy.setExtraParam('enddate', Ext.Date.format(dtEnd, 'Y-m-d'));
		store.proxy.setExtraParam('status', null);
		store.proxy.setExtraParam('category', null);
		store.proxy.setExtraParam('contractor', null);
		store.proxy.setExtraParam('network', null);
		store.proxy.setExtraParam('point', null);

		grid.down('[filterName=filterStartDate]').setValue(Ext.Date.format(dtStart, 'Y-m-d'));
		grid.down('[filterName=filterEndDate]').setValue(Ext.Date.format(dtEnd, 'Y-m-d'));
		grid.down('[filterName=filterStatus]').clearValue();
		grid.down('[filterName=filterCategory]').clearValue();
		grid.down('[filterName=filterContractor]').clearValue();
		grid.down('[filterName=filterNetwork]').clearValue();
		grid.down('[filterName=filterPoint]').clearValue();

		grid.down('button[action=approveSelectedRequestsAction]').disable();
		grid.down('button[action=declineSelectedRequestsAction]').disable();

		store.load();
	},


	showRequestCreateWindow: function(button) {
		var wnd = Ext.create('FR.view.Requests.RequestEditWindow', {title: 'Создание заявки', fieldsparam: 'create'});

		wnd.down('pointsGridEditor').store.clearData();

		if (button) {
			wnd.down('field[name=store]').setValue(button.up('grid').store.storeId);
		} else {
			wnd.down('field[name=store]').setValue(Ext.getStore('Requests.MyRequests').storeId);
		}

		Ext.getStore('Nets.Nets').filter('active', 'true');

		wnd.down('field[name=category_id]').setReadOnly(false);
		wnd.down('field[name=p_l]').setReadOnly(false);
		wnd.down('field[name=company_id]').setReadOnly(false);
		wnd.down('field[name=order_no]').setReadOnly(false);
		wnd.down('field[name=contractor]').setReadOnly(false);
		wnd.down('field[name=amount]').setReadOnly(false);
		//wnd.down('button[action=addPointToRequestAction]').enable();
		wnd.down('field[name=description]').setReadOnly(false);

		wnd.down('button[action=saveRequestAction]').show();
		wnd.down('button[action=clearRequestAction]').hide();
		wnd.down('button[action=approveRequestAction]').hide();
		wnd.down('button[action=declineRequestAction]').hide();

		wnd.show();
		return wnd;
	},

	showRequestEditWindow: function(grid, record, item, index, ev) {
		var app = FR.getApplication();

		if (ev.getTarget('.x-grid-row-checker') != null) {
			return;
		} else {
			ev.stopEvent();

			var wnd = Ext.create('FR.view.Requests.RequestEditWindow', {title: 'Просмотр/редактирование заявки', fieldsparam: 'edit'});
			var p_grid = wnd.down('grid');

			wnd.down('field[name=p_l]').enable();
			wnd.down('form').loadRecord(record);
			wnd.down('form').getForm().findField('store').setValue(grid.store.storeId);
			wnd.down('pointsGridEditor').enable();

			Ext.getStore('Nets.Nets').clearFilter();
			Ext.getStore('Nets.Points').clearFilter();
			Ext.getStore('Categories.Categories').clearFilter();
			Ext.getStore('Categories.SubCategories').clearFilter();

			//if (record.get('request_type') == 1) {
			//	Ext.getStore('Nets.Nets').filter('projects', 'true');
			//	Ext.getStore('Nets.Nets').filter('active', 'true');
			//	Ext.getStore('Nets.Points').filter('project', 'true');
			//	Ext.getStore('Nets.Points').filter('active', 'true');
			//	Ext.getStore('Categories.Categories').filter('id', record.get('category_id'));
			//	Ext.getStore('Categories.SubCategories').filter('parent_id', record.get('category_id'));
			//}
			//
			var store = p_grid.store;
			store.proxy.setExtraParam('request_id', record.get('id'));
			store.proxy.setExtraParam('amount', record.get('amount'));
			store.load();

			wnd.down('button[action=clearRequestAction]').hide();
			wnd.down('button[action=approveRequestAction]').hide();
			wnd.down('button[action=declineRequestAction]').hide();

			var readonly = !record.get('allow_edit');
			wnd.down('button[action=saveRequestAction]').setDisabled(readonly);
			wnd.down('field[name=category_id]').setReadOnly(readonly);
			wnd.down('field[name=p_l]').setReadOnly(readonly);
			wnd.down('field[name=company_id]').setReadOnly(readonly);
			wnd.down('field[name=order_no]').setReadOnly(readonly);
			wnd.down('field[name=contractor]').setReadOnly(readonly);
			wnd.down('field[name=amount]').setReadOnly(readonly);
			wnd.down('field[name=description]').setReadOnly(readonly);
			wnd.down('[name=pointsGridEditor]').setDisabled(readonly);
			wnd.down('field[name=status]').setReadOnly(!app.principal.checkAccess('requests', 'admin'));

			if (record.get('allow_approve')) {
				wnd.down('button[action=approveRequestAction]').setText(record.get('status') == 6 ? 'Оплачено' : 'Утвердить');
				wnd.down('button[action=approveRequestAction]').show();
				if (record.get('status')  != 6) {
					wnd.down('button[action=declineRequestAction]').show();
				} else {
					wnd.down('button[action=declineRequestAction]').hide();
				}
			}

			if (app.principal.checkAccess('requests', 'update')) {
				wnd.down('field[name=dt_payment]').setReadOnly(false);
			}

			p_grid.store.load({
				scope: this,
				callback: function(records) {
					if (!records) {
						return;
					}
					var label = p_grid.down('label[itemId=pointslistTotalRest]');
					var pointsListRest = p_grid.up('form').getForm().findField('amount').getValue();
					if (pointsListRest.toString().trim() == "") {
						return true;
					}
					for (var i=0; i<records.length; i++) {
						pointsListRest -= records[i].get('amount');
					}
					pointsListRest = Math.round(pointsListRest * 100) / 100;

					label.setText('Не распределено: ' + Ext.util.Format.number(pointsListRest, '0,000.00') + ' грн');
				}
			});

			wnd.show();
			return wnd;
		}
	},

	approveSelectedRequests: function(button) {
		var grid = button.up('grid');
		var store = grid.store;
		var records = grid.getSelectionModel().getSelection();

		Ext.Ajax.request({
			url: 'requests/requests/nextstatus',
			params: {approving: 'approved', request_id: records[0].get('id')},
			scope: this,
			success: function (response, options) {
				var rdata = Ext.JSON.decode(response.responseText);
				if (!rdata.success) {
					error(rdata.message);
					return true;
				}

				var isPaidStatus = (rdata.next_status == 10 /* PAID */);

				if (isPaidStatus) {
					var promptedString = window.prompt('Введите дату оплаты (в формате ДД/ММ/ГГГГ): ');
					promptedString = promptedString.trim();

					if (promptedString.replace(/\d{2}\/\d{2}\/\d{4}/, '') != '') {
						error("Неправильный формат даты!\nЗаявки не переведены в статус оплачено!");
						return true;
					}

					var dt_payment = new Date(promptedString.substr(3, 2) + '/' + promptedString.substr(0, 2) + '/' + promptedString.substr(6, 4));
					if (Ext.Date.format(dt_payment, 'd/m/Y') != promptedString) {
						error("Такая дата не существует!\nЗаявки не переведены в статус оплачено!");
						return true;
					}
				}

				Ext.each(records, function (r, idx, arr) {
					var record = store.getById(r.data.id);
					record.set('status', rdata.next_status);
					if (isPaidStatus)
						record.set('dt_payment', dt_payment);
					record.setDirty();
				});
				store.sync();
				grid.getView().refresh();
			},
			failure: function (response, options) {
				if (response.status == 200) {
					error('Невозможно подтвердить заявку! ' + result.message);
					return true;
				}
				else {
					error('ВНИМАНИЕ! Сервер недоступен: ' + response.responseText);
					return true;
				}
			}
		});
	},

	declineSelectedRequests: function(button) {
		var grid = button.up('grid');
		var store = grid.store;
		var records = grid.getSelectionModel().getSelection();
		Ext.Ajax.request({
			url: 'requests/requests/nextstatus',
			params: {approving: 'declined', request_id: records[0].get('id')},
			scope: this,
			success: function (response, options) {
				var rdata = Ext.JSON.decode(response.responseText);
				if (!rdata.success) {
					error(rdata.message);
					return true;
				}
				Ext.each(records, function (r, idx, arr) {
					var record = this.store.getById(r.data.id);
					record.beginEdit();
					record.set('status', rdata.next_status);
					record.endEdit();
				});
				var promptedString = window.prompt('Причина отклонения: ');
				promptedString = promptedString.trim();

				store.proxy.setExtraParam('decline_comment', promptedString);
				store.sync();
			},
			failure: function (response, options) {
				if (response.status == 200) {
					error('Невозможно подтвердить заявку! ' + result.message);
					return true;
				}
				else {
					error('ВНИМАНИЕ! Сервер недоступен: ' + response.responseText);
					return true;
				}
			}
		});
		store.load();
		grid.getView().refresh();
	},

	createRequestFromTemplate: function(grid, record) {

		if (!record) {
			return false;
		}

		var wnd = this.showRequestCreateWindow();

		var form = wnd.down('form');

		wnd.down('[name=pointsGridEditor]').enable();
		form.getForm().findField('category_id').setValue(record.get('category_id'));
		form.getForm().findField('p_l').enable();
		form.getForm().findField('p_l').setValue(record.get('p_l'));
		form.getForm().findField('company_id').setValue(record.get('company_id'));
		form.getForm().findField('order_no').setValue(record.get('order_no'));
		form.getForm().findField('contractor').setValue(record.get('contractor'));
		form.getForm().findField('amount').setValue(record.get('amount'));
		form.getForm().findField('description').setValue(record.get('description'));

		Ext.getStore('Nets.Nets').clearFilter();
		Ext.getStore('Nets.Points').clearFilter();
		Ext.getStore('Categories.Categories').clearFilter();
		Ext.getStore('Categories.SubCategories').clearFilter();

		if (record.get('request_type') == 1) {
			Ext.getStore('Nets.Nets').filter('projects', 'true');
			Ext.getStore('Nets.Points').filter('project', 'true');
			Ext.getStore('Categories.Categories').filter('id', record.get('category_id'));
			Ext.getStore('Categories.SubCategories').filter('parent_id', record.get('category_id'));
		}

		var store = Ext.getStore('Requests.Templates.RequestTemplatePoints');
		store.clearData();
		store.proxy.setExtraParam('request_id', record.get('id'));
		store.load({
			scope: this,
			callback: function(records) {
				var p_store = Ext.getStore('Requests.Points.RequestPoints');
				for (var i=0; i < records.length; i++) {
					var new_point = Ext.create('FR.model.Requests.RequestPoint');
					new_point.set('net_id', records[i].get('net_id'));
					new_point.set('point_id', records[i].get('point_id'));
					new_point.set('point_status', records[i].get('point_status'));
					new_point.set('amount', records[i].get('amount'));
					p_store.insert(0, new_point);
				}
			}
		});

		wnd.down('button[action=clearRequestAction]').hide();
		wnd.down('button[action=approveRequestAction]').hide();
		wnd.down('button[action=declineRequestAction]').hide();
		wnd.down('button[action=saveRequestAsTemplateAction]').hide();
	},

	doExport: function(button) {
		var params = button.up('grid').store.proxy.extraParams;
		window.location.href = 'requests/export/simple?' + Ext.Object.toQueryString(params);
	},

	doExtendedExport: function(button) {
		var params = button.up('grid').store.proxy.extraParams;
		window.location.href = 'requests/export/extended?' + Ext.Object.toQueryString(params);
	},

	addPointsToRequest : function(button) {
		var me = this;
		var wnd = button.up('window');
		var treestore = wnd.down('treepanel').getStore();
		var root = treestore.getRootNode();
		me.addNode(root);
		wnd.close();
	},

	addNode: function(node) {
		console.log(node.data.id + '_' + node.data.name + '_' + node.data.sel);
		Ext.getStore('Nets.Points').clearFilter();
		var me = this;
		if (!node.isLeaf()) {
			node.eachChild(function(child){
				me.addNode(child);
			});
		} else {
			if (node.get('sel') == 1) {
				var p_store = Ext.getStore('Nets.Points');
				var rp_store = Ext.getStore('Requests.Points.RequestPoints');
				var split = node.get('id').split('-');
				var id = split[1];
                var point = p_store.findRecord('id', id, 0, false, false, true);
                var exist = false;
                rp_store.each(function(check) {
                    if (check.get('point_id') == point.get('id')) {
                        exist = true;
                    }
                });

                if (exist) {
                    return;
                }

				var new_point = Ext.create('FR.model.Requests.RequestPoint');
				new_point.set('net_id', point.get('net_id'));
				new_point.set('point_id', point.get('id'));
				new_point.set('point_status', point.get('point_status'));
				rp_store.insert(0, new_point);
			}
		}
	}

});
