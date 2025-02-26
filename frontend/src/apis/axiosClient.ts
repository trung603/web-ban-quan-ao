import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'http://localhost:4000',
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
})

axiosClient.interceptors.request.use(
    function (config) {
        return config
    },
    function (error){
        return Promise.reject(error)
    }
)

axiosClient.interceptors.response.use(
    function (response){
        return response
    }
    ,
    function (error){
        return Promise.reject(error)
    }
)

export default axiosClient