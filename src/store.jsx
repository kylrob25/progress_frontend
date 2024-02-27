import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../src/features/userSlice'

export const store = configureStore({
    reducer: {
        user: userReducer
    }
})