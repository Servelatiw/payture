(function(window, document, undefined){
"use strict";
	var form = document.getElementById('payForm');	
	var numberBox = form.elements["number"];
	var monthBox  = form.elements["EMonth"];
	var yearBox = form.elements["EYear"];
	var secureCodeBox = form.elements["SecureCode"];
	var cardList = form.elements["CardSelectList"];
	var key = form.elements["Key"].value;
	var cardId = cardList.value || cardList.options[cardList.selectedIndex].value;
	var payWithSavedCard = cardId == "FreePay" ?  false : true;

	function GetValuesFormPay(card, mon, year, code, add, id, key) {			
	    return payWithSavedCard
			? "SecureCode=" + code + ";Key=" + key + ";CardId=" + id
			: "CardHolder=RAMBLER KASSA;CardNumber=" + card + ";EMonth=" + mon + ";EYear=" + year + ";SecureCode=" + code + ";Key=" + key + ";CardId=FreePay;AddCard=" + add;
	}
		
	var alreadySubmitted;
	function Submit(){
		if ( alreadySubmitted ) {
			return false;
		}

		var el1 = clearFormat(numberBox.value);
		var el2  = monthBox.value;
		var el3 = yearBox.value;
		var el4 = secureCodeBox.value;
		var add = form.elements["AddCard"].checked ? 'True' : '';
		var fullLength = el1.length + el2.length + el3.length + el4.length;
		if (fullLength == 25 || fullLength == 23 ){
			var submitForm = document.createElement("form");
			document.body.appendChild(submitForm);
			submitForm.method = "POST";	
			submitForm.action= "PaySubmit";

			var dataElement = document.createElement("input");
			dataElement.type = 'hidden';
			dataElement.name = 'Data';

			submitForm.appendChild(dataElement);
			dataElement.value = GetValuesFormPay(el1, el2, el3, el4, add, cardId, key);
			submitForm.submit();
			alreadySubmitted = true;
			document.getElementById( 'footerSubmit' ).className += ' disabled';
		} else {
			if (payWithSavedCard)
				alert("Заполните CVV/CVC");
			else
				alert("Заполните все поля формы правильно");
			return false;
		}
    }
	
	function checkServerError() {
		var serverError = document.getElementById("serverError" ),
			serverErrorMsg = document.getElementById("serverErrorMsg");
		if ( serverErrorMsg.innerHTML.length > 7)
			serverError.style.display = "block";
	}
	checkServerError();	   

	var cardNumber = document.getElementById("number");
	cardNumber.addEventListener("keypress", function (e){
			var key = e.keyCode || e.charCode || e.which,
				str = this.value;
			
			key = String.fromCharCode(key);

			if ( !(/[0-9]/.test(key)) ){
				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
			}
			
			str = str.replace(/\s/g, '').replace(/\d{4}/g, '$& ').replace(/\s\s/g, ' ');
			if (str.lastIndexOf(' ') === 19) str = str.slice(0, 19) + str.slice(20);
			if (this.value !== str) this.value = str;
		}, false);
			
	var cvvCode = document.getElementById("valid_cvv");
	cvvCode.addEventListener("focus",
		function () {
			cvvCode.setAttribute("type", "tel");
			setTimeout(function () {
				cvvCode.setAttribute("type", "password");
			}, 100);
		}, false);
		
	function clearFormat(s){
		return s.replace(/\s/g,'');
	}
	
	function initSavedCardFields() {
		var cardMask = cardList.options[cardList.selectedIndex] ? cardList.options[cardList.selectedIndex].text : 'xxxxxxxxxxxxxxxx';
		setAndDisable(numberBox, cardMask);		
		setAndDisable(yearBox, "xx");
		setAndDisable(monthBox, "xx");
		secureCodeBox.focus();
	};
	
	function setAndDisable(input, val) {
		input.value = val;
		input.disabled = true;
	}
			
	if (payWithSavedCard)
		initSavedCardFields();
	
	if (document.getElementById("AllowAddCard").value === "True")
	{
		document.getElementById("AddCard").checked = true;		
	}
	else
	{
		document.getElementById("AddCardBlock").style.display = "none";
	}		
	
	document.getElementById("footerSubmit").onclick = Submit;		

})(window, window.document);	