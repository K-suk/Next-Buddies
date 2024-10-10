import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'; // 環境変数からAPIのベースURLを設定
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/jwt/create/`, {
      email,
      password,
    });
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const logout = async () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    try {
      const response = await axios.post(`${API_URL}/auth/jwt/refresh/`, { refresh: refreshToken });
      localStorage.setItem('accessToken', response.data.access);
      return response.data.access;
    } catch (error) {
      console.error('Error refreshing token:', error.response ? error.response.data : error.message);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
  return null;
};

export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/users/me/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        return await axios.get(`${API_URL}/auth/users/me/`, getAuthHeaders()).then((response) => response.data);
      }
    }
    throw error;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/auth/users/set_password/`, {
      current_password: currentPassword,
      new_password: newPassword,
    }, getAuthHeaders());
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        return await axios.post(`${API_URL}/auth/users/set_password/`, {
          current_password: currentPassword,
          new_password: newPassword,
        }, getAuthHeaders()).then((response) => response.data);
      }
    }
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/users/me/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        return await axios.get(`${API_URL}/auth/users/me/`, getAuthHeaders()).then((response) => response.data);
      }
    }
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const headers = {
      ...getAuthHeaders().headers,
      'Content-Type': 'multipart/form-data', // ファイルを送信するためにmultipart/form-dataに設定
    };

    // プロファイル更新リクエストを送信
    const response = await api.patch('/auth/users/me/', profileData, {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    // 401エラーが発生した場合、トークンをリフレッシュして再試行
    if (error.response && error.response.status === 401) {
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        const headers = {
          ...getAuthHeaders().headers,
          'Content-Type': 'multipart/form-data',
        };
        // トークンのリフレッシュ後に再試行
        return await api.patch('/auth/users/me/', profileData, { headers }).then((response) => response.data);
      }
    }
    // その他のエラーの場合はエラーメッセージを出力してスロー
    console.error('Error updating profile:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const addToQueue = async () => {
  try {
    const response = await axios.post(`${API_URL}/match/add-to-queue/`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error adding to queue:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const processMatching = async () => {
  try {
    const response = await axios.post(`${API_URL}/match/process-matching/`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error processing matching:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getCurrentMatch = async () => {
  try {
    const response = await axios.get(`${API_URL}/match/current-match/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching current match:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const submitReview = async (rating) => {
  try {
      console.log('Sending rating to server:', rating); // ここでサーバーに送信される前のratingを確認
      const response = await api.post('/match/submit-review/', { rating });
      return response.data.new_average_rating;
  } catch (error) {
      console.error('Error submitting review:', error.response ? error.response.data : error.message);
      throw error;
  }
};


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// この時点ではJWTトークンを含めない
api.interceptors.request.use(
  (config) => {
    // サインアップやログインリクエストにはAuthorizationヘッダーを含めない
    const isAuthRequest = config.url.includes('/auth/jwt/create/') || config.url.includes('/auth/users/');
    if (!isAuthRequest) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;