
import axiosInstance from './axios'
import * as Types from '@/types';


export const authService = {
  register(form:Types.SignupForm) {
    return axiosInstance.post('/api/Auth/register',form)
  },
  login(form: Types.LoginForm) {
    return axiosInstance.post(`/api/Auth/login`, form)

  }

}
