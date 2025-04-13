import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserDTO {
  id: number;
  name: string;
  lastname: string;
  username: string;
  createdAt: string;
  email: string;
  role: string;
}

interface AuthState {
  user: UserDTO | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserDTO; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;