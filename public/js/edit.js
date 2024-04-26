//update post via client by calling api
const submitPostHandler = async (event) => {
  event.preventDefault();

  let title = document.querySelector(".subject-input").value;
  let content = document.querySelector(".content-input").value;
  const author_id = document.querySelector(".logged-in-user-id").innerHTML; //need id of logged in user
  const post_id = document.querySelector(".current-post-id").innerHTML;

  if (!author_id) {
    alert(
      "You can't post if not logged in. Please logout and in again and then try again."
    );
  } else {
    try {
      // client-side validation
      title = helper.checkString(title, 100, "title");
      content = helper.checkString(content, 2000, "content");
      //'just need to get correct id
      const response = await fetch("/api/post/" + post_id, {
        method: "PUT",
        body: JSON.stringify({ title, content, author_id }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        document.location.replace("/dashboard");
      } else {
        alert(
          "Failed to update post. " +
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

//add event listeners
document
  .querySelector(".edit-submit")
  .addEventListener("click", submitPostHandler);

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
