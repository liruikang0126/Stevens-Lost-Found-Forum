//create post from client to API
const submitPostHandler = async (event) => {
  event.preventDefault();

  let title = document.querySelector(".subject-input").value;
  let content = document.querySelector(".content-input").value;

  const author_id = document.querySelector(".logged-in-user-id").innerHTML; //need id of logged in user
  if (!author_id) {
    alert(
      "You can't post if not logged in. Please logout and in again and then try again."
    );
  } else {
    try {
      // client-side validation
      title = helper.checkString(title, 100, "title");
      content = helper.checkString(content, 2000, "content");
      const response = await fetch("/api/post/", {
        method: "POST",
        body: JSON.stringify({ title, content, author_id }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        document.location.replace("/dashboard");
      } else {
        alert(
          "Failed to submit post. " +
            response.status +
            ": " +
            response.statusText
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
      document.location.replace("/dashboard");
    } else {
      alert(
        "Failed to delete post. " + response.status + ": " + response.statusText
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
};
