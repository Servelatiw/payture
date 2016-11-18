(function(window, document, undefined){
"use strict";	
	var alreadySubmitted = false,
		isNotApple = !isAppleFn();

	function isAppleFn() {
		if (navigator && navigator.userAgent && navigator.userAgent != null) {
			var strUserAgent = navigator.userAgent.toLowerCase();
			var arrMatches = strUserAgent.match(/(iphone|ipod|ipad)/);
			if (arrMatches) return true;
		}
		return false;
	}
	
	// event.type должен быть keypress
	function getChar(event) {
		if (event.which == null) {  // IE
			if (event.keyCode < 32) return null; // спец. символ
			return String.fromCharCode(event.keyCode) 
		} 
		if (event.which!=0 && event.charCode!=0) { // все кроме IE
			if (event.which < 32) return null; // спец. символ
			return String.fromCharCode(event.which); // остальные
		} 
		return null; // спец. символ
	}

	function GetValuesFormPay( formName ) {
		var form = document.getElementById( formName );
		return "CardHolder=RAMBLER KASSA;CardNumber=" + form.elements["number1"].value + form.elements["number2"].value + form.elements["number3"].value + form.elements["number4"].value + ";EMonth=" + form.elements["EMonth"].value + ";EYear=" + form.elements["EYear"].value + ";SecureCode=" + form.elements["SecureCode"].value + ";Key=" + form.elements["Key"].value + ";CardId=FreePay;AddCard=";
	}

	function Submit() {
		if ( !isValidForm() || alreadySubmitted ) {
			return false;
		}

		alreadySubmitted = true;

		var submitForm = document.createElement( "form" );
		document.body.appendChild( submitForm );
		submitForm.method = "POST";
		submitForm.action = "PaySubmit";

		var dataElement = document.createElement( "input" );
		dataElement.type = 'hidden';
		dataElement.name = 'Data';

		submitForm.appendChild( dataElement );
		dataElement.value = GetValuesFormPay( 'payForm' );
		submitForm.submit();

		addClass( document.getElementById( 'footerSubmit' ), 'disabled' );
		
		return false;
	}
			
    // Покажем ошибку банка, если она есть
    (function checkServerError() {
        var serverError = document.getElementById("serverError");
        if (serverError.innerHTML.length > 0)
            serverError.style.display = "block";
    })();
	
	var detectCardType = function(number) {
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
		}  else if (re.mir.test(number)) {
			return 'MIR';
		} 
		else {
			return undefined;
		}
	};

	var saveInp = document.getElementById("AddCard");
	var cardList = document.getElementById("CardSelectList");
	
	//простая проверка на заполненность полей и числовое поле
	var validGroupFreePay = [
		{"field": ["number1", "number2", "number3", "number4"], "msg": "number__error", "rules": [isEmpty]},
		{"field": ["valid_month"], "msg": "valid_month__error", "rules": [isEmpty, isPastMonth]},
		{"field": ["valid_year"], "msg": "valid_year__error", "rules": [isEmpty, isPastYear]},
		{"field": ["valid_cvv"], "msg": "valid_cvv__error", "rules": [isEmpty]}
	];
	
	var validGroup = validGroupFreePay;
	
	var invalidInputClass = "m-input-error";
		
	//initValidator
	(function() {
		//скрываем ошибки
		for (var i=0; i<validGroup.length; i++){
			(function(k) {
				var group = validGroup[k];
				for (var j=0; j<group.field.length; j++){					
					//даем вводить только 0-9, backSp, enter, tab
					document.getElementById(group.field[j]).onkeypress = function(e){
						e = e || window.event;
						
						if (e.ctrlKey || e.altKey || e.metaKey) return;
						var chr = getChar(e);
						if (chr == null) return;
						if (chr < '0' || chr > '9') {
							if (this.value.length != this.getAttribute("maxlength")) showError(this, document.getElementById(group.msg));
							return false;
						}
						hideError(this, document.getElementById(group.msg));
					};
					document.getElementById(group.field[j]).onfocus = function(e){
						this.select();
						hideError(this, document.getElementById(group.msg));
					};
					
					//автоматический переход к следующему полю при вводе
					(function(m) {
						
						//внутри группы
						if (group.field[m+1]){
							document.getElementById(group.field[m]).onkeyup = function(e){
								if (k==0 && m==0) keyupCardNumber(e);
								
								if ((this.value.length == this.getAttribute("maxlength")) && isNotApple) {
									e = e || window.event;
									if (e.ctrlKey || e.altKey || e.metaKey) return;
									var keyCode = e.keyCode|| e.charCode || e.which;
									if ( (keyCode>=48 && keyCode<=57) || ( keyCode >= 96 && keyCode <= 105 ) ){
										document.getElementById(group.field[m+1]).select();
									}
								}
							}					
						//к следующей группе
						}else if (validGroup[k+1] && validGroup[k+1].field[0]){
							document.getElementById(group.field[m]).onkeyup = function(e){
								if (k==0 && m==0) keyupCardNumber(e);
								if ((this.value.length == this.getAttribute("maxlength")) && isNotApple) {
									e = e || window.event;
									if (e.ctrlKey || e.altKey || e.metaKey) return;
									var keyCode = e.keyCode|| e.charCode || e.which;
									if ( ( keyCode>=48 && keyCode<=57 ) || ( keyCode >= 96 && keyCode <= 105 ) ){
										document.getElementById(validGroup[k+1].field[0]).select();
									}
								}
							}	
						}else if (typeof(validGroup[k+1]) == "undefined"){
							document.getElementById(group.field[m]).onkeyup = function(e){
								if (k==0 && m==0) keyupCardNumber(e);
								if (this.value.length == this.getAttribute("maxlength")){									
									isValidForm();
								}
							}	
						}
						
						document.getElementById(group.field[m]).onblur = function(){ //проверяем заполненность формы при каждой потере фокуса полем.
							isFillAll();
						}
					})(j);
				}	
			})(i);
		}	
		
	})();
	
	function isValidForm(){
		var result = true;
		for (var i in validGroup){			
			var group = validGroup[i], j = 0;				
			for (var j in group.field){						
				var el = document.getElementById(group.field[j])
				for (var r = 0; r < group.rules.length; r++){
					if (group.rules[r](el)) {						
						showError(el, document.getElementById(group.msg));
						result = false;
					};						
				}
			}			
		}
		if (result && !alreadySubmitted){
			removeClass(document.getElementById("footerSubmit"), "disabled");
		}
		return result;
	}
	
	function isFillAll(){
		var els = document.getElementsByTagName('input');
		var result = true;
		for (var i=0; i<els.length; i++){
			if(document.getElementsByTagName('input')[i].value.length == 0){
				result = false;
				break;
			}
		}
		if (result && !alreadySubmitted){
			removeClass(document.getElementById("footerSubmit"), "disabled");
		}
		return result;
	}

	
	
	function isEmpty(el){
		var len = el.value.length,
			minLength = el.getAttribute("minlength"),
			maxLength = el.getAttribute("maxlength");
			
		if (minLength) {
			return !(len == minLength || len == maxLength) || isNaN(el.value);
		} else {
			return len < maxLength || isNaN(el.value);
		}
	}
	
	document.getElementById("valid_month").onblur = function(){ //проверим на всякий случай месяц при потере полем фокуса
		if(isPastMonth(this))
			document.getElementById("valid_month__error").style.display = "block";
	};
	document.getElementById("valid_year").onblur = function(){ //проверим на всякий случай и год при потере полем фокуса
		if(isPastYear(this))
			document.getElementById("valid_year__error").style.display = "block";
	};
	function isPastMonth(el){
		//месяц не меньше текущего и не больше 12
		//почему он не может быть меньше текущего? я так и не понял :-(
		//добавил проверку на длину, надо чтобы было "07", а не "7" например
		//var month = (new Date()).getMonth()+1;		
		//return isNaN(el.value) ||  parseInt(el.value) < month || parseInt(el.value) > 12;
		return isNaN(el.value) || parseInt(el.value,10) > 12 || el.value.length != 2 || parseInt(el.value,10) == 0;
	}
	
	function isPastYear(el){
		//год не меньше текущего
		var year = (new Date()).getFullYear().toString();
		return isNaN(el.value) || parseInt(el.value,10) < parseInt(year.substr(2),10) || el.value.length != 2; //year.substr(-2) IE не понимает такого. Отсчитаем с начала тогда. Уповаю на то, что все браузеры возвращают год именно в формате ****
	}
	
	
	function showError(el, msg){			
		//для группы элементов сообщение показываем у первого ошибочного
		if (msg.style.display != "block"){
			msg.style.display = "block";
			msg.style.left = el.offsetLeft + "px";		
		}
		addClass(el, invalidInputClass);		
	}	
	
	function hideError(el, msg){
		msg.style.display = "none";
		document.getElementById("serverError").style.display = "none";
		removeClass(el, invalidInputClass);		
	}
	
	function hasClass(el, name) {
	   return new RegExp('(\\s|^)'+name+'(\\s|$)').test(el.className);
	}

	function addClass(el, name)	{
	   if (!hasClass(el, name)) { el.className += (el.className ? ' ' : '') +name; }
	}

	function removeClass(el, name){
	   if (hasClass(el, name)) {
		  el.className=el.className.replace(new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
	   }
	}
	
	function keyupCardNumber(e) {
		var cardType = detectCardType(e.target.value);
		if (cardType === 'MASTERCARD');
		setCardType(cardType);
	}
	
	function setCardType(cardType) {
		if (!cardType) {
			document.getElementById('visa').style.display = 'inline-block';
			document.getElementById('mastercard').style.display = 'inline-block';
			document.getElementById('maestro').style.display = 'inline-block';
			document.getElementById('mir').style.display = 'inline-block';
		} else {
			document.getElementById('visa').style.display = 'none';
			document.getElementById('mastercard').style.display = 'none';
			document.getElementById('maestro').style.display = 'none';
			document.getElementById('mir').style.display = 'none';
			
			document.getElementById(cardType.toLowerCase()).style.display = 'inline-block';
		}
	}
	
	function initSavedCardFields() {
		var cardMask = cardList.options[cardList.selectedIndex] ? cardList.options[cardList.selectedIndex].text : 'xxxxxxxxxxxxxxxx';
		for (var i=1; i<=4; i++){
			setAndDisable("number" + i, cardMask.substr((i-1)*4, i < 4 ? 4 : cardMask.length - 12));
		}
		
		var cardType = detectCardType(cardMask);
		setCardType(cardType);
		setAndDisable("valid_year", "xx");
		setAndDisable("valid_month", "xx");
		document.getElementById("valid_cvv").focus();
	};
	
	function setAndDisable(name, val) {
		var input = document.getElementById(name);
		input.value = val;
		input.disabled = true;
	}
	
	window.onpageshow = function(evt) {
		if (evt.persisted) {
			alreadySubmitted = false;
			isValidForm();
		}
	};
	
	document.getElementById("footerSubmit").onclick = Submit;
		

})(window, window.document);	