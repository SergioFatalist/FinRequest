/**
 * Created by Serhii Mykhailovskyi on 27.05.14.
 */

Ext.define('FR.form.DateDisplayField', {
	extend: 'Ext.form.field.Display',
	alias: ['widget.datedisplay', 'widget.datedisplayfield'],

	inputFormat: 'YYYY-MM-DD HH:mm:ss',
	outputFormat: 'YYYY-MM-DD HH:mm',

	valueToRaw: function(value) {
		return value ? moment(value, this.inputFormat).format(this.outputFormat) : '';
	}
});