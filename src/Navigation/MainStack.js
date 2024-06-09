import React from "react";
import navigationStrings from "./navigationStrings";
import * as Screens from '../Screens';
import TabRoutes from './TabRoutes';

export default function (Stack) {
    return (
        <>
            <Stack.Screen
                name={navigationStrings.TABROUTES}
                component={TabRoutes}
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
            <Stack.Screen
                name={navigationStrings.EVENTS_ATTTENDING}
                component={Screens.EventsAttending}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.EVENTS_HOSTING}
                component={Screens.EventHosting}
                options={{ headerShown: false }}
            />
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
                name={navigationStrings.EVENTS_ATTENDED}
                component={Screens.EventAttended}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.EVENTS_HOSTED}
                component={Screens.EventHosted}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.HOST_EVENT}
                component={Screens.HostEvent}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.USER_PROFILE}
                component={Screens.UserProfile}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.EDITEVENT}
                component={Screens.EditEvent}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.LIVEVENTS}
                component={Screens.LiveEvents}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.ALLPLANS}
                component={Screens.AllPlans}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.PLANSDETAILS}
                component={Screens.PlansDetails}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.PEOPLE}
                component={Screens.People}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.SCANNER}
                component={Screens.CamScanner}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.SETTINGS}
                component={Screens.Settings}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.REKYC}
                component={Screens.Rekyc}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.HOMEEVENTDETAILS}
                component={Screens.HomeEventDetails}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.SHOWONMAP}
                component={Screens.ShowonMap}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.EVENTREQUESTED}
                component={Screens.EventRequested}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.PACKAGEPURCHASED}
                component={Screens.PackagePurchased}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.ORGPROFILE}
                component={Screens.OrgProfile}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.EVENTREJECTED}
                component={Screens.EventRejected}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.EVENTCANCELED}
                component={Screens.EventCancled}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.APPROVEDPARTICIPANTS}
                component={Screens.ApprovedParticipants}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.REJECTEDPARTICIPANTS}
                component={Screens.RejectedParticipants}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.PENIDNGREQUEST}
                component={Screens.PendingRequest}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.NOTIFICATION_LIST}
                component={Screens.NotificationList}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.ACCOUNT_INFO}
                component={Screens.AccountInfo}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={navigationStrings.HELP_SUPPORT}
                component={Screens.HelpSupport}
                options={{ headerShown: false }}
            />
            {/* <Stack.Screen
                name={navigationStrings.PORFILE_EDIT}
                component={Screens.ProfileEdit}
                options={{ headerShown: false }}

            /> */}
            {/* <Stack.Screen
                name={navigationStrings.LINKS}
                component={Screens.Links}
                options={{ headerShown: false }}

            />
              <Stack.Screen
                name={navigationStrings.ADD_POST}
                component={Screens.AddPost}
                options={{ headerShown: false }}

            /> */}

        </>
    );
}