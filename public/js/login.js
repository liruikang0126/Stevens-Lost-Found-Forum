//try to log user in from client to API
const loginFormHandler = async (event) => {
  event.preventDefault();
  let email = document.querySelector(".username-input").value;
  let password = document.querySelector(".password-input").value;
  try {
    // client-side validation
    email = helper.checkEmail(email);
    password = helper.checkPassword(password);
    const response = await fetch("/api/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/");
    } else {
      alert("Failed to login. " + response.status + ": " + response.statusText);
    }
  } catch (e) {
    alert(e);
  }
};

//add event listeners
document
  .querySelector(".login-button")
  .addEventListener("click", loginFormHandler);

const helper = {
  checkEmail(email) {
    if (!email) throw `Error: You must supply an email!`;
    if (typeof email !== "string") throw `Error: email must be a string!`;
    // no strings with just spaces
    email = email.trim().toLowerCase();
    if (email.length < 5) {
      throw "Email's length is not enough.";
    }
    var regExp = /\S+@\S+\.\S+/; // source: https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
    if (!regExp.test(email)) {
      throw "Invalid email address";
    }
    return email;
  },
  hasSpace(myString) {
    return /\s/.test(myString);
  },
  checkRegex(string) {
    var checkSpecial = /[*@!#%&$()^~{}]+/.test(string),
      checkUpper = /[A-Z]+/.test(string),
      checkLower = /[\d]+/.test(string),
      r = false;
    if (checkUpper && checkLower && checkSpecial) {
      r = true;
    }
    return r;
  },
  checkPassword(strVal) {
    if (!strVal) throw `Error: You must supply a password!`;
    if (typeof strVal !== "string") throw `Error: password must be a string!`;
    // no strings with just spaces
    strVal = strVal.trim();
    // a minimum of 8 characters long
    if (strVal.length < 8)
      throw `Error: password should be a minimum of 8 characters long`;
    if (this.hasSpace(strVal)) {
      throw `Error: password should not contain space`;
    }
    // at least one uppercase character, one number and one special character
    if (!this.checkRegex(strVal)) {
      throw `Error: password should have at least one uppercase character, one number and one special character`;
    }
    return strVal;
  },
};
