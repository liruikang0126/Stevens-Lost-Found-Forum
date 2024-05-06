$(document).ready(function () {
  $(".submit-button").on("click", function (event) {
    try {
      const lostOrFound = helper.checkLOF(
          $(":radio[name=lostOrFound]:checked").val()
        ),
        category = helper.checkCategory($("#category").val()),
        date1 = helper.checkDate($("#date1").val()),
        date2 = helper.checkDate($("#date2").val()),
        location = helper.checkLocation($("#location").val()),
        d1 = new Date(date1),
        d2 = new Date(date2);
      if (d1 > d2) {
        throw "End date is earlier than Start date";
      }
    } catch (e) {
      event.preventDefault();
      alert(e);
    }
  });
});

const helper = {
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
};
