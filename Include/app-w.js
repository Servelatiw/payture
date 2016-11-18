var card = {
        id: '',
        system: '',
        number: {
            maxLength: 16,
            value: '',
            isValid: false,
            bin: ''
        },
        date: {
            value: '',
            isValid: false
        },
        code: {
            value: '',
            isValid: false
        },
        save: true
    };

meta.allowDiscount = (
    meta.allowDiscount === true ||
    meta.allowDiscount === 'true' ||
    meta.allowDiscount === 'True' ||
    meta.allowDiscount === 'TRUE' ||
    meta.allowDiscount === 'YES' ||
    meta.allowDiscount === '1' ||
    meta.allowDiscount === 1
);

meta.allowAddCard = (
    meta.allowAddCard === true ||
    meta.allowAddCard === 'true' ||
    meta.allowAddCard === 'True' ||
    meta.allowAddCard === 'TRUE' ||
    meta.allowAddCard === 'YES' ||
    meta.allowAddCard === '1' ||
    meta.allowAddCard === 1
);

// Validation

function isCardNumberValid(value) {
    var visaFullRegExp = /^4[0-9]{12}(?:[0-9]{3})?$/, // Standard Visa is 13 or 16, debit can be 19
        mastercardFullRegExp = /^5[1-5][0-9]{14}$/, // Begins with 51-55 or 2221-2720 and 16 in length
        maestroFullRegExp = /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)[0-9]{8,15}$/, // possible_lengths: 12, 13, 14, 15, 16, 17, 18, 19
        mirFullRegExp = /^2/;

    if (visaFullRegExp.test(value)) {
        //console.log('valid visa');
        card.number.isValid = true;
    } else if (mastercardFullRegExp.test(value)) {
        //console.log('valid mastercard');
        card.number.isValid = true;
    } else if (maestroFullRegExp.test(value)) {
        //console.log('valid maestro');
        card.number.isValid = true;
    }
    else if (mirFullRegExp.test(value)) {
        //console.log('valid mir');
        card.number.isValid = true;
    }
    else {
        //console.log('not valid');
        card.number.isValid = false;
    }
    return card.number.isValid;
}

function isCardExpDateValid(value) {
    var expDateRegExp = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;

    card.date.isValid = expDateRegExp.test(value);
    return card.date.isValid;
}

function isCardCvcValid(value) {
    var cvcRegExp = /^[0-9]{3,4}$/;

    card.code.isValid = cvcRegExp.test(value);
    return card.code.isValid;
}

function isCardValid() {
    return card.number.isValid && card.date.isValid && card.code.isValid;
}

// Get information

function setPaymentSystem() {
    var paymentSystem = '',
        maxLength;
        visaRegExp = /^4[0-9]{5,}$/, // 6
        mastercardRegExp = /^5[1-5][0-9]{4,}$/, // 5
        maestroRegExp = /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
        mirRegExp = /^2/; // 1

    if (visaRegExp.test(card.number.value.replace(/\D/g,''))) {
        paymentSystem = "visa";
        maxLength = 19; // 16 + 3 spaces = 19
    } else if (mastercardRegExp.test(card.number.value.replace(/\D/g,''))) {
        paymentSystem = "mastercard";
        maxLength = 19; // 16 + 3 spaces = 19
    } else if (maestroRegExp.test(card.number.value.replace(/\D/g,''))) {
        paymentSystem = "maestro";
        maxLength = 23; // 19 + 4 spaces = 23
    } else if (mirRegExp.test(card.number.value.replace(/\D/g,''))) {
        paymentSystem = "mir";
        maxLength = 19;
    }
    else {
        paymentSystem = "invalid";
        maxLength = 19; // 16 + 3 spaces = 19
    }

    card.system = paymentSystem;
    document.getElementById('credit-card-number').setAttribute('maxLength', maxLength);
}

// Ready

$(function(){
    //console.log('ready');

    var $cardNumberInput = $("#credit-card-number"),
        $savedCardNumberDiv = $('#saved-credit-card-number'),
        $cardCardExpDateInput = $("#credit-card-exp-date"),
        $cardCvcInput = $("#credit-card-cvc"),
        $cardSaveCheckbox = $("#credit-card-save"),
        $cardSaveLabel = $("#credit-card-save-label"),
        $submitBtn = $('#submit-btn'),
        $payForm = $('#pay-form'),
        $msg = $('#msg'),
        $msgTxt = $('.msg-txt'),
        $uiChkb = $('.ui-text-checkbox');
        $amB = $('.amount-banner');

    if (!meta.allowAddCard) {
        $uiChkb.hide();
        $cardSaveCheckbox.attr('checked', false);
    };

    var creditСardSelect = document.getElementById('credit-card-select');
    card.id = creditСardSelect.value || creditСardSelect.options[creditСardSelect.selectedIndex].value;

    if (card.id != '' && card.id != 'FreePay') {
        // we have saved card
        card.number.isValid = true;
        card.date.isValid = true;
        // hide form elements
        $('.js-free-pay').each(function(){
            $(this).hide();
        });
        // show form elements
        $('.js-saved-card').each(function(){
            var savedCardClass = creditСardSelect.options[creditСardSelect.selectedIndex].text.split(' ')[0].toLowerCase();
            $(this).show().addClass('type-' + savedCardClass);
        });
        //
        $savedCardNumberDiv.html(creditСardSelect.options[creditСardSelect.selectedIndex].text);
        //
        $cardSaveLabel.html(meta.discountDescription);
    } else {
        // free pay
        // show form elements
        $('.js-free-pay').each(function(){
            $(this).show();
        });
        // hide form elements
        $('.js-saved-card').each(function(){
            $(this).hide();
        });
    }

    function enableSubmitButton(value){
        $submitBtn.attr('disabled', !value);
    }

    function getDiscount(cardNumber, shouldSaveCard) {
        var cardBin = cardNumber.substr(0,6); //'411111'

        //console.log('cardBin.length = ', cardBin.length);

        if (cardBin.length >= 6) {

            if (card.number.bin != cardBin || card.save != shouldSaveCard) {

                card.number.bin = cardBin;
                card.save = shouldSaveCard;

                //console.log('card.save = ', card.save);

                enableSubmitButton(false);

                $.ajax({
                    method: "POST",
                    url: meta.discountUrl,
                    dataType: "json",
                    crossDomain: true,
                    data: {
                        IsAddCardChecked: card.save,
                        CardBin: card.number.bin,
                        OrderKey: meta.orderKey
                    },
                    /*
                     var responce = {
                     IsDiscountApplied: true,
                     TotalAmount: 70600,
                     AmountDescription: "   706 р. за 2 билета.",
                     DiscountDescription: "Visa Gold - бесплатный билет"
                     };
                     */
                    success: function(data, textStatus, jqXHR ) {
                        //console.log('success');
                        //console.log('data = ', data);

                        if (data.IsDiscountApplied) {
                            // we have discount
                            getDiscountYesHandler(data);
                        } else {
                            // nope
                            getDiscountNoHandler(data);
                        }

                        enableSubmitButton(isCardValid());
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error('data = ', error);

                        enableSubmitButton(isCardValid());
                    }
                });
            }
        } else {
            // cardBin.length < 6
            card.number.bin = cardBin;
            getDiscountNoHandler();
        }
    }

    function getDiscountYesHandler(data) {
        if (meta.initTotalAmount > meta.curTotalAmount) {
            console.log(meta.initTotalAmount);
            console.log(meta.curTotalAmount);
            $amB.addClass('d-block').html('<span class="d-title">Ваша скидка:</span> ' + (meta.initTotalAmount - meta.curTotalAmount) / 100 + ' ₽');
        }
        else {
            $amB.removeClass('d-block').empty();
        }

        meta.curTotalAmount = data.TotalAmount;
        meta.total = meta.curTotalAmount / 100;
        meta.discountDescription = data.DiscountDescription;

        $amB.addClass('d-block').html('<span class="d-title">Ваша скидка:</span> ' + (meta.initTotalAmount - meta.curTotalAmount) / 100 + ' ₽');

        $cardSaveLabel.html(meta.discountDescription);
        $amB.length > 0 ? $submitBtn.val('Купить билеты') : $submitBtn.val('Оплатить ' + meta.total + ' ₽');

    }

    function getDiscountNoHandler(data) {
        $amB.removeClass('d-block').empty();

        if (data) {
            meta.curTotalAmount = data.TotalAmount;
            meta.total = meta.curTotalAmount / 100;
        } else {
            //console.log('meta.initTotalAmount = ', meta.initTotalAmount);
            meta.total = meta.initTotalAmount / 100;
        }

        $cardSaveLabel.html(meta.noDiscountDescription);
        $amB.length > 0 ? $submitBtn.val('Купить билеты') : $submitBtn.val('Оплатить ' + meta.total + ' ₽');
    }

    // MESSAGE
    function showErrorMessage() {
        console.log(meta.message.error);
        $msg.append('<div class="inner-message">' + meta.message.error + '</div>').addClass('msg-error');
    }

    function hideErrorMessage() {
        $msg.removeClass('msg-error');
        $msgTxt.html(meta.message.ok);
    }

    if (meta.message.error) {
        // show error
        showErrorMessage();
    }

    // CARD NUMBER

    $cardNumberInput
        .on("focus", function() {
            $(this).removeClass('ui-error');
            hideErrorMessage();
        })
        .on("change paste keyup", function(event) {
            //console.log(event.target.value + '|' + event.target.value.length);

            var str = event.target.value,
                strOnlyDigits = str.replace(/\D/g,''),
                partsArray,
                withSpacesString,
                partsArrayMaxLength,
                caretPosition = this.selectionStart;

            if (this.value == this.lastValue) return;
             var str = event.target.value,
                strOnlyDigits = str.replace(/\D/g,''),
                partsArray = [],
                caretPosition = this.selectionStart;
            for (var i = 0, len = strOnlyDigits.length; i < len; i += 4) {
                partsArray.push(strOnlyDigits.substring(i, i + 4));
            }
            for (var i = caretPosition - 1; i >= 0; i--) {
                var c = this.value[i];
                if (c < '0' || c > '9' ) {
                    caretPosition--;
                }
            }
              caretPosition += Math.floor(caretPosition / 4);
              if ((caretPosition != 5) && (caretPosition != 10) && (caretPosition != 15)  && (caretPosition != 20)) {
                //set
                this.value = this.lastValue = partsArray.join(' ');
                this.selectionStart = this.selectionEnd = caretPosition;
              }
            //set
            card.number.value = card.number.value = str.replace(/\D/g,'');
            setPaymentSystem();

            $(this).parent().removeClass('type-mastercard type-visa type-maestro type-mir type-invalid').addClass('type-' + card.system);
            //console.log(card.system);

            switch (card.system) {
                case 'visa':
                case 'mastercard':
                case 'mir' :
                case 'invalid':
                    partsArrayMaxLength = 4;
                    break;
                case 'maestro':
                    partsArrayMaxLength = 5;
                    break;
            }

            // get Data from server
            if (meta.allowDiscount) {
                getDiscount(card.number.value, card.save);
            }

            // validate
            isCardNumberValid(card.number.value);
            enableSubmitButton(isCardValid());

        })
        .on("blur", function(event) {
            var str = event.target.value;

            card.number.value = str.replace(/\D/g,'');

            // validate
            if (isCardNumberValid(card.number.value)) {
                $(this).removeClass('ui-error');
            } else {
                $(this).addClass('ui-error');
            }

            enableSubmitButton(isCardValid());
        });

    // CARD EXP DATE

    $cardCardExpDateInput
        .on("keypress", function(evt) {
            if (evt.which < 48 || evt.which > 57) {
                evt.preventDefault();
            }
        })
        .on("focus", function() {
            $(this).removeClass('ui-error');
            hideErrorMessage();
        })
        .on("change paste keyup", function(event) {
            //console.log(event.target.value + '|' + event.target.value.length);

            var str = event.target.value,
                partsArray,
                withSpacesString;

            var delimiter = ' / ',
                delimiterLength = delimiter.length,
                maxPartsArrayLength = 2,
                eachPartLength = 2;

            card.date.value = str.replace(/\D/g,'');

            // split into segments
            partsArray = card.date.value.match(/[\s\S]{1,2}/g) || [];

            if (event.keyCode == 8) {
                if ((card.date.value.length % eachPartLength == 0)
                    &&
                    (str.charAt(str.length - 1) != ' ')
                ) {
                    //console.log('remove delimiter');
                    str = str.substr(0, str.length - delimiterLength);
                }
            } else {
                //console.log('number pressed');

                // join with delimiter
                withSpacesString = partsArray.join(delimiter);

                if (((card.date.value.length % eachPartLength) == 0)
                    &&
                    partsArray.length > 0
                    &&
                    partsArray.length < maxPartsArrayLength
                ) {
                    // add delimiter
                    withSpacesString += delimiter;
                }

                str = withSpacesString;
            }

            // set
            $(this).val(str);

            // validate
            isCardExpDateValid(card.date.value);
            enableSubmitButton(isCardValid());
        })
        .on("blur", function(event) {
            var str = event.target.value;

            card.date.value = str.replace(/\D/g,'');

            // validate
            if (isCardExpDateValid(card.date.value)) {
                $(this).removeClass('ui-error');
            } else {
                $(this).addClass('ui-error');
            }

            enableSubmitButton(isCardValid());
        });
        //.on("touchend", function(event){
        //    //console.log('touchend');
        //
        //    $(this).focus();
        //});

    // CARD CVC,CVV

    $cardCvcInput
        .on("keypress", function(evt) {
            if (evt.which < 48 || evt.which > 57) {
                evt.preventDefault();
            }
        })
        .on("focus", function() {
            $(this).removeClass('ui-error');
            hideErrorMessage();
        })
        .on("change paste keyup", function(event) {
            var str = event.target.value;

            card.code.value = str.replace(/\D/g,'');

            // validate
            isCardCvcValid(card.code.value);
            enableSubmitButton(isCardValid());
        })
        .on("blur", function(event) {
            var str = event.target.value;

            card.code.value = str.replace(/\D/g,'');

            // validate
            if (isCardCvcValid(card.code.value)) {
                $(this).removeClass('ui-error');
            } else {
                $(this).addClass('ui-error');
            }

            enableSubmitButton(isCardValid());
        });
        //.on("touchend", function(event){
        //    //console.log('touchend');
        //
        //    $(this).focus();
        //});

    // SAVE

    $cardSaveCheckbox
        .change(function() {
            if (meta.allowDiscount) {
                getDiscount(card.number.value, $(this).is(":checked"));
            } else {
                card.save = $(this).is(":checked");
            }
            //console.log('card.save = ', card.save);
        });

    // SUBMIT

    $payForm
        .on('submit',function(event) {
            event.preventDefault();
            console.log('submitForm');
            var addCard = 'AddCard=' + (card.save ? 'True' : '') + ';';
            console.log(addCard);

            var dataString = '',
                cardId = (card.id != '' && card.id != 'FreePay') ? creditСardSelect.options[creditСardSelect.selectedIndex].value : 'FreePay';
            enableSubmitButton(false);


            if (cardId == 'FreePay') {
                // FreePay
                dataString =
                    'Key=' + meta.key + ';' +
                    'CardId=FreePay;' +
                    'CardHolder=RAMBLER KASSA;' +
                    'CardNumber=' + card.number.value + ';' +
                    'EMonth=' + card.date.value.substr(0,2) + ';' +
                    'EYear=' + card.date.value.substr(2,2) + ';' +
                    'SecureCode=' + card.code.value + ';' +
                    'AddCard=' + (card.save ? 'True' : '') + ';' +
                    'TotalAmount=' + meta.curTotalAmount;
            } else {
                // pay with saved card

                dataString =
                    'Key=' + meta.key + ';' +
                    'CardId=' + cardId + ';' +
                    'SecureCode=' +  card.code.value + ';' +
                    'TotalAmount=' + meta.curTotalAmount;
            }

            //console.log(dataString);

            var form = document.getElementsByTagName('form')[0];
                console.log(form);
                hiddenField = document.createElement('input');

            form.setAttribute("method", $(this).attr('method'));
            form.setAttribute("action", $(this).attr('action'));

            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', 'Data');
            hiddenField.setAttribute('value', dataString);

            form.appendChild(hiddenField);
            form.submit();

        });
});