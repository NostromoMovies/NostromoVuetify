import axiosInstance from './axios'
import * as Types from '@/types';
export const getService = {
  register() {
    return axiosInstance .get('/posts') 
  },
  login(id: number) {
    return axiosInstance .get(`/posts/${id}`)  
  },
  searchMedia(){
    return axiosInstance .get(`/api/MediaDisplay/searchMedia`)  
  },
  getPoster(id: number){
    return axiosInstance .get(`/api/Movies/${id}/poster`)  
  },
  fileJob(group: string,name:string ){
    return axiosInstance.get('/api/File/job/${group}/${name}/status')  
  },
  setFolder (){
    return axiosInstance.get('/api/folders/sets')  
  },
   testFolder (){
    return axiosInstance.get('/api/folders/test')  
  }
}