/**
 * Created by Serhii Mykhailovskyi on 23.05.14.
 */

Ext.define('FR.controller.Settings', {
	extend: 'Ext.app.Controller',

	stores: [
		'Settings.Parameters',
		'Rules.LeftEntities',
		'Rules.LeftFields',
		'Rules.RightEntities',
		'Rules.RightFields',
		'Rules.RulesTree',
		'Rules.Conditions',
		'Rules.Actions',
		'Requests.Statuses',
		'Settings.Statuses',
		'Categories.Categories'
	],

	views: [
		'Settings.Rules.RuleEditWindow',
		'Settings.Rules.ConditionEditWindow'
	],

	init: function() {
		this.control({
			'menuitem[itemId=ruleAddButton]': {
				click: this.showRuleCreateWindow
			},
			'treepanel[itemId=rulesTreePanel]': {
				itemdblclick: this.showEditWindow
			},
			'button[action=saveRuleAction]': {
				click: this.saveRule
			},
			'button[itemId=deleteRuleItemButton]': {
				click: this.deleteRuleItem
			},
			'menuitem[itemId=conditionAddButton]': {
				click: this.showConditionCreateWindow
			},
			'menuitem[itemId=actionAddButton]': {
				click: this.showActionCreateWindow
			}
		})
	},

	showEditWindow: function(view, record) {
		var type = record.get('type');
		if (type == 'r') {
			this.showRuleEditWindow(view, record);
		} else if (type == 'c') {
			this.showConditionEditWindow(view, record);
		} else if (type == 'a') {
			this.showActionEditWindow(view, record);
		} else {
			showError('Неизвестный тип записи');
		}

	},

	showRuleCreateWindow: function() {
		var wnd = Ext.create('FR.view.Settings.Rules.RuleEditWindow', {title: 'Добавить правило'});
		wnd.show();
	},

	showRuleEditWindow: function(view, record) {
		var wnd = Ext.create('FR.view.Settings.Rules.RuleEditWindow', {title: 'Изменить правило'});
		wnd.down('form').loadRecord(record);
		wnd.show();
	},

	saveRule: function(button) {
		var wnd    = button.up('window');
		var form   = wnd.down('form');
		var	values = form.getValues(false, false, true, true);
		var t_store = Ext.data.StoreManager.lookup('Rules.RulesTree');
		var url = 'settings/rules/update';

		if(form.isValid()) {
			if (values.id == ''){
				url = 'settings/rules/create';
			}
		} else {
			Ext.Msg.alert('Ошибка!', "Form is invalid.");
			return false;
		}

		var data = Ext.JSON.encode(values);
		form.submit({
			url: url,
			params: {rules: data},
			success:function(form){
				form.reset();
				wnd.close();
				t_store.load();
			},
			failure: function(form, action) {
				switch (action.failureType) {
					case Ext.form.Action.CLIENT_INVALID:
						error('Возможно поля формы были заполнены неверно!' + action.result.message);
						break;
					case Ext.form.Action.CONNECT_FAILURE:
						error('Ошибка связи с сервером!' + action.result.message);
						break;
					case Ext.form.Action.SERVER_INVALID:
						error(action.result.message);
						t_store.load();
						break;
					default:
						error(action.result.message);
						t_store.load();
				}
			}
		});
	},

	deleteRuleItem: function(button) {
		var wnd = button.up('window');
		var tree = wnd.down('treepanel');
		var record = tree.getSelectionModel().getSelection()[0];
		var t_store = Ext.data.StoreManager.lookup('Rules.RulesTree');

		Ext.Ajax.request({
			url: 'settings/rules/delete',
			params: {
				id: record.get('id')
			},
			success: function(response){
				t_store.load();
				tree.getSelectionModel().deselectAll();

				//var addConditionButton = Ext.ComponentQuery.query('settingsWindow [itemId=conditionAddButton]')[0];
				//var addActionButton = Ext.ComponentQuery.query('settingsWindow [itemId=ruleActionAddButton]')[0];
				//var deleteButton = Ext.ComponentQuery.query('settingsWindow [itemId=deleteRuleItemButton]')[0];
				//addConditionButton.setDisabled(true);
				//addActionButton.setDisabled(true);
				//deleteButton.setDisabled(true);

				Ext.ComponentQuery.query('settingsWindow [itemId=conditionAddButton]')[0].setDisabled(true);
				Ext.ComponentQuery.query('settingsWindow [itemId=ruleActionAddButton]')[0].setDisabled(true);
				Ext.ComponentQuery.query('settingsWindow [itemId=deleteRuleItemButton]')[0].setDisabled(true);
			}
		});
	},

	showConditionCreateWindow: function(button) {
		var tree = button.up('window').down('treepanel');
		var record = tree.getSelectionModel().getSelection()[0];

		//var wnd = Ext.create('FR.view.Settings.Rules.ConditionEditWindow', {title: 'Добавить условие'});
		var wnd = this.createWindow('ConditionEditWindow', 'Добавить условие');
		var rule_id = record.get('id').split('-',2)[1];
		wnd.down('hidden[name=rule_id]').setValue(rule_id);
		wnd.show();
	},

	showConditionEditWindow: function(view, record) {
		//var wnd = Ext.create('FR.view.Settings.Rules.ConditionEditWindow', {title: 'Изменить условие'});
		var wnd = this.createWindow('ConditionEditWindow', 'Изменить условие');
		var form = wnd.down('form');
		form.loadRecord(record);
		wnd.show();
	},

	showActionEditWindow: function(view, record) {
		//var wnd = Ext.create('FR.view.Settings.Rules.ActionEditWindow', {title: 'Изменить действие'});
		var wnd = this.createWindow('ActionEditWindow', 'Изменить действие');
		var form = wnd.down('form');
		form.loadRecord(record);
		wnd.show();
	},

	showActionCreateWindow: function(button) {
		var tree = button.up('window').down('treepanel');
		var record = tree.getSelectionModel().getSelection()[0];

		//var wnd = Ext.create('FR.view.Settings.Rules.ActionEditWindow', {title: 'Добавить действие'});
		var wnd = this.createWindow('ActionEditWindow', 'Добавить действие');
		var condition_id = record.get('id').split('-',2)[1];
		wnd.down('hidden[name=condition_id]').setValue(condition_id);
		wnd.show();
	},

	createWindow: function(type, title) {
		return Ext.create('FR.view.Settings.Rules.' + type, {title: title});
	}

});
