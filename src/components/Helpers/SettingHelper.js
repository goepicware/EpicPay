/* eslint-disable */
import cookie from "react-cookies";
import $ from "jquery";
var base64 = require("base-64");

/* stripslashes  */
export const stripslashes = function (str) {
  if (str !== "" && typeof str !== undefined && typeof str !== "undefined") {
    str = str.replace(/\\'/g, "'");
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\0/g, "\0");
    str = str.replace(/\\\\/g, "\\");
    return str;
  }
};

/* show Alert */
export const showAlert = function (header, message, type, autoClose = "No") {
  if (autoClose === "No") {
    var icon = "";
    if (type === "success") {
      icon = "success";
    } else if (type === "success") {
      icon = "warning";
    } else {
      icon = "error";
    }
    Swal.fire({
      title: header,
      html: message,
      icon: icon,
      customClass: {
        confirmButton: "btn btn-primary waves-effect waves-light",
      },
      buttonsStyling: false,
    });
  } else {
    $("body").append(
      '<div class="white-popup mfp-hide popup_sec alert_popup custom-alrt-popupcls" ><div class="custom_alert"><div class="custom_alertin"><div class="alert_height"><div class="alert_header">' +
        header +
        '</div><div class="alert_body"><p>' +
        message +
        '</p><div class="alt_btns"></div></div></div></div></div></div>'
    );
    setTimeout(function () {
      autoClose.close();
    }, 1800);
  }
};

/* show Loader */
export const showLoader = function (divRef, type) {
  if (type === "class") {
    $("." + divRef)
      .addClass("loader-main-cls")
      .append(
        '<div class="spinner-border loader-sub-div" role="status"><span class="visually-hidden">Loading...</span></div>'
      );
  } else {
    $("#" + divRef)
      .addClass("loader-main-cls")
      .append(
        '<div class="spinner-border loader-sub-div" role="status"><span class="visually-hidden">Loading...</span></div>'
      );
  }
};

/* hide Loader */
export const hideLoader = function (divRef, type) {
  if (type === "class") {
    $("." + divRef).removeClass("loader-main-cls");
    $("." + divRef)
      .find(".loader-sub-div")
      .remove();
  } else {
    $("#" + divRef).removeClass("loader-main-cls");
    $("#" + divRef)
      .find(".loader-sub-div")
      .remove();
  }
};

/* sample funtion */
export const showPriceValue = function (price) {
  price = price !== "" ? parseFloat(price) : 0.0;
  var priceTxt = "$" + price.toFixed(2);
  return priceTxt;
};

export const userID = function () {
  return cookie.load("loginID");
};
export const CompanyID = function () {
  return cookie.load("companyID");
};

export const encodeValue = function (value) {
  if (value !== "") {
    return base64.encode(value);
  }
};

/* show Loader */
export const showLoaderLst = function (divRef, type) {
  if (type === "class") {
    $("." + divRef)
      .addClass("loader-main-cls")
      .append('<div class="loader-sub-div"></div>');
  } else {
    $("#" + divRef)
      .addClass("loader-main-cls")
      .append('<div class="loader-sub-div"></div>');
  }
};

/* hide Loader */
export const hideLoaderLst = function (divRef, type) {
  if (type === "class") {
    $("." + divRef).removeClass("loader-main-cls");
    $("." + divRef)
      .find(".loader-sub-div")
      .remove();
  } else {
    $("#" + divRef).removeClass("loader-main-cls");
    $("#" + divRef)
      .find(".loader-sub-div")
      .remove();
  }
};

export const ordinalSuffixOf = function (i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
};
