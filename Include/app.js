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

    if (visaRegExp.test(card.number.value)) {
        paymentSystem = "visa";
        maxLength = 16; // 16 + 3 spaces = 19
    } else if (mastercardRegExp.test(card.number.value)) {
        paymentSystem = "mastercard";
        maxLength = 16; // 16 + 3 spaces = 19
    } else if (maestroRegExp.test(card.number.value)) {
        paymentSystem = "maestro";
        maxLength = 19; // 19 + 4 spaces = 23
    } else if (mirRegExp.test(card.number.value)) {
        paymentSystem = "mir";
        maxLength = 16;
    }
    else {
        paymentSystem = "invalid";
        maxLength = 16; // 16 + 3 spaces = 19
    }

    card.system = paymentSystem;
    card.number.maxLength = maxLength;
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
        $msgTxt = $('.msg-txt', $msg),
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
            $(this).show();
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
        $msg.addClass('msg-error');
        $msgTxt.html(meta.message.error);
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
        .on("keypress", function(evt) {
            var digits;

            if (evt.which < 48 || evt.which > 57) {
                // not digits
                evt.preventDefault();
            } else {
                // digits
                digits = event.target.value.replace(/\D/g,'');
                if (digits.length == card.number.maxLength) {
                    //console.log('preventDefault');
                    evt.preventDefault();
                }
            }
        })
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
                partsArrayMaxLength;

            if (event.keyCode == 8) {
                // console.log('backspace pressed');
                if ((strOnlyDigits.length % 4 == 0)
                    &&
                    (str.charAt(str.length - 1) != ' ')
                ) {
                    //console.log('remove one more char');
                    str = str.substr(0, str.length - 1);
                }
            }

            card.number.value = str.replace(/\D/g,'');

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

            if (event.keyCode != 8) {
                //console.log('number pressed');

                // split into segments
                partsArray = card.number.value.match(/[\s\S]{1,4}/g) || [];

                // join with spaces
                withSpacesString = partsArray.join(' ');

                if (((card.number.value.length % 4) == 0)
                    &&
                    partsArray.length > 0
                    &&
                    partsArray.length < partsArrayMaxLength
                ) {
                    // add last space
                    withSpacesString += ' ';
                }

                str = withSpacesString;
            }

            // set
            $(this).val(str);

            // get Data from server
            if (meta.allowDiscount) {
                getDiscount(card.number.value, card.save);
            }

            // validate
            isCardNumberValid(card.number.value);
            enableSubmitButton(isCardValid());

            // go to the next text field
            //if (card.number.value.length == card.number.maxLength) {
            //    $cardCardExpDateInput.focus();
            //}
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
        //.on("touchend", function(event){
        //    //console.log('touchend');
        //
        //    $(this).focus();
        //});

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

            // go to the next text field
            //if (card.date.value.length == 4) {
            //    $cardCvcInput.focus();
            //}
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

            //console.log('submitForm');
            var addCard = 'AddCard=' + (card.save ? 'True' : '') + ';';
            console.log(addCard);

            var dataString = '',
                cardId = 'FreePay',
                savedCardId = ''; // TODO: fix it

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
                    'CardId=' + savedCardId + ';' +
                    'SecureCode=' +  card.code.value + ';' +
                    'TotalAmount=' + meta.curTotalAmount;
            }

            //console.log(dataString);

            var form = document.createElement('form'),
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