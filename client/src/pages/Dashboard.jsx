import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, LogOut, Plus, Edit2, Trash2, X } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    image: '',
    imageFile: null
  });


  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get('/api/team');
      setMembers(res.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách thành viên:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        role: member.role,
        email: member.email || '',
        image: member.image || '',
        imageFile: null
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role: '',
        email: '',
        image: '',
        imageFile: null
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });

      if (editingMember) {
        await axios.put(`/api/team/${editingMember._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('/api/team', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      console.error('Lỗi khi lưu thành viên:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      try {
        await axios.delete(`/api/team/${id}`);
        fetchMembers();
      } catch (error) {
        console.error('Lỗi khi xóa thành viên:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-company-offWhite flex">
      {/* Sidebar */}
      <aside className="w-64 bg-company-darkGreen text-white min-h-screen p-6 flex flex-col">
        <h2 className="text-2xl font-bold font-serif mb-12 text-company-lighterGreen tracking-wide">BioCane Admin</h2>
        <nav className="flex-grow space-y-4">
          <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/10 text-white font-medium transition-colors">
            <Users size={20} /> Quản lý Thành viên
          </button>
          {/* Future sections can be added here */}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors mt-auto">
          <LogOut size={20} /> Đăng xuất
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-company-darkGreen mb-2">Đội ngũ dẫn dắt</h1>
            <p className="text-company-dark/60">Quản lý danh sách thành viên hiển thị trên trang chủ.</p>
          </div>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <Plus size={20} /> Thêm thành viên
          </button>
        </div>

        {/* Member Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(member => (
            <div key={member._id} className="bg-white p-6 rounded-2xl border border-company-dark/5 shadow-sm hover:shadow-md transition-shadow group relative">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(member)} className="p-2 bg-company-offWhite text-company-dark rounded-lg hover:bg-company-green hover:text-white transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(member._id)} className="p-2 bg-company-offWhite text-company-red rounded-lg hover:bg-company-red hover:text-white transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              {member.image ? (
                <img src={member.image} alt={member.name} className="w-16 h-16 rounded-2xl object-cover mb-4 shadow-sm" />
              ) : (
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-serif text-2xl font-bold mb-4 bg-company-dark/5 text-company-dark">
                  {member.name.charAt(0)}
                </div>
              )}
              <h3 className="font-bold text-company-darkGreen text-lg mb-1">{member.name}</h3>
              <p className="text-company-orange text-xs mb-3 font-medium">{member.role}</p>
            </div>
          ))}
          {members.length === 0 && (
            <div className="col-span-full text-center py-20 text-company-dark/50">
              Chưa có thành viên nào. Hãy thêm thành viên đầu tiên!
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-company-dark/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-company-dark/50 hover:text-company-dark transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-company-darkGreen mb-6">
              {editingMember ? 'Sửa thông tin' : 'Thêm thành viên mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-company-dark mb-1">Họ và Tên</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-company-offWhite border border-company-dark/10 rounded-xl focus:outline-none focus:border-company-green" placeholder="Vd: Nguyễn Văn A" />
              </div>
              <div>
                <label className="block text-sm font-medium text-company-dark mb-1">Chức vụ</label>
                <input required type="text" name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 bg-company-offWhite border border-company-dark/10 rounded-xl focus:outline-none focus:border-company-green" placeholder="Vd: Khoa học tính toán..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-company-dark mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-company-offWhite border border-company-dark/10 rounded-xl focus:outline-none focus:border-company-green" placeholder="Vd: trung@vlu.edu.vn" />
              </div>
              <div>
                <label className="block text-sm font-medium text-company-dark mb-1">Ảnh chân dung (Tải lên hoặc nhập URL)</label>
                <div className="flex gap-2 mb-2">
                  <input type="file" name="imageFile" accept="image/*" onChange={handleChange} className="w-full text-sm text-company-dark/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-company-green/10 file:text-company-green hover:file:bg-company-green/20 cursor-pointer" />
                </div>
                <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full px-4 py-2 bg-company-offWhite border border-company-dark/10 rounded-xl focus:outline-none focus:border-company-green text-sm" placeholder="Hoặc nhập URL ảnh: https://domain.com/image.jpg" />
              </div>
              <button type="submit" className="w-full btn-primary py-3 text-lg mt-4">
                {editingMember ? 'Cập nhật' : 'Lưu thành viên'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
