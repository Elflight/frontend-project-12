import { createSlice } from '@reduxjs/toolkit'

const tokenFromStorage = localStorage.getItem('token')
const usernameFromStorage = localStorage.getItem('username')

const initialState = {
    token: tokenFromStorage,
    username: usernameFromStorage,
    isAuthorized: !!tokenFromStorage
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            const { token, username } = action.payload
            state.token = token
            state.username = username
            state.isAuthorized = true
            localStorage.setItem('token', token)
            localStorage.setItem('username', username)
        },
        logout: (state) => {
            state.token = null
            state.username = null
            state.isAuthorized = false
            localStorage.removeItem('token')
            localStorage.removeItem('username')
        }
    }
})

export const {login, logout} = authSlice.actions
export default authSlice.reducer