import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'userData',
  initialState: {
    userData: {},
    userCurrentLocation: {},
    isLogin: false,
    // isOrganizerPro: false

  },
  reducers: {
    saveUserData: (state, action) => {
      console.log('action aaya', action.payload)
      state.userData = action.payload;
    },
    userStatus: (state, action) => {
      console.log('userstatus aaya', action.payload)
      state.isLogin = action.payload
    },
    userCurrentLocation: (state, action) => {
      console.log('currentLocation aayi', action.payload)
      state.userCurrentLocation = action.payload
    }
  },

})

export const { saveUserData, userStatus, userCurrentLocation } = authSlice.actions

export default authSlice.reducer