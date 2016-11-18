var
paytureErrorMessages = {
	default_error_0 : ['Не удалось произвести оплату. Пожалуйста, убедитесь в правильности ввода параметров и повторите попытку', 'Unfortunately, the payment from the card is impossible. Please try paying with another card'],
	default_error_1 : ['Не удалось оплатить 3DS картой. Пожалуйста, убедитесь в правильности ввода параметров и повторите попытку', 'Unfortunately, the payment from the 3DS card is impossible. Please try paying with another card'],
	default_error : ['К сожалению, в настоящее время платеж с данной карты невозможен. Попробуйте оплатить другой картой', 'Unfortunately, the payment from the card is impossible. Please try paying with another card'],
	amount_exceed : ['К сожалению, в настоящее время платеж с данной карты невозможен. Пожалуйста, свяжитесь со своим банком и попробуйте еще раз, либо воспользуйтесь другой картой', 'Unfortunately, the payment from the card is impossible. Please contact with your bank and try again, or use another card'],
	amount_exceed_balance : ['К сожалению, в настоящее время платеж с данной карты невозможен. Пожалуйста, свяжитесь со своим банком и попробуйте еще раз, либо воспользуйтесь другой картой', 'Unfortunately, the payment from the card is impossible. Please contact with your bank and try again, or use another card'],
	authentication_error : ['К сожалению, в настоящее время платеж с данной карты невозможен. Пожалуйста, свяжитесь со своим банком и попробуйте еще раз, либо воспользуйтесь другой картой', 'Unfortunately, the payment from the card is impossible. Please contact with your bank and try again, or use another card'],
	authorization_timeout : ['К сожалению, в настоящее время платеж с данной карты невозможен. Пожалуйста, свяжитесь со своим банком и попробуйте еще раз, либо воспользуйтесь другой картой', 'Unfortunately, the payment from the card is impossible. Please contact with your bank and try again, or use another card'],
	communicate_error : ['Возникла ошибка при передаче данных в МПС. Пожалуйста, повторите попытку', 'Communicate error. Please try again'],
	duplicate_order_id : ['Номер заказа уже использовался ранее. Пожалуйста, оформите новый заказ', 'Order number has been already used. Please make a new order'],
	fraud_error : ['К сожалению, в настоящее время платеж с данной карты невозможен. Пожалуйста, попробуйте оплатить другой картой', 'Unfortunately, the payment from the card is impossible. Please try paying with another card'],
	fraud_error_critical_card : ['К сожалению, в настоящее время платеж с данной карты невозможен. Пожалуйста, попробуйте оплатить другой картой', 'Unfortunately, the payment from the card is impossible. Please try paying with another card'],
	illegal_order_state : ['К сожалению, в настоящее время платеж с данной карты невозможен. Пожалуйста, попробуйте оплатить другой картой', 'Unfortunately, the payment from the card is impossible. Please try paying with another card'],
	issuer_blocked_card : ['К сожалению, в настоящее время платеж с данной карты невозможен. Пожалуйста, свяжитесь со своим банком и попробуйте еще раз, либо воспользуйтесь другой картой', 'Unfortunately, the payment from the card is impossible. Please contact with your bank and try again, or use another card'],
	issuer_card_fail : ['К сожалению, в настоящее время платеж с данной карты невозможен. Пожалуйста, свяжитесь со своим банком и попробуйте еще раз, либо воспользуйтесь другой картой', 'Unfortunately, the payment from the card is impossible. Please contact with your bank and try again, or use another card'],
	issuer_fail : ['К сожалению, в настоящее время платеж с данной карты невозможен. Пожалуйста, свяжитесь со своим банком и попробуйте еще раз, либо воспользуйтесь другой картой', 'Unfortunately, the payment from the card is impossible. Please contact with your bank and try again, or use another card'],
	issuer_limit_amount_fail : ['Сумма транзакции превышает лимит, заданный банком, выпустившим карту. Пожалуйста, измените лимит и повторите попытку', 'The issuing bank rejected the transaction. Please contact with your bank and try again, or use another card'],
	issuer_limit_count_fail : ['Превышен лимит на число транзакций, заданный банком, выпустившим карту. Пожалуйста, измените лимит и повторите попытку', 'The issuing bank rejected the transaction. Please contact with your bank and try again, or use another card'],
	issuer_limit_fail : ['Предпринята попытка, превышающая ограничения, заданные вашим банком на сумму или количество операций в определенный промежуток времени. Пожалуйста, измените ограничения и повторите попытку', 'The issuing bank rejected the transaction. Please contact with your bank and try again, or use another card'],
  issuer_timeout : ['Нет связи с банком, выпустившим карту. Пожалуйста, повторите попытку, либо воспользуйтесь другой картой', 'There is no connection with the issuing bank. Please try again, or use another card'],
	merchant_restriction : ['К сожалению, в настоящее время платеж с данной карты невозможен. Пожалуйста, попробуйте оплатить другой картой', 'Unfortunately, the payment from the card is impossible. Please try paying with another card'],
	processing_error : ['К сожалению, в настоящее время платеж с данной карты невозможен. Пожалуйста, свяжитесь со своим банком и попробуйте еще раз, либо воспользуйтесь другой картой', 'Unfortunately, the payment from the card is impossible. Please contact with your bank and try again, or use another card'],
	limit_exchaust : ['Время, отведенное для ввода данных, исчерпано. Пожалуйста, оформите новый заказ', 'Time of payment is over. Please make a new order'],
	order_time_out : ['К сожалению, время платежа (сессии) истекло. Пожалуйста, оформите новый заказ', 'Time of payment is over. Please make a new order'],
	wrong_card_pan : ['Неверный номер карты. Пожалуйста, повторите ввод данных', 'Incorrect card parameters.  Please repeat data entry'],
	wrong_card_info : ['Неверные параметры карты. Пожалуйста, повторите ввод данных', 'Incorrect card parameters. Please repeat data entry'],
	wrong_params : ['Неверные параметры карты. Пожалуйста, повторите ввод данных', 'Incorrect card parameters.  Please repeat data entry']
},
localeContents = {
	buy_tickets : ['Купить билеты', 'Buy'],
	buy : ['Купить', 'Buy'],
	another : ['другая', 'another'],
	save_your_card_number_and_when_the_next_purchase_you_will_not_need_enter_card_number : ['Сохраните номер вашей карты и при следующей покупке вам не придется вводить номер карты!', 'Save your card number and with your next purchase you will not need to enter your card number'],
	enter_card_number : ['Введите номер карты', 'Enter card number'],
	enter_valid_card_number : ['Введите правильный номер карты', 'Enter valid card number'],
	enter_correct_month : ['Введите правильный месяц', 'Enter correct month'],
	enter_correct_year : ['Введите правильный год', 'Enter correct year'],
	enter_cvv_cvc_code : ['Введите CVV/CVC код', 'Enter CVV/CVC code'],
	protected_by_ssl_verified_by_visa_and_mastercard_securecode : ['*Защищено сертификатом SSL. Сайт полностью отвечает стандартам безопасности платёжных систем Visa и MasterCard.', '*Protected by SSL. Verified by Visa and MasterCard Securecode'],
	pay_card_is_easier_now : ['Оплачивать картой теперь стало проще', 'Pay card is now easier'],
	card_number : ['Номер карты', 'Card number'],
	mm_yy : ['MM/ГГ', 'MM/YY'],
	save_card_data : ['Сохранить данные карты', 'Save card data'],
	save_card : ['Сохранить карту', 'Save card'],
	sum : ['Сумма', 'Sum'],
	sum_1 : ['Сумма', 'Sum'],
	last_three_signs_on_back_side_of_card : ['Последние 3 цифры на обратной стороне карты', 'Last three signs on the reverse side of card'],
	save_card_for_future_purchases : ['Сохранить карту для будущих покупок', 'Save card for future purchases'],
	save_card_for_quick_checkout : ['Запомнить карту для быстрой оплаты', 'Save card for quick checkout'],
	pay_for_ticket_in : ['Оплатите билет в течение ', 'Pay for ticket in '],
	minutes_to: ['минут (до ', 'minutes(to '],
	payment_by_credit_card : ['Оплата банковской картой', 'Payment by credit card'],
	after_several_minutes_you_will_be_redirected_to_the_shop_page_or_click : ['Через несколько секунд вы будете перемещены на страницу магазина или нажмите ', 'After several minutes you will be redirected to the shop page or click '],
	here : ['сюда ', 'here '],
	to_open_page : ['чтобы перейти без ожидания', 'to open page'],
	payment_by_rambler_kassa_credit_card : ['Оплата банковской картой Рамблер/Касса', 'Payment by Rambler/KASSA credit card'],
	pay : ['Оплатить', 'Pay']
};

function setErrorText() {
	var el = document.querySelectorAll('[data-error]'),
			paytureError = Object.keys(paytureErrorMessages);

	if (meta.error) {
		paytureError.forEach(function(errName,k) {
			if (paytureErrorMessages[errName][0] === meta.error) meta.error = paytureErrorMessages[errName][meta.language && meta.language == 'en' ? 1 : 0];
		})
	}

	el.forEach(function(item,i){
		var errorText = item.getAttribute('data-error');
		paytureError.forEach(function(errName,k) {
			if (paytureErrorMessages[errName][0] === errorText) {
				item.textContent = paytureErrorMessages[errName][meta.language && meta.language == 'en' ? 1 : 0];
				item.style.display = 'block';
			}
		})
	})
}

function setLocale() {
	setErrorText();

	if (meta.message && meta.message.ok) meta.message.ok = localeContents.payment_by_credit_card[meta.language && meta.language == 'en' ? 1 : 0];
	if (meta.noDiscountDescription) meta.noDiscountDescription = localeContents.save_card_for_quick_checkout[meta.language && meta.language == 'en' ? 1 : 0];

	var el = document.querySelectorAll('[data-contents], [data-title], [data-value], [data-placeholder]');
	el.forEach(function(item, i){
		var itemAttrs = item.dataset,
				itemAttrsNames = Object.getOwnPropertyNames(itemAttrs),
				getLocaleString = function getLocaleString(num){localeString = localeContents[itemAttrs[itemAttrsNames[num]]][meta.language && meta.language == 'en' ? 1 : 0]; return localeString};
		if (itemAttrsNames[0] === 'contents') {item.textContent = getLocaleString(0)}
		else {item.setAttribute(itemAttrsNames[0], getLocaleString(0) + (itemAttrsNames.length > 1 ? ' ' + getLocaleString(1) : ''))}
	})
}
(function ready(fn) {
	if (document.readyState != 'loading')fn();
	else document.addEventListener('DOMContentLoaded', fn);
}(setLocale));