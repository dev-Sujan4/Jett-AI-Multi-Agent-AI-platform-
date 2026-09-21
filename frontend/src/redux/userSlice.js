import { createSlice } from "@reduxjs/toolkit";

 const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    showLoginPrompt: false,
  },
  reducers: {
    setUserdata: (state, action) => {
      state.userData = action.payload;
    },
    setShowLoginPrompt: (state, action) => {
      state.showLoginPrompt = action.payload;
    },
  },
});

export const { setUserdata, setShowLoginPrompt } = userSlice.actions;
export default userSlice.reducer;