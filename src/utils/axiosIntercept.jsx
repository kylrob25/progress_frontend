import axios from 'axios'
import jwt_decode from 'jwt-decode'

const axiosIntercept = axios.create({
    baseURL: 'http://localhost:8080/api'
})

axiosIntercept.interceptors.request.use(
        async (config) => {
            const user = localStorage.getItem('user')

            if (user && user.token) {
                const valid = validateToken(user.token)

                if (!valid) {
                    // TODO: Refresh token
                }
            }
            return config
        }, (error) => {
            return Promise.reject(error)
    }
)

const validateToken = token => {
    const decoded = jwt_decode(token)
    const time = Date.now() / 1000
    return decoded.exp < time
};

export default axiosIntercept