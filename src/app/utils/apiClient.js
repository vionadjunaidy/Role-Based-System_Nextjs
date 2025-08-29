'use client';

const apiClient = {
  async request(path, options = {}) {
    const response = await fetch(`/api/proxy/${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  },
  async login(email, password) {
    return this.request('auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async signup(email, password, role) {
    return this.request('auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  },

  async logout() {
    const res = await fetch('/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Logout failed');
    }
    return res.json();
  },
  async getProfile() {
    return this.request('profile');
  },
};

export default apiClient;
