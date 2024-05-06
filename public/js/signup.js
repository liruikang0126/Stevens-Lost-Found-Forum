//attempt to sign the user up
const signupFormHandler = async (event) => {
  event.preventDefault();

  let username = document.querySelector(".username-input").value;
  let email = document.querySelector(".email-input").value;
  let password = document.querySelector(".password-input").value;
  let confirmPassword = document.getElementById("confirmPassword").value;
  let role = $(":radio[name=role]:checked").val();
  let is_admin = role == "admin";

  try {
    // client-side validation
    username = helper.checkUsername(username);
    email = helper.checkEmail(email);
    password = helper.checkPassword(password, "password");
    confirmPassword = helper.checkPassword(confirmPassword, "confirmPassword");
    is_admin = helper.checkIsAdmin(is_admin);
    if (confirmPassword !== password) {
      throw "Comfirm password is not same as Password";
    }
    // The Fetch API is a JavaScript function that you can use
    // to send a request to any Web API URL and get a response.
    const response = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({ username, email, password, is_admin }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      Swal.fire({
        title: "Registered",
        text: "You have signed up successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      var delayInMilliseconds = 1000;

      setTimeout(function () {
        //your code to be executed after seconds
        document.location.replace("/login");
      }, delayInMilliseconds);
    } else {
      alert(
        "Failed to sign up. " + response.status + ": " + (await response.json())
      );
    }
  } catch (e) {
    alert(e);
  }
};

//add event listeners
document
  .querySelector(".signup-button")
  .addEventListener("click", signupFormHandler);

const helper = {
  checkIsAdmin(isAdmin) {
    if (typeof isAdmin !== "boolean")
      throw `Error: You must supply a boolean isAdmin`;
    return isAdmin;
  },
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
  checkPassword(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    // no strings with just spaces
    strVal = strVal.trim();
    // a minimum of 8 characters long
    if (strVal.length < 8)
      throw `Error: ${varName} should be a minimum of 8 characters long`;
    if (this.hasSpace(strVal)) {
      throw `Error: ${varName} should not contain space`;
    }
    // at least one uppercase character, one number and one special character
    if (!this.checkRegex(strVal)) {
      throw `Error: ${varName} should have at least one uppercase character, one number and one special character`;
    }
    return strVal;
  },
  hasNumber(myString) {
    return /\d/.test(myString);
  },
  checkUsername(strVal) {
    // For Name, it should be a valid string (should not contain numbers)
    // and should be at least 5 characters long with a max of 12 characters
    // If it fails any of those conditions, you will throw an error.
    if (!strVal) throw `Error: You must supply a username!`;
    if (typeof strVal !== "string") throw `Error: username must be a string!`;
    strVal = strVal.trim();
    if (strVal.length > 20 || strVal.length < 5)
      throw `Error: username should be at least 5 characters long with a max of 20 characters`;
    if (this.hasNumber(strVal)) {
      throw `Error: username should not contain numbers`;
    }
    return strVal;
  },
};
