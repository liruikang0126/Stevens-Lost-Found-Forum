//create post from client to API
const submitPostHandler = async (event) => {
  event.preventDefault();

  let title = document.querySelector(".subject-input").value;
  let lostOrFound = $(":radio[name=lostOrFound]:checked").val();
  let date = document.getElementById("date").value;
  let category = document.getElementById("category").value;
  let location = document.getElementById("location").value;
  let content = document.querySelector(".content-input").value;
  let image = document.getElementById("upload").files[0];
  let author_id = document.querySelector(".logged-in-user-id").innerHTML; //need id of logged in user
  author_id = helper.checkId(author_id, "author_id");

  if (!author_id) {
    alert(
      "You can't post if not logged in. Please logout and in again and then try again."
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

      const response = await fetch("/api/post/", {
        method: "POST",
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
          "Failed to submit post. " +
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

//delete post from client to API
const deletePostHandler = async (event) => {
  event.preventDefault();

  const deletePostId = event.target.getAttribute("data-id");
  if (deletePostId) {
    const response = await fetch("/api/post/" + deletePostId, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      Swal.fire({
        title: "Deleted",
        text: "You have deleted the report!",
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
        "Failed to delete post. " +
          response.status +
          ": " +
          (await response.json())
      );
    }
  }
};

//add event listeners
document
  .querySelector(".submit-post")
  .addEventListener("click", submitPostHandler);

const deleteButtons = document.querySelectorAll(".delete-post");
deleteButtons.forEach((el) =>
  el.addEventListener("click", (event) => deletePostHandler(event))
);

const helper = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== "string") throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    return id;
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
