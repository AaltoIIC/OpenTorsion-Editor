const devUrl = 'http://localhost:5000';
const prodUrl = 'https://backend-1083378260149.europe-north1.run.app';
export const API_URL = process.env.NODE_ENV === 'production' ? prodUrl : devUrl;

export const twinBaseUrl = 'https://aaltoiic.github.io/oteditor-twinbase';