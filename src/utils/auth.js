// src/utils/auth.js
export const logoutUser = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // 重定向到登录页面
  };