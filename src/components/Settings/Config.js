/* Live */
export const unquieID =
  localStorage.getItem("company_app_id") === null ||
  localStorage.getItem("company_app_id") === undefined
    ? ""
    : localStorage.getItem("company_app_id");
export const companyLogo =
  localStorage.getItem("company_logo") === null ||
  localStorage.getItem("company_logo") === undefined
    ? ""
    : localStorage.getItem("company_logo");
export const apiUrl = "https://walletapi.goepicware.com/api/";
var accesstoken = {
  Authorization: localStorage.getItem("token"),
};

export const headerconfig = {
  headers: accesstoken,
};

export const baseUrl = "http://localhost:3001/";
//export const baseUrl = "https://epicpay.goepicware.com/";

export const stripeReference = "epicpay";
