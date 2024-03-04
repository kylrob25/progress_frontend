import axios from 'axios'

const axiosIntercept = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
})

axiosIntercept.interceptors.response.use(
    response => response,
    async error => {
        if (error.response.status === 401 && !error.config._retry){
            error.config._retry = true

            try {
                await axios.post("http://localhost:8080/api/auth/refresh", {withCredentials: true})
                return axiosIntercept(error.config)
            } catch (error){
                return Promise.reject(error)
            }
        }
        return Promise.reject(error)
    }
)

export default axiosIntercept