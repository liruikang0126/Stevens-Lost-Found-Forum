import { ObjectId } from "mongodb";
const exportedMethods = {
  format_time(date) {
    //'toLocaleTimeString()' method to format the time with custom parameters
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  },
  format_summary(content) {
    if (content.length > 300) {
      return content.substring(0, 300) + "...";
    } else {
      return content;
    }
  },
  isFriend(id, array) {
    return array.includes(id);
  },
  isLost(status) {
    return status === "lost";
  },
  isEqual(id1, id2) {
    return id1 === id2;
  },
  show_delete(id1, id2, isAdmin) {
    return id1 === id2 || isAdmin;
  },
  checkString(strVal, maxlen, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (strVal.length > maxlen)
      throw `Error: ${varName}'s length cannot exceed ${maxlen}`;
    return strVal;
  },
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
  //source: https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
  checkPhone(phone) {
    phone = phone.trim();
    if (
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone)
    )
      return phone;
    else throw "Your phone number is not valid";
  },
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== "string") throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },
  stringifyPost(post) {
    post._id = post._id.toString();
    post.author_id = post.author_id.toString();
    post.comments.map((e) => {
      e._id = e._id.toString();
      return e;
    });
    return post;
  },
  unstringifyPost(post) {
    post._id = new ObjectId(post._id);
    post.author_id = new ObjectId(post.author_id);
    post.comments.map((e) => {
      e._id = new ObjectId(e._id);
      return e;
    });
    return post;
  },
  filterArray(posts) {
    const packagedPosts = [];
    let currentPackage = [];
    for (let i = 0; i < posts.length; i++) {
      currentPackage.push(posts[i]);
      if ((i + 1) % 3 == 0 || posts.length - i <= 1) {
        if (currentPackage.length != 0) {
          packagedPosts.push(currentPackage);
        }
        currentPackage = [];
      }
    }
    return packagedPosts;
  },
  arrayDealer(posts) {
    // due to the HTML/CSS template for the blog, package the posts into a custom data structure
    // before sending to be rendered
    // posts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    // packagedPosts: [ [ 0 ], [ 1, 2 ], [ 3, 4 ], [ 5, 6 ], [ 7, 8 ], [ 9, 10 ] ]
    const packagedPosts = [];
    let currentPackage = [];
    for (let i = 0; i < posts.length; i++) {
      if (i == 0) {
        currentPackage.push(posts[i]);
        packagedPosts.push(currentPackage);
        currentPackage = [];
      } else {
        currentPackage.push(posts[i]);
      }
      //if i is odd or if 1 or less left
      if (i % 2 == 0 || posts.length - i <= 1) {
        if (currentPackage.length != 0) {
          packagedPosts.push(currentPackage);
        }
        currentPackage = [];
      }
    }
    return packagedPosts;
  },
  checkCategory(category) {
    const categoryList = ["Electronics", "Accessories", "Clothing", "Other"];
    if (!categoryList.includes(category)) {
      throw "category error";
    }
    return category;
  },
  checkLocation(location) {
    const locationList = ["Gateway South", "Gateway North", "Other"];
    if (!locationList.includes(location)) {
      throw "location error";
    }
    return location;
  },
  checkDate(date) {
    const d1 = new Date(date);
    const d2 = new Date();
    if (d1 > d2 || isNaN(d1)) throw "date error";
    return d1;
  },
  checkLOF(lostOrFound) {
    if (!lostOrFound == "lost" && !lostOrFound == "found") {
      throw "lostOrFound error";
    }
    return lostOrFound;
  },
  checkImage(image) {
    if (!image) {
      throw "image is null";
    }
    return image;
  },
  isEmptyArray(array) {
    return array.length == 0;
  },
};
export default exportedMethods;
