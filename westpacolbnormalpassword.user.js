// ==UserScript==
// @name           Westpac/Virgin OLB normal password input
// @namespace      http://paul.annesley.cc/
// @description    Emulates a normal password input box for Westpac and Virgin OLB
// @include        https://*/esis/Login/SrvPage*
// ==/UserScript==

(function(){

	// @see http://diveintogreasemonkey.org/patterns/match-attribute.html
	var xpath = function(query) {
		return document.evaluate(query, document, null,
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	};

	var xpathMap = function(query, callback) {
		var nodes = xpath(query);
		for (var i = 0; i < nodes.snapshotLength; i++)
			callback(nodes.snapshotItem(i));
	};

	var divPassword = document.createElement('div');
	divPassword.className = 'uid';
	divPassword.style.marginTop = '-5px';
	divPassword.innerHTML =
		'<label>Your password</label>' +
		'<input class="fancy" type="password" maxlength="6" name="password_temp" id="password_temp" />' +
		'<span class="cnr se"></span><span class="cnr sw"></span>';

	var divCustomer = xpath("//div[@class='uid']").snapshotItem(0);
	divCustomer.parentNode.insertBefore(divPassword, divCustomer.nextSibling);

	var buttons = {},
		typedLetters = [],
		passwordInput = document.getElementById('password_temp');

	xpathMap('//div[@class="keypad"]/div[@class="numeric" or @class="alpha1" or @class="alpha2"]/button', function(input) {
		buttons[input.innerText] = input;
	});

	var buttonClear = xpath('//input[@class="btn password-clear"]').snapshotItem(0);

	var keyboardUpdate = function() {
		passwordInput.value = typedLetters.join('');
		buttonClear.click();
		for (var i = 0; i < typedLetters.length; i++) {
			buttons[typedLetters[i]].click();
		}
	};

	var keyboardPress = function(letter, event) {
		letter = letter.toUpperCase();
		if (buttons[letter]) {
			event.preventDefault();
			if (typedLetters.length < 6) typedLetters.push(letter);
			keyboardUpdate();
		}
	};

	var keyboardBackspace = function(event) {
		event.preventDefault();
		typedLetters.pop();
		keyboardUpdate();
	};

	var keyboardEnter = function(event) {
		event.preventDefault();
		keyboardUpdate();
		document.getElementById('btn-submit').click();
	}

	/* keyup for backspace, enter */
	passwordInput.addEventListener('keyup', function(event) {
		if (event.keyCode == 13) keyboardEnter(event);
		else if (event.keyCode == 8) keyboardBackspace(event);
		this.focus();
	}, false);

	/* keypress for alpha-numeric with charCode access */
	passwordInput.addEventListener('keypress', function(event) {
		if (event.charCode && !event.altKey && !event.ctrlKey)
			keyboardPress(String.fromCharCode(event.charCode), event);
		this.focus();
	}, false);

}());