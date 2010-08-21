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

	var xpathRemove = function(query) {
		var node = xpath(query).snapshotItem(0);
		node.parentNode.removeChild(node);
	};

	var divCustomer = xpath("//div[@class='uid']").snapshotItem(0);
	var divPassword = document.createElement('div');
	divPassword.className = 'uid';
	divPassword.style.marginTop = '-5px';
	divPassword.innerHTML =
		'<div class="left"><span class="login-info-message">Enter your password</span></div>' +
		'<div class="right"><input class="fancy" type="password" maxlength="6" id="password_temp" /></div>' +
		'<span class="cnr se"></span><span class="cnr sw"></span>';
	divCustomer.parentNode.insertBefore(divPassword, divCustomer.nextSibling);

	xpathRemove("//span[@class='login-info-message-small']");

	var buttons = {},
		typedLetters = [],
		passwordInput = document.getElementById('password_temp');

	xpathMap(
		'//div[@class="keypad"]//div[@class="keys"]/div/button',
		function(input) { buttons[input.innerText] = input; }
	);

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
		var button = document.getElementById('pwd_submit');
		if (!button) button = document.getElementById('btn-submit');
		button.click();
	};

	/* keyup for backspace, enter */
	passwordInput.addEventListener('keyup', function(event) {
		if (event.keyCode == 13) keyboardEnter(event); // pre Chrome 6
		else if (event.keyCode == 8) keyboardBackspace(event);
		this.focus();
	}, false);

	/* keypress for alpha-numeric with charCode access */
	passwordInput.addEventListener('keypress', function(event) {
		var modifier = event.altKey || event.ctrlKey || event.metaKey;
		if (event.keyCode == 13) keyboardEnter(event); // Chrome 6+
		else if (event.charCode && !modifier)
			keyboardPress(String.fromCharCode(event.charCode), event);
		this.focus();
	}, false);

}());
