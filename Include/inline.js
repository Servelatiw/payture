// Rambler.Kassa custom code
(function(window, document, undefined){
"use strict";

// helpers
var h = {
	addEvent: function(el, event, handler, useCapture) {
		if (el.addEventListener) {
			el.addEventListener(event, handler, useCapture || false); 
		} else if (el.attachEvent)  {
			el.attachEvent('on' + event, handler);
		}
	},
	idd: function(id) {
		return document.getElementById(id) || null;
	},
	clearFormat: function(s){
		return s.replace(/\s/g,'');
	},
	getValuesFormPay: function(key, card, mon, year, code, add, id){
		return ( card ? 
					("CardHolder=RAMBLER KASSA;CardNumber=" + card + ";EMonth=" + mon + ";EYear=" + year + ";SecureCode=" + code + ";Key=" + key + ";AddCard=" + add + ";CardId=FreePay"):
					("SecureCode=" + code + ";Key=" + key + ";AddCard=" + add + ";CardId=" + id)
				);
	},
	isNumberKey: function(e) {
		var key = e.keyCode || e.charCode || e.which;
		if ( e.ctrlKey || e.altKey || e.metaKey || (key < 47 && !e.charCode) ) return key;
		key = String.fromCharCode(key);
		return /\d/.test(key);
	},
	detectCardType: function(number) {
		var re = {
			maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)/,
			visa: /^4/,
			mastercard: /^5[1-5]/,
			mir: /^2/
		};
		number = number.replace(/\s/g, '');
		if (re.maestro.test(number)) {
			return 'MAESTRO';
		} else if (re.visa.test(number)) {
			return 'VISA';
		} else if (re.mastercard.test(number)) {
			return 'MASTERCARD';
		} else if (re.mir.test(number)) {
			return 'MIR';
		}
		 else {
			return undefined;
		}
	},
	returnInt: function(item) {
		return parseInt(item, 10);
	},
	addClass: function(el, style) {
		var re = new RegExp('\\b' + style + '\\b', 'gi');
		if (re.test(el.className)) return;
		el.className += ' ' + style;
	},
	removeClass: function(el, style) {
		var re = new RegExp('\\b' + style + '\\b', 'gi');
		el.className = el.className.replace(re, '');
	},
	placeholderSupport: function() {
		return ('placeholder' in document.createElement('input'));
	}
};
window.helpers = window.helpers || h;

////////////////////////////////////////////////////////////////


// variables
var body = document.getElementsByTagName('body')[0],
	dc = document,
	serverError = h.idd('serverError'),
	cardList = h.idd('CardSelectList'),
	keyInp = h.idd('Key'),
	saveInp = h.idd('AddCard'),
	cardInp = h.idd('CardNumber'),
	dateInp = h.idd('Date'),
	codeInp = h.idd("Code"),
	form = h.idd('payForm'),
	submitBtn = h.idd('submitButton'),
	cardTypes = h.idd('cardType'),

	errors = [],
	validForm = true,
	
	isFocus = "",
	focusedItem,
	payWithSavedCard,
	alreadySubmitted = false,
	fieldsArrayFree = [cardInp, dateInp, codeInp],
	fieldsArraySaved = [codeInp];


// events handlers
var eventHandlers = {
	focus: function(e) {
		h.removeClass(e.target, 'error');
	},
	keypress: function(e) {
		if (!h.isNumberKey(e)) e.preventDefault();
	},
	keyup: function(e) {
		var key = e.keyCode || e.charCode || e.which;

		if (!e.target.value) h.removeClass(e.target, 'hide_placeholder');
		else h.addClass(e.target, 'hide_placeholder');
		
		if (key == 13) {
			hideErrors();
			eventHandlers.submit(e);
		} else checkForm(true);

		return key;
	},
	blur: function(e) {
		if( !(validator["validate" + this.id] || validator.validate).call(this) ) h.addClass(this, 'error');
	},
	keyupCardNumber: function(e) {
		var key = eventHandlers.keyup(e);
		
		var value = this.value.replace(/\D/g, '').replace(/\s/g, '').replace(/(\d{4})/g, '$& ').replace(/\s\s/g, ' ').replace(/\s+$/g,'');
		if (value.lastIndexOf(' ') === 19) value = value.slice(0, 19) + value.slice(20);
		if (this.value !== value) this.value = value;
		
		var cardType = h.detectCardType(e.target.value);
		//if (cardType === 'MASTERCARD') setCheckbox(true);
		setCardType(cardType);
		
		checkForm(true);
	},
	keypressDate: function(e) {
		eventHandlers.keypress(e);
		var key = String.fromCharCode( e.keyCode || e.charCode || e.which );
		if (this.value.length === 0 && key > 1) this.value = '0';
	},
	keyupDate: function(e) {
		var value = '',
			key = eventHandlers.keyup(e);

		value = this.value.replace(/\//g, '').replace(/(\d{2})/g, '$&/').replace(/\/\//g, '/').slice(0,5);
		if (value.charAt(0) > 1) value = '0' + value.slice(1);
		if (this.value !== value) this.value = value;
		
		checkForm(true);
	},
	changeCard: function() {
		//console.log(this.value);
	},
	submit: function(e){
		if (!checkForm()) {
			showErrors();
			return false;
		}
		var key, number, month, year, code, dates, add, id;

		if (payWithSavedCard) {
			code = codeInp.value;
		} else {
			number = h.clearFormat(cardInp.value);
			dates = dateInp.value.split('/');
			month = dates[0];
			year = dates[1];
			code = codeInp.value;
		}

		key = keyInp.value;
		add = saveInp ? (saveInp.checked ? 'True' : '') : '';
		id = cardList ? (cardList.value || cardList.options[cardList.selectedIndex].value) : 'FreePay';

		e.preventDefault();
		e.stopPropagation();
		eventHandlers.messageSend('ValidFrame', null);
		virtualSubmit("PaySubmit", h.getValuesFormPay(key, number, month, year, code, add, id));
		return false;
	},
	messageRead: function(e) {
		if( (e.origin && e.origin.indexOf('kassa.rambler.ru') == -1)  || e.source != window.parent) return;
		var command = JSON.parse(e.data);
		if (command.name === 'submit') eventHandlers.submit(e);
	},
	messageSend: function(command, data) {
		var commandObj = {'name': command, 'data': data};
		//command = {'Name': commandObj, 'Args': data};
		if (window.parent.postMessage) {
			window.parent.postMessage(JSON.stringify(commandObj), '*');
		}
	}
};



// validator
var validator = {
	validate: function() {
		var maxLength = this.getAttribute('maxlength');
		if (this.value && (this.value.length == maxLength)) return true;
	},
	validateCardNumber: function(e) {
		if (this.value.replace(/\s/g, '').length >= 16) return true;
	},
	validateDate: function(e) {
		var date = new Date(),
			year = date.getFullYear() - 2000,
			month = date.getMonth() + 1,
			valid = true,
			dates = this.value.split('/').map(h.returnInt);

		if (isNaN(dates[0]) || isNaN(dates[1]) || dates[0] === 0 || dates[0] > 12 || (dates[0] < month && dates[1] === year)) valid = false;
		if (dates[1] < year) valid = false;
		return valid;
	}
};


// methods	
var virtualSubmit = function (action, data){
	if ( alreadySubmitted ) return false;

	var virtualForm = document.createElement("form");
		body.appendChild(virtualForm);
		virtualForm.method = "POST";	
		virtualForm.action = action;

	var dataElement = document.createElement("input");
		dataElement.type = 'hidden';
		dataElement.name = 'Data';
		dataElement.value = data;

	virtualForm.appendChild(dataElement);
	virtualForm.submit();
	alreadySubmitted = true;

	h.addClass(submitBtn, 'disabled');
	submitBtn.setAttribute('disabled', 'disabled');
},
checkPayType = function() {
	if (!cardList) {
		payWithSavedCard = false;
		return false;
	}
	payWithSavedCard = (cardList.value || cardList.options[cardList.selectedIndex].value) == "FreePay" ?  false : true;
	//payWithSavedCard = true;
	cardList.addEventListener('change', eventHandlers.changeCard, false);
},
showErrors = function(){
	for(var i=0,l=errors.length; i<l; i+=1) {
		h.addClass(errors[i], 'error');
	}
},
hideErrors = function(){
	for(var i=0,l=errors.length; i<l; i+=1) {
		h.removeClass(errors[i], 'error');
	}
	errors = [];
},
checkForm = function(e, hide) {
	var fields = payWithSavedCard ? fieldsArraySaved : fieldsArrayFree;

	if (hide) hideErrors();
	for (var i=0,l=fields.length; i<l; i+=1) {
		var id = fields[i].id;
		validForm = (validator["validate" + id] || validator.validate).call(fields[i]);
		if (!validForm) {
			errors.push(fields[i]);
			break;
		}
	}
	setButton();
	return validForm;
},
setButton = function() {
	if (validForm) {
		submitBtn.removeAttribute('disabled');
		submitBtn.disabled = false;
		h.removeClass(submitBtn, 'disabled');
	} else {
		if (!submitBtn.disabled) {
			submitBtn.setAttribute('disbled', 'disabled');
			submitBtn.disabled = true;
		}
		h.addClass(submitBtn, 'disabled');
	}
	eventHandlers.messageSend('ValidFrame', {"text": validForm});
},
checkServerError = function() {
	if ( serverError.innerHTML.length > 7) {
		serverError.style.display = "block";
		eventHandlers.messageSend('ErrorFrame', {"text": serverError.innerHTML});
		return true;
	}
},
setCheckbox = function(isChecked) {
	if(!!isChecked) saveInp.setAttribute('checked', 'checked');
	saveInp.checked = !!isChecked;
},
setCardType = function(cardType) {
	var cardTypeIcons = cardTypes.getElementsByTagName('i');
	if (!cardType) {
		for(var j=0,l=cardTypeIcons.length; j<l; j+=1) cardTypeIcons[j].style.display = 'inline-block';
		return;
	}
	for(var j=0,l=cardTypeIcons.length; j<l; j+=1) cardTypeIcons[j].style.display = 'none';
	if (cardType && h.idd(cardType)) h.idd(cardType).style.display = 'inline-block';
},
bindEvents = function() {
	for (var i=0, l=fieldsArrayFree.length; i<l; i+=1) {
		if (!fieldsArrayFree[i]) continue;
		var id = fieldsArrayFree[i].id;
		h.addEvent(fieldsArrayFree[i], 'focus', eventHandlers["focus" + id] || eventHandlers.focus);
		h.addEvent(fieldsArrayFree[i], 'keypress', eventHandlers["keypress" + id] || eventHandlers.keypress);
		h.addEvent(fieldsArrayFree[i], 'keyup', eventHandlers["keyup" + id] || eventHandlers.keyup);
		h.addEvent(fieldsArrayFree[i], 'blur', eventHandlers["blur" + id] || eventHandlers.blur);
	}
	//$("#CardSelectList").on('change', initCards);
	h.addEvent(form, 'submit', eventHandlers.submit);
	h.addEvent(window, 'message', eventHandlers.messageRead);
},
sendReadyMessage = function() {
	eventHandlers.messageSend('ReadyFrame', null);
},
checkPlaceholderSupport = function() {
	document.documentElement.className += (h.placeholderSupport() ? ' placeholder' : ' no-placeholder');
},
checkPlaceholders = function() {
	var fields = payWithSavedCard ? fieldsArraySaved : fieldsArrayFree;
	for (var i=0,l=fields.length; i<l; i+=1) if (fields[i].value.length) h.addClass(fields[i], 'hide_placeholder');
},
setTransitionReady = function() {
	document.documentElement.className += ' transition_ready';
},
initAddCard = function() {
	if (document.getElementById("AllowAddCard").value === "True")
	{
		document.getElementById("AddCard").checked = true;		
	}
	else
	{
		document.getElementById("AddCardBlock").style.display = "none";
	}
},
initSavedCardFields = function() {
	dc.getElementsByClassName('ps_title2')[0].innerHTML = 'Оплата сохранённой банковской картой';
	dc.getElementsByClassName('ps_data_text')[0].innerHTML = '';
	cardInp.value = cardList.options[cardList.selectedIndex] ? cardList.options[cardList.selectedIndex].text : 'xxxxxxxxxxxxxxxx';
	cardInp.disabled = true;
	var cardType = h.detectCardType(cardInp.value);
	setCardType(cardType);
	dateInp.value = "xx/xx";
	dateInp.disabled = true;
	codeInp.focus();
};



// go
(function init() {
	checkServerError();
	checkPlaceholderSupport();
	checkPayType();
	checkPlaceholders();
	bindEvents();
	sendReadyMessage();
	initAddCard();
	if (payWithSavedCard)
		initSavedCardFields();
	
	setTimeout(setTransitionReady, 0);
})();

})(window, window.document);