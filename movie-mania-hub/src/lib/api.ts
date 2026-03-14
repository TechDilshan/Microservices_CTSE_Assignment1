import axios from 'axios';

const API_BASE = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/api/users/login', data),
  register: (data: { name: string; email: string; password: string; phone: string }) => api.post('/api/users/register', data),
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data: { name?: string; phone?: string }) => api.put('/api/users/profile', data),
  deleteProfile: () => api.delete('/api/users/profile'),
};

// Users (Admin/HallOwner)
export const usersApi = {
  getAll: () => api.get('/api/users'),
  getHallOwners: () => api.get('/api/users/hall-owners'),
  createHallOwner: (data: { name: string; email: string; password: string; phone: string }) => api.post('/api/users/hall-owners', data),
  getById: (id: string) => api.get(`/api/users/${id}`),
  update: (id: string, data: { name?: string; phone?: string }) => api.put(`/api/users/${id}`, data),
  delete: (id: string) => api.delete(`/api/users/${id}`),
};

// Halls
export const hallsApi = {
  getAll: () => api.get('/api/halls'),
  getByOwner: (ownerId: string) => api.get(`/api/halls/owner/${ownerId}`),
  getById: (id: string) => api.get(`/api/halls/${id}`),
  create: (data: { hallOwnerId: string; name: string; location: string; hallImageUrl?: string }) => api.post('/api/halls', data),
  update: (id: string, data: { name?: string; location?: string; hallImageUrl?: string }) => api.put(`/api/halls/${id}`, data),
  delete: (id: string) => api.delete(`/api/halls/${id}`),
  getSeatBlock: (hallId: string) => api.get(`/api/halls/${hallId}/seat-block`),
  getSeatLayout: (hallId: string) => api.get(`/api/halls/${hallId}/seat-layout`),
  updateSeatBlock: (hallId: string, data: { numSeats: Record<string, number>; odc: { rows: number; columns: number } }) => api.put(`/api/halls/${hallId}/seat-block`, data),
};

// Movies
export const moviesApi = {
  getAll: (hallId?: string) => api.get('/api/movies', { params: hallId ? { hallId } : {} }),
  getById: (id: string) => api.get(`/api/movies/${id}`),
  create: (data: any) => api.post('/api/movies', data),
  update: (id: string, data: any) => api.put(`/api/movies/${id}`, data),
  delete: (id: string) => api.delete(`/api/movies/${id}`),
};

// Bookings
export const bookingsApi = {
  create: (data: { hallId: string; movieId: string; showTime: string; date: string; seats: string[] }) => api.post('/api/bookings', data),
  getAvailableSeats: (params: { hallId: string; movieId: string; date: string; showTime: string }) => api.get('/api/bookings/available-seats', { params }),
  getUserBookings: () => api.get('/api/bookings/user'),
  getAll: () => api.get('/api/bookings'),
  getById: (id: string) => api.get(`/api/bookings/${id}`),
  update: (id: string, data: any) => api.put(`/api/bookings/${id}`, data),
  delete: (id: string) => api.delete(`/api/bookings/${id}`),
  pay: (id: string, data: { amount: number; method: string }) => api.post(`/api/bookings/${id}/pay`, data),
  getPayments: () => api.get('/api/bookings/payments'),
  updatePaymentStatus: (paymentId: string, data: { status: string }) => api.put(`/api/bookings/payments/${paymentId}/status`, data),
  deletePayment: (paymentId: string) => api.delete(`/api/bookings/payments/${paymentId}`),
};

// Payments
export const paymentsApi = {
  getAll: () => api.get('/api/payments'),
  getById: (id: string) => api.get(`/api/payments/${id}`),
  getByBooking: (bookingId: string) => api.get(`/api/payments/booking/${bookingId}`),
  updateStatus: (id: string, status: string) => api.put(`/api/payments/${id}/status?status=${status}`),
  delete: (id: string) => api.delete(`/api/payments/${id}`),
};

export default api;
