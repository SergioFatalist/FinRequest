/**
 * Created by Serhii Mykhailovskyi on 27.05.14.
 */

Ext.define('FR.grid.LeafCheckColumn', {
	extend: 'Ext.grid.column.CheckColumn',
	alias: 'widget.leafcheckcolumn',
	stateIndex: '',
	parentIndex: '',

	processEvent: function(type, view, cell, recordIndex, cellIndex, e, record, row) {
		if (record.isLeaf()) {
			return this.callParent(arguments);
		}
		else {
			return FR.grid.LeafCheckColumn.superclass.superclass.processEvent.apply(this, arguments);
		}
	},

	renderer : function(value, meta, record) {
		if (record.isLeaf()) {
			return this.callParent(arguments);
		}
		return '';
	}

});