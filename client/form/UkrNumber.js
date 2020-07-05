/**
 * Created by Serhii Mykhailovskyi on 27.05.14.
 */

Ext.define('FR.form.UkrNumber', {
	extend: 'Ext.form.Number',
	alias: 'widget.ukrnumber',

	initComponent: function() {
		this.callParent(arguments);
	},

	processRawValue: function (value) {
//		var newValue = typeof value == 'number' ? value : String(value).replace(',', '.');
		var newValue = String(value).replace(',', '.');
		this.setRawValue(newValue);
		return newValue;
	},

	filterKeys: function (e) {
		// special keys don't generate charCodes, so leave them alone

		if (e.ctrlKey || e.isSpecialKey()) {
			return;
		}

//		if (String.fromCharCode(e.getCharCode()) != ',' || String.fromCharCode(e.getCharCode()) != '.') {
//			if (!this.maskRe.test(String.fromCharCode(e.getCharCode()))) {
//				e.stopEvent();
//			}
//		}
	}
});