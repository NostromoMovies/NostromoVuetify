import axiosInstance from './axios'
import * as Types from '@/types';
export const getService = {
  register() {
    return axiosInstance .get('/posts');
  },
  login(id: number) {
    return axiosInstance .get(`/posts/${id}`);
  },
  searchMedia(){
    return axiosInstance .get(`/api/MediaDisplay/searchMedia`);
  },
  getPoster(mediaType: string, id: number){
    return axiosInstance.get(`/api/File/download/tmdb/${mediaType}/${id}/poster`);
  },
  ///api/File/download/tmdb/{id}/poster
  fileJob(group: string,name:string ){
    return axiosInstance.get('/api/File/job/${group}/${name}/status');
  },
  setFolder (){
    return axiosInstance.get('/api/folders/sets');
  },
   testFolder (){
    return axiosInstance.get('/api/folders/test');
  },
  getMovieID (id: number){
    return axiosInstance.get('/api/Tmdb/movie/{id}');
  },
  getYears (){
    return axiosInstance.get('api/MediaDisplay/getYears');
  },
  getGenre(){
    return axiosInstance.get('api/MediaDisplay/getGenres')
  },
  createWatchList(title: string) {
    return axiosInstance.post('/api/WatchList/create', `"${title}"`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  createCollection(name) {
    return axiosInstance.post('api/Collection/create', { name });
  },
  addToWatchlist(watchListID: number, movieID: number) {
    return axiosInstance.post(`api/WatchList/${watchListID}/add/${movieID}`);
  },
  addToCollection(collectionId: number, movieId?: number, tvId?: number) {
    let url = `/api/Collection/${collectionId}/add-items?`;

    if (movieId !== undefined) {
      url += `movieIds=${movieId}`;
    }

    if (tvId !== undefined) {
      if (movieId !== undefined) {
        url += `&`;
      }
      url += `tvIds=${tvId}`;
    }

    return axiosInstance.post(url);
  },
  getWatchlists(userID: number) {
    return axiosInstance.get(`api/WatchList/${userID}/getAllWatchList`);
  },

  getGenreCount() {
    return axiosInstance.get('/api/MediaDisplay/getMovieCountGenre');
  },

  getVideoID(movieId: number) {
    return axiosInstance.get(`/api/MediaDisplay/${movieId}/getVideoID`);
  },

  getVideoStream(videoId: number) {
    return axiosInstance.get(`/api/media/stream/${videoId}`);
  },
  getMovieCount(){
    return axiosInstance.get('/api/MediaDisplay/getMovieCount');
  },
  addMovieToWatchlist(watchListID: number, movieId: number) {
    return axiosInstance.post(`/api/WatchList/${watchListID}/add/${movieId}`)
  },
  removeFromWatchlist(watchListID: number, movieID: number) {
    return axiosInstance.delete(`/api/WatchList/${watchListID}/remove/${movieID}`);
  } 

}
