import { createSlice } from '@reduxjs/toolkit'

const token = localStorage.getItem('token')
const userJson = localStorage.getItem('user')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token || null,
    user: userJson ? JSON.parse(userJson) : null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token
      state.user = action.payload.user
      localStorage.setItem('token', state.token)
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    logout: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer