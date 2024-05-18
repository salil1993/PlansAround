import React from "react";
import navigationStrings from "./navigationStrings";
import * as Screens from '../Screens';
import TabRoutes from "./TabRoutes";

export default function (Stack) {
    return (
        <>
            <Stack.Screen
                name={navigationStrings.INITIAL_SCREEN}
                component={Screens.InitialScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.LOG_IN}
                component={Screens.Login}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.PHONE_NUMBERINPUT}
                component={Screens.PhoneNumberinput}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.OTP_INPUT}
                component={Screens.OtpInput}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.REGISTER}
                component={Screens.Register}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name={navigationStrings.EMAIL_VERIFY}
                component={Screens.OtpEmail}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name={navigationStrings.SETUP_ACCOUNT}
                component={Screens.SetUpaccount}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.BASIC_INFO}
                component={Screens.BasicInfo}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.SET_LOCATION}
                component={Screens.SetLocation}
                options={{ headerShown: false }}
            />
            {/* <Stack.Screen
                name={navigationStrings.SET_LOCATIONTWO}
                component={Screens.SetLocationTwo}
                options={{ headerShown: false }}
            /> */}
            <Stack.Screen
                name={navigationStrings.SELECT_GENDER}
                component={Screens.SelectGender}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.WRITE_BIO}
                component={Screens.WriteBio}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.WHERE_STUDY}
                component={Screens.WhereStudy}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.WHAT_DO}
                component={Screens.WhatDo}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.POLITICAL_BELIEF}
                component={Screens.PoliticalBelief}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.RELIGIOUS_BELIEF}
                component={Screens.ReligousBelief}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.INTERESTS}
                component={Screens.Interests}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.KYC_VERIFICATION}
                component={Screens.KycVerification}
                options={{ headerShown: false }}
            />











        </>
    );
}