import axios from 'axios'
import {jwtDecode} from 'jwt-decode'

const intercept = axios.create({
    baseURL: 'http://localhost:8080/api'
})

intercept.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('user')
        if (user){
            const token = user.token
            if(token){
                config.headers["Authorization"] = 'Bearer ' + token
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

intercept.interceptors.response.use(
    res=> res,
    async (error) => {
        const conf = error.config
        if (conf.url !== "/auth/login" && error.response){
            if(error.response.status === 401 && !conf._retry){
                conf._retry = true;

                try {
                    const user = localStorage.getItem('user')
                    if (user) {
                        const token = user.refreshToken
                        const response = intercept.post("/auth/refresh", {
                            refreshToken: token
                        })

                        const {accessToken} = response.data
                        user.token = accessToken
                        localStorage.setItem('user', user)

                        return intercept(conf)
                    }
                } catch (err){
                    return Promise.reject(err)
                }
            }
        }
    }
)

const validateToken = token => {
    const decoded = jwtDecode(token)
    const time = Date.now() / 1000
    return decoded.exp < time
};

export default intercept