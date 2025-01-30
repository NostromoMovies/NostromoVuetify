
import axiosInstance from './axios'
import * as Types from '@/types';


export const filteringService = {
  filtered_highestRatings() {
    return axiosInstance.post('/api/MediaDisplay/filtered-highestRatings')
  },
  filtered_genres(genre_list: Types.Genre) {
    return axiosInstance.post(`/api/MediaDisplay/filtered-genre`,genre_list)

  }

}
