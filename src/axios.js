import axios from "axios";

axios.defaults.baseURL = 'http://10.20.32.16/:8080/auth'
axios.defaults.headers.common['Authorization'] = 'Bearer' + localStorage.getItem('token')
