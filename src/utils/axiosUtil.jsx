import axios from 'axios'

const util = axios.create({
    baseURL: 'http://localhost:8080/api'
})

const getLocalUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null; // Assuming user is stored as a JSON string
};

const getToken = () => localStorage.getItem('token')

const getRefreshToken = () => localStorage.getItem('refreshToken')

const sendLoginRequest = (username, password) => util.post("/auth/login", {
    username: username,
    password: password
})

const sendRefreshRequest = () => util.post("/auth/refresh",{
    refreshToken: getRefreshToken()
})

const setLocalUser = (response) => {
    const user = {
        id: response.id,
        username: response.username,
        email: response.email,
        roles: response.roles
    };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
};

const login = async(username, password) => {
    try {
        const request = await sendLoginRequest(username, password)
        const response = request.data

        localStorage.setItem('token', response.token)
        localStorage.setItem('refreshToken', response.refreshToken)
        return setLocalUser(response)
    } catch (error){
        throw error
    }
}

const logout = async() => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
}

util.interceptors.request.use(
    (config) => {
        const token = getToken()
        if(token){
            config.headers["Authorization"] = 'Bearer ' + token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

util.interceptors.response.use(
    res=> res,
    async (error) => {
        const conf = error.config

        if (conf.url !== "/auth/login" && error.response){
            console.log(error.response.status)
            if(error.response.status === 401 && !conf._retry){
                conf._retry = true;

                try {
                    const request = await sendRefreshRequest()
                    const response = request.data

                    localStorage.setItem('token', response.token)
                    util.defaults.headers['Authorization'] = "Bearer " + response.token

                    return util(conf)
                } catch (err){
                    return Promise.reject(err)
                }
            }
        }
        return Promise.reject(error)
    }
)

export {getLocalUser, login, logout}
export default util