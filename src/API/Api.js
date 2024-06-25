import axios from "axios";
import { AUTH_CONFIG } from "../constants/Path";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getData } from "../utils/helperFunctions";
import DeviceInfo from "react-native-device-info";
import { Platform } from "react-native";

export const STRIPE_KEY_TEST = "pk_test_51PTPUrAMQSsL63NIdFCMACL8k7nmhbEIuUQjGNE9oCPxGUCDOF5RRVHZ5bGmD4dFSHLQhZ7AYAJn0VTvgcNGo8fa00YEJSGpSI"
export const STRIPE_KEY = "pk_live_51PTPUrAMQSsL63NIxtlGIp3I9IdGkhOV7JBnPGS4WXbNhXm4k1mw7athFA2mAd51B8pgvJgr3G9nnFDgTKoxum8F00yJEeNGSh"
export const DUMMY_USER_URL = 'https://www.w3schools.com/howto/img_avatar.png';

export function MobileOTP(number, countryCode) {
  return axios.post(AUTH_CONFIG.BASE_URL + '/mobile-otp', { "phoneNumber": number, "countryCode": countryCode }).then(res => res.data)
}
export function MobileOTPVERIFY(number, otpInput) {
  return axios.post(AUTH_CONFIG.BASE_URL + '/mobile-otp-verify', { "phoneNumber": number, "otp": otpInput }).then(res => res.data)
}
export function Login(email, password) {
  return axios.post('https://plansaround-backend.vercel.app/api/mobile/auth/signin', { "email": email, "password": password }).then(res => res.data)
}
export function AppleLogin(data) {
  return axios.post('https://plansaround-backend.vercel.app/api/mobile/auth/apple-login', data).then(res => res.data)
}
export function GoogleLogin(data) {
  return axios.post('https://plansaround-backend.vercel.app/api/mobile/auth/google-login', data).then(res => res.data)
}

export function ForgotPasswordApi(email) {
  return axios.post('https://plansaround-backend.vercel.app/api/mobile/auth/forgot-password', { "email": email }).then(res => res?.data)
}

export function VerifyForgotPass(email, otp, password) {
  console.log(otp, password, email, 'VerifyForgotPass')
  return axios.post('https://plansaround-backend.vercel.app/api/mobile/auth/verify-forgot-password', { "email": email, "otp": otp, "password": password }).then(res => res.data)
}



export async function EmailRegister(email, password) {
  let usertoken = await getData('UserToken');
  console.log(usertoken);
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
    'Content-Type': "application/json",
  };
  return axios.post(AUTH_CONFIG.BASE_URL + '/email-otp', { "email": email, "password": password }, { headers }).then(res => res.data)
}

export async function EmailOtpverify(otp) {
  let usertoken = await getData('UserToken');
  console.log(otp, 'otp aaya')
  console.log(usertoken);
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
    'Content-Type': "application/json",
  };
  return axios.post(AUTH_CONFIG.BASE_URL + '/email-otp-verify', { "otp": otp }, { headers }).then(res => res.data)
}




export async function LocationTwo(latitude, longitude) {
  let usertoken = await getData('UserToken');
  // console.log(usertoken);
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
    'Content-Type': "application/json",
  };
  return axios.post(AUTH_CONFIG.BASE_URL + '/location',
    {
      "latitude": latitude,
      "longitude": longitude

    }, { headers }).then(res => res.data)
}


export async function getGender(showonprofile, gender) {
  let usertoken = await getData('UserToken');
  console.log(usertoken);
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
    'Content-Type': "application/json",
  };
  return axios.post(AUTH_CONFIG.BASE_URL + '/gender',
    {
      "gender": gender,
      "showOnProfile": showonprofile

    }, { headers }).then(res => res.data)
}


export async function getBio(description) {
  let usertoken = await getData('UserToken');
  console.log(usertoken);
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
    'Content-Type': "application/json",
  };
  return axios.post(AUTH_CONFIG.BASE_URL + '/bio',
    {
      "description": description
    }, { headers }).then(res => res.data)

}
export async function getUniversity(Uni, Degree, showProfile) {
  let usertoken = await getData('UserToken');
  console.log(usertoken);
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
    'Content-Type': "application/json",
  };
  return axios.post(AUTH_CONFIG.BASE_URL + '/study',
    {
      "university": Uni,
      "degree": Degree,
      "showOnProfile": showProfile
    }, { headers }).then(res => res.data)
}

export async function getProfession(Name, title, CDegree, experience, showProfile) {
  let usertoken = await getData('UserToken');
  console.log(usertoken);
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
    'Content-Type': "application/json",
  };
  return axios.post(AUTH_CONFIG.BASE_URL + '/profession',
    {
      "name": Name,
      "title_profile": title,
      "company_degree": CDegree,
      "experience": experience,
      "showOnProfile": showProfile
    }, { headers }).then(res => res.data)
}

export async function getPoliticalBelief(Name, showProfile) {
  let usertoken = await getData('UserToken');
  console.log(usertoken);
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
    'Content-Type': "application/json",
  };
  return axios.post(AUTH_CONFIG.BASE_URL + '/political-belief',
    {
      "name": Name,
      "showOnProfile": showProfile
    }, { headers }).then(res => res.data)
}

export async function getReligiousBelief(Name, showProfile) {
  let usertoken = await getData('UserToken');
  console.log(usertoken);
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
    'Content-Type': "application/json",
  };
  return axios.post(AUTH_CONFIG.BASE_URL + '/religious-belief',
    {
      "name": Name,
      "showOnProfile": showProfile
    }, { headers }).then(res => res.data)
}


export async function getEventsList(Page) {
  console.log(Page, 'pagenumber')
  let usertoken = await getData('UserToken');
  // console.log(usertoken);
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
    'Content-Type': "application/json",
  };
  return axios.get(`https://plansaround-backend.vercel.app/api/mobile/homepage/events?page=${Page}`, { headers }).then(res => res.data)
}


export async function RequestBooking(Id, orderId) {
  let usertoken = await getData('UserToken');
  console.log(usertoken);
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
    'Content-Type': "application/json",
  };
  const url = `https://plansaround-backend.vercel.app/api/mobile/homepage/events/${Id}/request-to-book-event`
  console.log("url=======", url);
  return axios.post(url,orderId ? {orderId} : {}, { headers }).then(res => res.data)
}

export async function getDeviceToken() {
  let usertoken = await getData('UserToken');
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
  };
  return axios.get(`https://plansaround-backend.vercel.app/api/mobile/auth/firebase`, { headers }).then(res => res.data)
}

export async function addDeviceToken(deviceId) {
  let usertoken = await getData('UserToken');

  let fcmToken = await getData('fcmToken');
  const data = {
    "deviceId": deviceId,
    "deviceToken": fcmToken,
    "deviceType": Platform.OS
  }
  console.log("req=", data);
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
    'Content-Type': "application/json",
  };
  return axios.post(`https://plansaround-backend.vercel.app/api/mobile/auth/firebase`, data, { headers }).then(res => res.data)
}


export async function userSignOut() {
  let usertoken = await getData('UserToken');
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
  };
  const deviceId = await DeviceInfo.getUniqueId()
  return axios.get(`https://plansaround-backend.vercel.app/api/mobile/auth/signout?deviceId=${deviceId}`, { headers }).then(res => res.data)
}


export async function sendMessageApi(eventId, message) {
  let usertoken = await getData('UserToken');
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
    'Content-Type': "application/json",
  };
  console.log("{message}===", { message });
  return axios.post(`https://plansaround-backend.vercel.app/api/mobile/message/${eventId}`, { message }, { headers }).then(res => res.data)
}


export async function createStripeUserId() {
  let usertoken = await getData('UserToken');
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
  };
  return axios.post(`https://plansaround-backend.vercel.app/api/mobile/stripe/generate-user-stripe-id`, {}, { headers }).then(res => res.data)
}

export async function getEphemeralKey() {
  let usertoken = await getData('UserToken');
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
    'Content-Type': "application/json",
  };
  return axios.post(`https://plansaround-backend.vercel.app/api/mobile/stripe/create-setup-intent`, {}, { headers }).then(res => res.data)
}

export async function createPaymentIntent(amount) {
  let usertoken = await getData('UserToken');
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
    'Content-Type': "application/json",
  };
  const data = {
    "amount": `${amount * 100}`,
    "currency": "gbp",
    "gateway": "card"
  }
  return axios.post(`https://plansaround-backend.vercel.app/api/mobile/stripe/payment-intents`, data, { headers }).then(res => res.data)
}

// export async function BasicInformation(formdata){
//     let usertoken=await getData('UserToken');
//     console.log('yha',usertoken);
//     return axios.post(AUTH_CONFIG.BASE_URL+'/basic-inforamtion',{data:formdata}),{headers:{
//         "Authorization":`Bearer ${usertoken}`,
//         "Content-type":"multipart/form-data"
//     }}.then(res=>res.data)
// }


