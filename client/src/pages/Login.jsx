import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen bg-company-offWhite flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-company-green to-company-lightGreen"></div>
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <Leaf size={40} className="text-company-green" />
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-center text-company-dark mb-2">Chào mừng trở lại</h2>
        <p className="text-center text-company-dark/60 mb-8">Đăng nhập để tiếp tục với BioCane</p>
        
        {error && <div className="bg-company-red/10 text-company-red p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-company-dark mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-company-dark/40" size={20} />
              <input
                type="email"
                name="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-company-offWhite border border-company-dark/10 rounded-xl focus:outline-none focus:border-company-green focus:ring-1 focus:ring-company-green transition-all"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-medium text-company-dark">Mật khẩu</label>
              <a href="#" className="text-sm text-company-green hover:underline">Quên mật khẩu?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-company-dark/40" size={20} />
              <input
                type="password"
                name="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-company-offWhite border border-company-dark/10 rounded-xl focus:outline-none focus:border-company-green focus:ring-1 focus:ring-company-green transition-all"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" className="w-full btn-primary py-3 text-lg mt-4 shadow-lg shadow-company-green/30">
            Đăng nhập
          </button>
        </form>

        <p className="text-center mt-8 text-company-dark/70">
          Chưa có tài khoản? <Link to="/register" className="text-company-green font-semibold hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
