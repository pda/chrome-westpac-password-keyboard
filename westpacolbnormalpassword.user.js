// ==UserScript==
// @name           Westpac/Virgin OLB normal password input
// @namespace      http://paul.annesley.cc/
// @description    Emulates a normal password input box for Westpac and Virgin OLB
// @include        https://*/esis/Login/SrvPage
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

	// @see http://diveintogreasemonkey.org/patterns/add-css.html
	var addGlobalStyle = function(css) {
		var head = document.getElementsByTagName('head')[0],
			style = document.createElement('style');
		if (!head) return;
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	};

	addGlobalStyle(
		'#megapwd { margin-left:3px; width:84px; font-size:12px; border-color: black; }' +
		'#megapwd:focus { border-width: 2px; }'
	);

	var referenceRow,
		passwordRow = document.createElement('tr'),
		cellContent = ['',
			'<b><label for="megapwd">Enter Password: </label></b><br /><span style="color:gray;">Ignore the crap below</span>',
			'<input tabindex="2" id="megapwd" type="password" maxlength="6" class="pswd" />'
			];

	for (var i = 0; i < cellContent.length; i++)
	{
		var newCell = document.createElement('td');
		newCell.innerHTML = cellContent[i];
		newCell.className = 'Gtft';
		passwordRow.appendChild(newCell);
	}

	if (referenceRow = xpath("//input[@id='uName']/ancestor::tr[following-sibling::tr][1]").snapshotItem(0))
		referenceRow.parentNode.insertBefore(passwordRow, referenceRow.nextSibling);
	else if (referenceRow = xpath('//td/b[text()="1."]/ancestor::tr[1]').snapshotItem(0))
		referenceRow.parentNode.insertBefore(passwordRow, referenceRow);
	else return;

	var buttons = {},
		typedLetters = [],
		passwordInput = document.getElementById('megapwd'),
		signinButton = document.getElementById('signin');

	xpathMap('//input[@class="key"]', function(input) {
		buttons[input.name] = input;
	});

	var keyboardUpdate = function() {
		document.getElementById('pwd').value = '';
		passwordInput.value = typedLetters.join('');
		for (var i = 0; i < typedLetters.length; i++) {
			buttons[typedLetters[i]].click();
		}
	}

	var keyboardPress = function(letter, event) {
		var letter = letter.toUpperCase();
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

	passwordInput.addEventListener('keypress', function(event) {
		if (event.keyCode == 13) signinButton.click();
		else if (event.keyCode == 8) keyboardBackspace(event);
		else if (event.charCode && !event.altKey && !event.ctrlKey)
			keyboardPress(String.fromCharCode(event.charCode), event);
	}, false);

}());