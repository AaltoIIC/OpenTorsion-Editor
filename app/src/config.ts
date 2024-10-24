const devUrl = 'http://localhost:5000';
const prodUrl = 'http://api.opentorsion.org';

const API_URL = process.env.NODE_ENV === 'production' ? prodUrl : devUrl;

export { API_URL };