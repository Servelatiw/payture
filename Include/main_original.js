(function($, window, document, undefined){


/**
 * Submit form functions
 * @param string formName - form ID
 */
function GetValuesFormPay(formName) {
    var form_val = '';
    var form_elms = [];
    var isNumber = true;
    $("#" + formName + " :input:not(:disabled):not(button)").each(function(i) {
        var eVal = "";
        var name = $(this).attr("name")
        if (name.search("EDate") != -1)
            name = name.replace("EDate_", "")
        if (ParamEx(form_elms, $(this).name))
            return true;
        
        if (!$(this).parents(".card").is(":visible") && !$(this).parent().is("form") && !$(this).is("#CardSelectList"))
            return true;
        
        if ($(this).is("[name^=CardNumber]")) {
            if (isNumber){
                eVal = getPAN();
                name = "CardNumber";
                isNumber = false;
            } else
                return true;
        } else if ($(this).is(":checkbox"))
            eVal = $(this).is(":checked") ? $(this).val() : "";
        else
            eVal =  $(this).val()
        
        form_val += name + "=" + eVal + ";";
        form_elms.push(name);
    })

    return form_val;
}
// search parameter in array ... mmm ... indexOf ?
function ParamEx(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] == obj) {
            return true;
        }
    }
    return false;
}

function Submit( act ) {
    var submitForm = $("<form></form>").attr({
        method: "POST",
        action: act//"PaySubmit"
    })
    submitForm.appendTo($("body"))
    $("<input />").attr({
        type: "hidden",
        name: "Data"
    }).appendTo(submitForm).val(GetValuesFormPay('payForm'))
    submitForm.submit();
    return false;
}

/**
 * Luna check card
 * @param int number - card PAN
 * now disabled
 */
function checkCardLuna(number) {
    return true;
    var length = number.length;
    var sum = 0;
    if (length > 0) {
        for (var i = 0; i < length; i++ ) {
            var l = parseInt(number.charAt(i));
            
            if (i % 2 == 0 ) {
                l = 2 * l;
                if ( l > 9 )
                    l = l - 9;
            }
            sum += l;
        }
        if ( sum % 10 == 0 )
            return true;
        else
            return false;
    } else
        return false;
}

/**
 * Translate russian letters to english
 * @param int number - card PAN
 * now disabled
 */
var enToRu = { 
    'Р№': 'q', 'С†': 'w', 'Сѓ': 'e', 'Рє': 'r', 'Рµ': 't', 'РЅ': 'y', 'Рі': 'u', 'С€': 'i', 'С‰': 'o', 'Р·': 'p', 
    'С„': 'a', 'С‹': 's', 'РІ': 'd', 'Р°': 'f', 'Рї': 'g', 'СЂ': 'h', 'Рѕ': 'j', 'Р»': 'k', 'Рґ': 'l', 
    'СЏ': 'z', 'С‡': 'x', 'СЃ': 'c', 'Рј': 'v', 'Рё': 'b', 'С‚': 'n', 'СЊ': 'm'  
};
function getRuByEn(str) { 
    if(enToRu[str]) return enToRu[str]; 
    else return str; 
}
function changeRuToEn(str) {
    var newStr = "";
    for(var i = 0, length = str.length; i < length; i++){
        newStr += getRuByEn(str.charAt(i));
    }
    return newStr;
};
function translateText(event, obj){
    var charCode = event.charCode ? event.charCode : event.keyCode;
    var charCodeStr = String.fromCharCode(charCode);
    var ruToEn = changeRuToEn(charCodeStr.toLowerCase());
    var val = obj.value;
    var r_simple = /[A-Z ]/i;
    
    var cursorPos = 0;
    if (document.selection) {
        var range = document.selection.createRange();
        range.moveStart('textedit', -1);
        cursorPos = range.text.length;
    } else {
        cursorPos = obj.selectionStart;
    }
    
    if (charCode==8||charCode==9||charCode==32||charCode==46||(charCode>36&&charCode<41)){
        return true;
    } else {
        var insertText = "";

        if (r_simple.test(String.fromCharCode(charCode))) { 
            insertText = String.fromCharCode(charCode);
            obj.value = val.substring(0,cursorPos) + insertText + val.substring(cursorPos,val.length)
            obj.selectionStart = cursorPos + 1;
            obj.selectionEnd = cursorPos + 1;
        } else if (r_simple.test(ruToEn)) {
            insertText = ruToEn;
            obj.value = val.substring(0,cursorPos) + insertText + val.substring(cursorPos,val.length)
            obj.selectionStart = cursorPos + 1;
            obj.selectionEnd = cursorPos + 1;
        }
    } 
    return false;
}

/**
 * Function is Number
 * @param e - event
 */
function isNumber(e){
    var keynum;
    
    if(window.event)
        keynum = e.keyCode;
    else if(e.which)
        keynum = e.which;

    if (keynum == 8 || keynum == 13) 
        return true;
    if (keynum < 45 || keynum > 57)
        return false;
    else 
        return true;
}


















/*
* code from page

*/



$("#CardSelectList").on('change', initCards);



$("#SubmitButton").click(function(){
	Submit( "PaySubmit" );
	return false;
});

var isFocus = "";
$("*").focus(function(){
	isFocus = $(this).attr("name");
	if ($(this).is("button"))
		isFocus = "Button"
})  
$('#payForm input').bind({
	focus: function(e) {
		$(this).closest('.ps_form_cont').addClass('focus');
		
		if ($(this).parents("#cardNumber").length > 0) {
			changeCaretPosition(this, e);
		}
	},
	keypress: function(e){
		$(".error").hide();
		if ($(this).is(".onlyNum"))
			return isNumber(e);
		if ($(this).is(".onlyLat"))
			return translateText(e, this);
	},
	keyup: function(e) {
		checkButton();
		if ($(this).parents("#cardNumber").length > 0 || $(this).parents("#expiredDate").length > 0) {
			changeCaretPosition(this, e)
			resizeInput()
		}
	},
	blur: function() {
		$(this).closest('.ps_form_cont').removeClass('focus');
	
		var isBlur = $(this).attr("name");
		isBlur = isBlur.replace(/[0-9]/, "")
		if (isBlur.search("_") != -1) {
			isBlur = isBlur.split("_")[0];
			if ($(this).val().length == 1)
				$(this).val("0" + $(this).val())
		}
		
		setTimeout(function(){
			if (isFocus) {
				isFocus = isFocus.replace(/[0-9]/, "")
				if (isFocus.search("_") != -1)
					isFocus = isFocus.split("_")[0]
			} else {
				isFocus = "";
			}
			
			if (isFocus != isBlur || isBlur == "SecureCode" || isBlur == "SecureCodeTied")
				checkForm[isBlur](true);
				
			checkButton();
		},10)
	}
});

function resizeInput() {

	if ($("#cardNumber input[name='CardNumber3']").val().length < 5) {
		$("#cardNumber .text input").css({
			width: "53px",
			marginLeft: "5px"
		})
	} else if ($("#cardNumber input[name='CardNumber3']").val().length == 5) {
		$("#cardNumber .text input").css({
			width: "52px",
			marginLeft: "5px"
		})
		$("#cardNumber input[name='CardNumber3']").width("64px")
	} else if ($("#CardNumber input[name='CardNumber3']").val().length > 5) {
		$("#cardNumber .text input").css({
			width: "52px",
			marginLeft: "3px"
		})
		$("#cardNumber input[name='CardNumber3']").width("72px")
	}

}


function SelectCard(){
	$(".card").hide();
	if ($("#cardSelectList option").length > 1) {
		if ($("#cardSelectList").val() == "FreePay") {
			$("#divNewCard").show();
			detectCardType(getPAN());
		} else {
			$("#divCVCList").show();
			var panMask = $("#CardSelectList option:selected").text()
			$("#cardNumber .mask").each(function(i){
				$(this).text(panMask.substring(i*4, i*4 + 4))
			})
			detectCardType(panMask)
		}
	} else {
		$("#divNewCard").show();
		$(".selectCard").hide();
	}
}




/* -- check form -- */
var checkForm = {
	CardNumber: function(showE) {
		var number = getPAN();
		if (number.length < 16) {
			showErrors("CardNumber", "Введите от 16 до 19 знаков номера карты", showE)
			return false;
		} else if(number.length == 16) {
			if (checkCardLuna(number)){
				showRight("CardNumber")
				return true;
			} else{
				showErrors("CardNumber", "Неверный номер карты", showE)
				return false;
			}
		} else {
			showRight("CardNumber");
			return true;
		}
	},
	EDate: function(showE) {
		var date = new Date(),
			year = date.getFullYear() - 2000,
			month = date.getMonth() + 1,
			m = $("input[name*=EMonth]").val(),
			y = $("input[name*=EYear]").val();
		if (m == "00" || m == ""){
			if (y == "") {
				showErrors("ExpiredDate", "Укажите дату, до которой действительна карта", showE)
				return false;
			} else { 
				showErrors("ExpiredDate", "Укажите месяц, до которого действительна карта", showE)
				return false;
			}
		} else {
			if (y == "") {
				showErrors("ExpiredDate", "Укажите год, до которого действительна карта", showE)
				return false;
			} else {
				if (y < year || (y == year && m < month) || m > "12") {
					showErrors("ExpiredDate", "Неверно указана дата", showE)
					return false;
				} else {
					showRight("ExpiredDate")
					return true;
				}
			}
		}
	},
	CardHolder: function(showE) {
		if ($('input[name=CardHolder]').val().length < 3){
			showErrors("CardHolder", "Укажите имя владельца карты", showE)
			return false;
		} else{
			showRight("CardHolder")
			return true;
		}
	},
	SecureCode: function(showE) {
		if ($('input[name=SecureCode]').val().length != 3) {
			showErrors("CVV", "Укажите код CVV", showE)
			return false;
		} else {
			showRight("CVV");
			return true;
		}
	},
	SecureCodeTied: function(showE) {
		if (!$('input[name=SecureCodeTied]').length) return;
		if ($('input[name=SecureCodeTied]').val().length != 3) {
			showErrors("CVV2", "Укажите код CVV", showE)
			return false;
		} else {
			showRight("CVV2");
			return true;
		}
	}
}

function checkButton(){
	var isVal = true;
	if ($("#CardSelectList").val() == "FreePay") 
		rightForm = ["CardNumber", "EDate", "CardHolder", "SecureCode"]
	else
		rightForm = ["SecureCodeTied"];
		
	$.each(rightForm, function(){
		var a = checkForm[this]()
		if (a == false)
			isVal = false
	})
	
	if (isVal)
		$("#SubmitButton").removeClass("disable").removeAttr("disabled");
	else
		$("#SubmitButton").addClass("disable").attr("disabled", true);
}

/* -- get all PAN value -- */
function getPAN(){
	var cardPAN = "";
	$('#CardNumber input').each(function(){
		cardPAN += $(this).val()
	})
	return cardPAN;
}

/* -- errors -- */
function showErrors(id, message, showE) {
	if (showE) {
		var $el = $('#'+id);
		$errorLabel.appendTo( $el ).text(message).stop(false, true).fadeIn(200);
		$el.find('.text').addClass("wrong").removeClass("right");
	}
}
function showRight(id) {
	var $el = $('#'+id);
	$errorLabel.stop(false, true).fadeOut(200);
	$el.find(".text").addClass("right").removeClass("wrong");
}


/* -- detect card type -- */
function detectCardType(cardNumber) {
	var cardType;
	if (cardNumber != "") {
		if (cardNumber.charAt(0) == "4") cardType = 'visa';
		else if (cardNumber.charAt(0) == "5" || cardNumber.charAt(0) == "6") cardType = 'master';
	}
	
	setCardType(cardType);
	return cardType;
}

/* -- set card type -- */
function setCardType(type) {
	var $typeIcos = $('#cardType').find('i').hide();
	if (type) $typeIcos.filter('.ico_card_logo_' + type).show();
	
	switch (type) {
		case 'master':
			$saveCheckbox.attr('checked', 'checked').prop('checked', true);
			break;
		case 'visa':
		
			break;
		case 'maestro':
		
			break;
		default:
			
	}
	
};


/* -- change focus position -- */
function changeCaretPosition(obj, event) {
	event = (event) ? event : window.event;
	var charCode = (event.which) ? event.which : event.keyCode;
	
	 // Get caret position
	var cursorPos = 0;
	if (document.selection) {
		var range = document.selection.createRange();
		range.moveStart('textedit', -1);
		cursorPos = range.text.length;
	} else {
		cursorPos = obj.selectionStart;
	}
	
	var name = $(obj).attr("name");
	var length = $(obj).attr("maxlength");
	if (name.search("CardNumber") != -1) {
		var n = $(obj).attr("name").replace("CardNumber", "");
		if (n == "0")
			detectCardType($(obj).val())
		
		if (($(obj).val().length == length) && (n != "3"))
			$(obj).next().focus()
		if ((charCode == 8) && (cursorPos == 0) && (n != "0"))
			$(obj).prev().focus()
			
		if ((n != "0") && ($(obj).val().length == 0) && $(obj).prev().val().length < 4){
			$(obj).prev().focus();
			changeCaretPosition($(obj).prev(), event)
		}
	} else {
		var n = $(obj).attr("name").replace("EDate_", "");
		if ($(obj).val().length == length){
			if (n == "EMonth")
				$(obj).next().next().focus()
			else 
				$('#CardHolder input').focus()
		}
		if ((charCode == 8) && (cursorPos == 0) && (n == "EYear"))
			$(obj).prev().prev().focus()
	}
}






})(jQuery, window, window.document);