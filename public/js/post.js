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
      comment = helper.checkString(comment, 2000, "comment");
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
            (await response.json())
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
        "Failed to delete post. " +
          response.status +
          ": " +
          (await response.json())
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

// edit comments using ajax
(function ($) {
  $(".edit-comment").on("click", function (event) {
    event.preventDefault();
    const commentId = $(this).attr("data-id");
    const comment = $(`#comment-${commentId}`);
    let element = $(
      `<div class="field" id="comment-${commentId}-element">
        <div class="control">
            <textarea class="textarea comment-input" id="comment-${commentId}-edit"
                ">${comment.text()}</textarea>
        </div>
      </div> 
      <div class="buttons is-right">
            <button id="comment-${commentId}-cancel" class="button ">Cancel</button>
            <button id="comment-${commentId}-submit" class="button is-primary">Save changes</button>    </div>  `
    );
    const commentDiv = $(`#comment-${commentId}-div`);
    if ($(`#comment-${commentId}-element`).length == 0) {
      commentDiv.append(element);
    }
    $(`#comment-${commentId}-cancel`).on("click", function () {
      element.remove();
    });
    $(`#comment-${commentId}-submit`).on("click", function () {
      let newComment = $(`#comment-${commentId}-edit`).val();
      element.remove();
      try {
        checkString(newComment, 2000, "comment");
      } catch (e) {
        alert(e);
      }
      let requestConfig = {
        method: "PUT",
        url: "/api/comment/" + commentId,
        contentType: "application/json",
        data: JSON.stringify({
          content: newComment,
        }),
      };
      $.ajax(requestConfig).then(function (responseMessage) {
        let data = responseMessage;
        comment.replaceWith(
          `<span id="comment-${commentId}">${data.content}<\span>`
        );
        $(`#comment-${commentId}-updatedAt`).replaceWith(
          `<span id="comment-{{_id}}-updatedAt">${format_time(
            data.updatedAt
          )}<\span>`
        );
      });
    });
  });
})(jQuery); // jQuery is exported as $ and jQuery

function format_time(date) {
  //'toLocaleTimeString()' method to format the time with custom parameters
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

function checkString(strVal, maxlen, varName) {
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (strVal.length > maxlen)
    throw `Error: ${varName}'s length cannot exceed ${maxlen}`;
  return strVal;
}
