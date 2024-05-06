// edit user profile
(function ($) {
  const editButton = $(".edit-profile");
  const addButton = $(".add-friend");
  const delButton = $(".delete-friend");

  // title is the div of avatar and username
  const title = $(".user-title");
  //modify is the div of current profile info
  const modify = $(".modify");

  let url = window.location.pathname;
  let id = url.substring(url.lastIndexOf("/") + 1);

  addButton.on("click", async (event) => {
    event.preventDefault();
    let userId = $(".logged-in-user-id").get(0).innerHTML;
    userId = helper.checkId(userId, "loggedInUserId");
    id = helper.checkId(id, "userId");

    if (!userId) {
      document.location.replace("/login");
    } else {
      const response = await fetch("/api/user", {
        method: "PATCH",
        body: JSON.stringify({ id2: id, isAdd: true }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        Swal.fire({
          title: "Added",
          text: "You have added the friend",
          icon: "success",
        });
        var delayInMilliseconds = 1000;

        setTimeout(function () {
          //your code to be executed after seconds
          document.location.replace("/user/" + id);
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
  });
  delButton.on("click", async (event) => {
    event.preventDefault();
    let userId = $(".logged-in-user-id").get(0).innerHTML;
    userId = helper.checkId(userId, "loggedInUserId");
    id = helper.checkId(id, "userId");

    if (!userId) {
      document.location.replace("/login");
    } else {
      const response = await fetch("/api/user", {
        method: "PATCH",
        body: JSON.stringify({ id2: id, isAdd: false }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        Swal.fire({
          title: "Deleted",
          text: "You have deleted the friend",
          icon: "success",
        });
        var delayInMilliseconds = 1000;

        setTimeout(function () {
          //your code to be executed after seconds
          document.location.replace("/user/" + id);
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
  });
  bind(editButton);
  function bind(editButton) {
    editButton.on("click", function (event) {
      event.preventDefault();
      let userId = $(".logged-in-user-id").get(0).innerHTML;
      if (!userId) {
        document.location.replace("/login");
      } else {
        editButton.remove();
        const form = $(`
<form>
    <div class="field is-horizontal">
        <div class="field-label  is-normal">
            <label class="label">Username</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control">
                    <input class="input username" type="text"
                        placeholder="no numbers, at least 5 characters long with a max of 12 characters">
                </div>
            </div>
        </div>
    </div>

    <div class="field is-horizontal">
        <div class="field-label  is-normal">
            <label class="label">Phone number</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control">
                    <input class="input phone" type="text"
                        placeholder="e.g. 1234567890">
                </div>
            </div>
        </div>
    </div>

    <div class="field is-horizontal">
        <div class="field-label is-normal">
            <label class="label">Avatar</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control">
                    <input class="input input-avatar" type="file" accept=".jpg">
                </div>
            </div>
        </div>
    </div>
    <div class="buttons is-pulled-right">
      <button class="button is-light cancel-user">
            Cancel
      </button>
        <button class="button is-dark update-user">
            Update
        </button>
    </div>
</form>`);
        modify.replaceWith(form);
        const cancel = $(".cancel-user");
        const update = $(".update-user");
        cancel.on("click", function (event) {
          event.preventDefault();
          form.replaceWith(modify);
          title.append(editButton);
          bind(editButton);
        });
        update.on("click", async function (event) {
          event.preventDefault();
          // client-side check
          try {
            const userId = helper.checkId(
              $(".logged-in-user-id").get(0).innerHTML,
              "loggedInUserId"
            );
            const username = helper.checkUsername($(".username").val());
            const phone = helper.checkPhone($(".phone").val());
            const avatar = helper.checkImage(
              $(".input-avatar").get(0).files[0]
            );

            const formData = new FormData();
            formData.append("username", username);
            formData.append("phone", phone);
            formData.append("avatar", avatar);

            const response = await fetch("/api/user/" + userId, {
              method: "PATCH",
              body: formData,
            });
            if (response.ok) {
              Swal.fire({
                title: "Submitted",
                text: "You have edited the profile!",
                icon: "success",
                confirmButtonText: "OK",
              });
              var delayInMilliseconds = 1000;

              setTimeout(function () {
                //your code to be executed after seconds
                document.location.replace("/user/" + userId);
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
        });
      }
    });
  }
})(jQuery); // jQuery is exported as $ and jQuery

const helper = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== "string") throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    return id;
  },
  //source: https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
  checkPhone(phone) {
    phone = phone.trim();
    if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/im.test(phone))
      return phone;
    else throw "Your phone number is not valid";
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
  checkImage(image) {
    if (!image) {
      throw "image is null";
    }
    return image;
  },
};
