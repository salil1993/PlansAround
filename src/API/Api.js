import axios from "axios";
import { AUTH_CONFIG } from "../constants/Path";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getData } from "../utils/helperFunctions";

export function MobileOTP(number, countryCode) {
  return axios.post(AUTH_CONFIG.BASE_URL + '/mobile-otp', { "phoneNumber": number, "countryCode": countryCode }).then(res => res.data)
}
export function MobileOTPVERIFY(number, otpInput) {
  return axios.post(AUTH_CONFIG.BASE_URL + '/mobile-otp-verify', { "phoneNumber": number, "otp": otpInput }).then(res => res.data)
}
export function Login(email, password) {
  return axios.post('https://plansaround-backend.vercel.app/api/mobile/auth/signin', { "email": email, "password": password }).then(res => res.data)
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


export async function RequestBooking(Id) {
  let usertoken = await getData('UserToken');
  console.log(usertoken);
  const headers = {
    'Authorization': `Bearer ${usertoken}`,
    'Content-Type': "application/json",
  };
  return axios.get(`https://plansaround-backend.vercel.app/api/mobile/homepage/events/${Id}/request-to-book-event`, { headers }).then(res => res.data)
}




// export async function BasicInformation(formdata){
//     let usertoken=await getData('UserToken');
//     console.log('yha',usertoken);
//     return axios.post(AUTH_CONFIG.BASE_URL+'/basic-inforamtion',{data:formdata}),{headers:{
//         "Authorization":`Bearer ${usertoken}`,
//         "Content-type":"multipart/form-data"
//     }}.then(res=>res.data)
// }


