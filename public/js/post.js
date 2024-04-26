//submit a comment on the client to api
const submitCommentHandler = async (event) => {
  event.preventDefault();
  let comment = document.querySelector(".comment-input").value;
  const author_id = document.querySelector(".logged-in-user-id").innerHTML; //need id of logged in user
  const post_id = document.querySelector(".current-post-id").innerHTML;

  if (!author_id) {
    document.location.replace("/login");
  } else {
    try {
      // client-side validation
      comment = helper.checkString(content, 2000, "comment");
      const response = await fetch("/api/comment/", {
        method: "POST",
        body: JSON.stringify({ comment, author_id, post_id }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        document.location.replace("/post/" + post_id + "#comment-section");
        document.location.reload();
      } else {
        alert(
          "Failed to submit comment. " +
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

//delete a comment on the client to api
const deleteCommentHandler = async (event) => {
  event.preventDefault();

  const deleteCommentId = event.target.getAttribute("data-id");
  const currentPostId = document.querySelector(".current-post-id").innerHTML;

  //next add delete logical
  if (deleteCommentId) {
    const response = await fetch("/api/comment/" + deleteCommentId, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      document.location.replace("/post/" + currentPostId + "#comment-section");
      document.location.reload();
    } else {
      alert(
        "Failed to delete post. " + response.status + ": " + response.statusText
      );
    }
  }
  //then add logic to hide this for (non) admins and current user
};

//add event listeners
document
  .querySelector(".comment-submit")
  .addEventListener("click", submitCommentHandler);

const deleteLinks = document.querySelectorAll(".delete-comment");
deleteLinks.forEach((el) =>
  el.addEventListener("click", (event) => deleteCommentHandler(event))
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
