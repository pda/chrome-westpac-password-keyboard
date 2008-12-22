// ==UserScript==
// @name           Westpac/Virgin OLB normal password input
// @namespace      http://paul.annesley.cc/
// @description    Emulates a normal password input box for Westpac and Virgin OLB
// @include        https://*/esis/Login/SrvPage
// ==/UserScript==

(function()
{
	PdaWestpac = {

		buttons: {},

		init: function(){
			this.getButtons();
			this.addTr();
			this.input = document.getElementById('pda-password');
			this.addJs();
		},

		getButtons: function(){
			inputs = document.getElementsByTagName('input');
			for (var i = 0; i < inputs.length; i++)
			{
				if (inputs[i].className != 'key') continue;
				this.buttons[inputs[i].name] = inputs[i];
			}
		},

		addJs: function(){
			this.input.addEventListener('keypress', this.passwordInput, false);
			this.input.addEventListener('blur', this.focusStyle, false);
			this.input.addEventListener('focus', this.focusStyle, false);
		},

		focusStyle: function(e){
			this.style.borderWidth = (e.type == 'blur') ? 1 : 2;
		},

		passwordInput: function(e){
			if (e.keyCode == 13) return document.getElementById('signin').click();
			else if (e.keyCode == 8) return PdaWestpac.reset();
			else if (e.charCode && !e.altKey && !e.ctrlKey)
				PdaWestpac.clickButton(String.fromCharCode(e.charCode));
		},

		reset: function(){
			document.getElementById('pwd').value='';
			this.input.value="";
		},

		getTr: function(){
			var tr = document.createElement('tr');

			tdcontents = [
				'',
				'<b><label for="pda-password">Enter Password: </label></b><br /><span style="color:gray;">Ignore the crap below</span>',
				'<input tabindex="2" id="pda-password" type="password" maxlength="6" class="pswd" style="margin-left:3px; width:92px; font-size:12px;" />'
			];

			for (var i=0; i<tdcontents.length; i++)
			{
				var td = document.createElement('td');
				td.innerHTML = tdcontents[i];
				td.className = 'Gtft';
				tr.appendChild(td);
			}

			return tr;
		},

		addTr: function(){
			var ref = document.getElementById('uName').parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;

			ref.parentNode.insertBefore(
				this.getTr(),
				ref.nextSibling.nextSibling
			);
		},

		clickButton: function(letter){
			letter = letter.toUpperCase();
			if (this.buttons[letter]) this.buttons[letter].click();
		}

	};

	PdaWestpac.init();

}
)();
