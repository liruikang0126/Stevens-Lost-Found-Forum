//submit a comment on the client to api
const submitCommentHandler = async (event) => {
  event.preventDefault();

  let comment = document.querySelector(".comment-input").value;
  let author_id = document.querySelector(".logged-in-user-id").innerHTML; //need id of logged in user

  let post_id = document.querySelector(".current-post-id").innerHTML;

  if (!author_id) {
    document.location.replace("/login");
  } else {
    try {
      // client-side validation
      comment = helper.checkString(comment, 2000, "comment");
      post_id = helper.checkId(post_id, "post_id");

      const response = await fetch("/api/comment/", {
        method: "POST",
        body: JSON.stringify({ comment, post_id }),
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

  let deleteCommentId = event.target.getAttribute("data-id");
  let currentPostId = document.querySelector(".current-post-id").innerHTML;
  deleteCommentId = helper.checkId(deleteCommentId, "deleteCommentId");
  currentPostId = helper.checkId(currentPostId, "currentPostId");

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
};

const completePostHandler = async (event) => {
  event.preventDefault();
  let author_id = document.querySelector(".logged-in-user-id").innerHTML; //need id of logged in user
  let post_id = document.querySelector(".current-post-id").innerHTML;

  post_id = helper.checkId(post_id, "post_id");
  if (!author_id) {
    document.location.replace("/login");
  } else {
    const response = await fetch("/api/post/" + post_id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      Swal.fire({
        title: "Completed",
        text: "Thank you for joining us on this endeavor towards community assistance.",
        icon: "success",
      });
      var delayInMilliseconds = 1000;

      setTimeout(function () {
        //your code to be executed after seconds
        document.location.replace("/post/" + post_id);
        document.location.reload();
      }, delayInMilliseconds);
    } else {
      alert(
        "Failed to complete the post. " +
          response.status +
          ": " +
          (await response.json())
      );
    }
  }
};

//add event listeners
document
  .querySelector(".comment-submit")
  .addEventListener("click", submitCommentHandler);

const deleteLinks = document.querySelectorAll(".delete-comment");
deleteLinks.forEach((el) =>
  el.addEventListener("click", (event) => deleteCommentHandler(event))
);
if (document.querySelector(".complete")) {
  document
    .querySelector(".complete")
    .addEventListener("click", completePostHandler);
}

// edit comments using ajax
(function ($) {
  $(".edit-comment").on("click", function (event) {
    event.preventDefault();

    let commentId = $(this).attr("data-id");
    commentId = helper.checkId(commentId, "commentId");
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
        helper.checkString(newComment, 2000, "comment");
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
          `<span id="comment-{{_id}}-updatedAt">${helper.format_time(
            data.updatedAt
          )}<\span>`
        );
      });
    });
  });
})(jQuery); // jQuery is exported as $ and jQuery

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
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== "string") throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    return id;
  },
  format_time(date) {
    //'toLocaleTimeString()' method to format the time with custom parameters
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  },
};
