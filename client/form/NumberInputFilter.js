/**
 * Created by sergio on 07.08.14.
 */

Ext.define('FR.form.NumberInputFilter', {
	alias: 'plugin.numberinputfilter',
	extend: 'Ext.AbstractPlugin',
	decimalSeparator: '.',

	constructor : function(cfg) {
		cfg = cfg || {};
		Ext.applyIf(cfg, {
			allowedDecimalSeparators : ',.'
		});
		Ext.apply(this, cfg);
	},
	init : function(field) {
		if (!(field && field.isXType('numberfield'))) {
			return;
		}
		Ext.apply(field, {
			allowedDecimalSeparators : this.allowedDecimalSeparators,
			checkValue : function(newChar) {
				var raw = this.getRawValue();
				var el = this.inputEl.dom;
				// функции взяты отсюда http://javascript.nwbox.com/cursor_position/
				// и подключены отдельным файлом cursor.js
				var start = getSelectionStart(el);
				var end = getSelectionEnd(el);
				if (start != end) {
					// удаляем выделенный текст из предполагаемого значения
					raw = raw.substring(0, start) + raw.substring(end);
				}
				if (Ext.isEmpty(raw)) {
					return (newChar == this.decimalSeparator || (this.minValue < 0) && newChar == '-') || /^\d$/.test(newChar);
				}
				if (raw.length == this.maxLength) {
					return false;
				}
				if (newChar == this.decimalSeparator && (!this.allowDecimals || raw.indexOf(this.decimalSeparator) != -1)) {
					return false;
				}
				// формируем предполагаемое значение
				raw = raw.substring(0, start) + newChar + raw.substring(start);
				raw = raw.split(new RegExp(Ext.String.escapeRegex(this.decimalSeparator)));
				return (!raw[0] || this.intRe.test(raw[0])) && (!raw[1] || this.decRe.test(raw[1]));
			},
			filterKeys : function(e){
				if (e.ctrlKey && !e.altKey) {
					return;
				}
				var key = e.getKey(),
					charCode = String.fromCharCode(e.getCharCode());

				if(Ext.isGecko && (e.isNavKeyPress() || key === e.BACKSPACE || (key === e.DELETE && e.button === -1))){
					return;
				}

				if(!Ext.isGecko && e.isSpecialKey() && !charCode){
					return;
				}
				// begin hack
				if (charCode != this.decimalSeparator && this.allowedDecimalSeparators.indexOf(charCode) != -1) {
					// если вводимый символ не десятичный разделитель,
					// но является одним из альтернативных,
					// заменяем его на десятичный разделитель
					charCode = this.decimalSeparator;
					if (Ext.isIE) {
						// в IE код нажатой клавиши можно подменить напрямую
						e.browserEvent.keyCode = charCode.charCodeAt(0);
					} else if (Ext.isGecko) {
						// для gecko-движка тормозим событие
						e.stopEvent();

						if (browserVersion().split('.')[0] < 12) {
							// создаем новое событие с измененным кодом нажатой клавиши
							var newEvent = document.createEvent('KeyEvents');
							// обязательно событие должно быть отменяемым,
							// т.к. оно может быть отменено, если десятичный
							// разделитель уже введен в поле
							newEvent.initKeyEvent(
								e.browserEvent.type,
								e.browserEvent.bubbles,
								true, //cancellable
								e.browserEvent.view,
								e.browserEvent.ctrlKey,
								e.browserEvent.altKey,
								e.browserEvent.shiftKey,
								e.browserEvent.metaKey,
								0, // keyCode
								charCode.charCodeAt(0) // charCode
							);
							e.getTarget().dispatchEvent(newEvent);
						} else if (this.checkValue(charCode)) {
							// http://forums.mozillazine.org/viewtopic.php?p=12198605&sid=3723622be9117f663d16d522fe03deb5#p12198605
							var tgt = e.getTarget();
							if ('selectionStart' in tgt) {
								if (tgt.selectionStart == tgt.textLength) {
									tgt.value += charCode;
								} else {
									var lastpos = tgt.selectionStart;
									tgt.value = tgt.value.substr(0, lastpos) + charCode + tgt.value.substr(lastpos);
									tgt.selectionStart = lastpos + 1;
									tgt.selectionEnd = lastpos + 1;
								}
							}
						}
						return;
					} else if (Ext.isWebKit) {
						// тормозим событие
						e.stopEvent();
						// в webkit initKeyboardEvent не работает, делаем через TextEvent
						if (this.checkValue(charCode)) {
							var newEvent = document.createEvent('TextEvent');
							newEvent.initTextEvent(
								'textInput',
								e.browserEvent.bubbles,
								true,
								e.browserEvent.view,
								charCode
							);
							e.getTarget().dispatchEvent(newEvent);
						}
						return;
					}
				}
				if (!this.checkValue(charCode)) {
					e.stopEvent();
				}
				// end hack
			},
			updateDecimalPrecision : function(prec, force) {
				if (prec == this.decimalPrecision && force !== true) {
					return;
				}
				if (!Ext.isNumber(prec) || prec < 1) {
					this.allowDecimals = false;
				} else {
					this.decimalPrecision = prec;
				}
				var intRe = '^';
				if (this.minValue < 0) {
					intRe +=  '-?';
				}
				intRe += '\\d' + (Ext.isNumber(this.integerPrecision) ? '{1,' + this.integerPrecision + '}' : '+') + '$';
				this.intRe = new RegExp(intRe);
				if (this.allowDecimals) {
					this.decRe = new RegExp('^\\d{1,' + this.decimalPrecision + '}$');
				} else {
					delete this.decRe;
				}
			},

			fixPrecision : function(value) {
				// support decimalSeparators
				if (Ext.isString(value)) {
					value = value.replace(new RegExp('[' + Ext.String.escapeRegex(this.allowedDecimalSeparators + this.decimalSeparator)  + ']'), '.');
				}
				// end hack
				var me = this,
					nan = isNaN(value),
					precision = me.decimalPrecision;
				if (nan || !value) {
					return nan ? '' : value;
				} else if (!me.allowDecimals || precision <= 0) {
					precision = 0;
				}
				return parseFloat(Ext.Number.toFixed(parseFloat(value), precision));
			}
		});
		field.updateDecimalPrecision(field.decimalPrecision, true);
	}
});