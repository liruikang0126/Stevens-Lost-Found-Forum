//update post via client by calling api
const submitPostHandler = async (event) => {
  event.preventDefault();

  let title = document.querySelector(".subject-input").value;
  let content = document.querySelector(".content-input").value;
  let lostOrFound = $(":radio[name=lostOrFound]:checked").val();
  let date = document.getElementById("date").value;
  let category = document.getElementById("category").value;
  let location = document.getElementById("location").value;
  let image = document.getElementById("upload").files[0];

  const author_id = document.querySelector(".logged-in-user-id").innerHTML; //need id of logged in user
  const post_id = document.querySelector(".current-post-id").innerHTML;

  if (!author_id) {
    alert(
      "You can't edit if not logged in. Please logout and in again and then try again."
    );
  } else {
    try {
      // client-side validation
      title = helper.checkString(title, 100, "title");
      content = helper.checkString(content, 2000, "content");
      category = helper.checkCategory(category);
      location = helper.checkLocation(location);
      date = helper.checkDate(date);
      lostOrFound = helper.checkLOF(lostOrFound);
      image = helper.checkImage(image);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("lostOrFound", lostOrFound);
      formData.append("date", date);
      formData.append("category", category);
      formData.append("location", location);
      formData.append("content", content);
      formData.append("image", image);
      formData.append("author_id", author_id);

      const response = await fetch("/api/post/" + post_id, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        Swal.fire({
          title: "Submitted",
          text: "You have submitted the report!",
          icon: "success",
          confirmButtonText: "OK",
        });
        var delayInMilliseconds = 1000;

        setTimeout(function () {
          //your code to be executed after seconds
          document.location.replace("/dashboard");
        }, delayInMilliseconds);
      } else {
        alert(
          "Failed to update post. " +
            response.status +
            ": " +
            (await response.json())
        );
      }
    } catch (e) {
      alert(e);
    }
  }
};

//add event listeners
document
  .querySelector(".edit-submit")
  .addEventListener("click", submitPostHandler);

document.querySelector("#cancel").addEventListener("click", (event) => {
  event.preventDefault();
  document.location.replace("/dashboard");
});

const helper = {
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
};
