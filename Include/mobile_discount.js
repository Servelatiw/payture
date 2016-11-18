(function(window, document, undefined){
"use strict";
	var form = document.getElementById('payForm');	
	var numberBox = form.elements["number"];
	var monthBox  = form.elements["EMonth"];
	var yearBox = form.elements["EYear"];
	var secureCodeBox = form.elements["SecureCode"];
	var cardList = form.elements["CardSelectList"];
	var addBox = form.elements["AddCard"];
	var totalAmountField = form.elements["TotalAmount"];
	var key = form.elements["Key"].value;
	var cardId = cardList.value || cardList.options[cardList.selectedIndex].value;
	var payWithSavedCard = cardId == "FreePay" ?  false : true;
	var originalAmountDescription = document.getElementById("AmountDescription").innerText;
	var allowDiscount = form.elements["AllowDiscount"].value === "True";
	var discountUrl = form.elements["DiscountUrl"].value;
	var orderKey = form.elements["OrderKey"].value;

	function GetValuesFormPay(card, mon, year, code, add, id, key, totalAmount) {			
	    return payWithSavedCard
			? "SecureCode=" + code + ";Key=" + key + ";CardId=" + id + ";TotalAmount=" + totalAmount
			: "CardHolder=RAMBLER KASSA;CardNumber=" + card + ";EMonth=" + mon + ";EYear=" + year + ";SecureCode=" + code + ";Key=" + key + ";CardId=FreePay;AddCard=" + add + ";TotalAmount=" + totalAmount;
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
		var add = addBox.checked ? 'True' : '';
		var totalAmount = totalAmountField.value;
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
			dataElement.value = GetValuesFormPay(el1, el2, el3, el4, add, cardId, key, totalAmount);
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

	numberBox.addEventListener("keypress", function (e){
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
		
	if (allowDiscount) {
		numberBox.addEventListener("keyup", onNumberOrAddChange);
		numberBox.addEventListener("change", onNumberOrAddChange);
		addBox.addEventListener("change", onNumberOrAddChange);
	}
	
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
					
	var prevBin = "";
	var prevAdd = addBox.checked;
	var binLength = 6;
	var ordiginalTotalAmount = totalAmountField.value;
	function onNumberOrAddChange() {
		var cardNumber = clearFormat(numberBox.value);
		var cardBin = cardNumber.length >= binLength ? cardNumber.substr(0, binLength) : "";
		var add = addBox.checked;
		if (cardBin != prevBin || add != prevAdd) {
			prevBin = cardBin;
			prevAdd = add;
			requestDiscount(cardBin, add);
		}
		
	};
	
	function requestDiscount(cardBin, add) {
		var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
		var xhr = new XHR();

		xhr.open("POST", discountUrl, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onload = function() {
		  onDiscount(JSON.parse(this.responseText));
		}

		xhr.onerror = function() {
		  console.log("error");
		  removeDiscount();
		}
		
		xhr.send(
			"OrderKey=" + orderKey + "&" +
			"CardBin=" + cardBin + "&" + 
			"IsAddCardChecked=" + add);
	}
	
	function onDiscount(discountData) {
		setDiscount(discountData);
	}

	function setDiscount(discountData) {
		totalAmountField.value = discountData.TotalAmount;
		document.getElementById("AmountDescription").innerText = discountData.AmountDescription;
		document.getElementById("DiscountDescription").innerText = discountData.DiscountDescription;
	}
	
	function removeDiscount() {
		totalAmountField.value = ordiginalTotalAmount;
		document.getElementById("AmountDescription").innerText = originalAmountDescription;
		document.getElementById("DiscountDescription").innerText = "";		
	}
	
	document.getElementById("footerSubmit").onclick = Submit;	
	if (payWithSavedCard)
		initSavedCardFields();
	

})(window, window.document);	