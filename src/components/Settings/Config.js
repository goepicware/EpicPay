/* Live */
//export const unquieID = "59145A47-4517-41B4-9D92-F6BA15DB571A";
export const unquieID = (localStorage.getItem('company_app_id') === null || localStorage.getItem('company_app_id') === undefined) ? '' : localStorage.getItem('company_app_id');
export const companyLogo = (localStorage.getItem('company_logo') === null || localStorage.getItem('company_logo') === undefined) ? '' : localStorage.getItem('company_logo');
export const apiUrl = "https://walletapi.goepicware.com/api/";

//export const baseUrl = "http://localhost:3000/";
export const baseUrl = "https://epicpay.goepicware.com/";

export const deliveryId = "634E6FA8-8DAF-4046-A494-FFC1FCF8BD11";
export const pickupId = "718B1A92-5EBB-4F25-B24D-3067606F67F0";
export const CountryName = "Indonesia";
export const productNoImg = "/img/product-noimg.jpg";
export const companyName = "UV";
export const currency = "RP";
export const stripeReference = "goepicware";