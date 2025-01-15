import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8112/', // Set the base URL (includes port 5001)
  headers: {
    'Content-Type': 'application/json',
  }
})

export default instance