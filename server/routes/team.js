const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const TeamMember = require('../models/TeamMember');

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'biocane',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const upload = multer({ storage: storage });

// Lấy tất cả thành viên
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ createdAt: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Thêm thành viên mới
router.post('/', upload.single('imageFile'), async (req, res) => {
  try {
    const memberData = { ...req.body };
    if (req.file) {
      memberData.image = req.file.path;
    }
    const newMember = new TeamMember(memberData);
    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm thành viên', error });
  }
});

// Cập nhật thành viên
router.put('/:id', upload.single('imageFile'), async (req, res) => {
  try {
    const memberData = { ...req.body };
    if (req.file) {
      memberData.image = req.file.path;
    }
    const updatedMember = await TeamMember.findByIdAndUpdate(req.params.id, memberData, { new: true });
    if (!updatedMember) return res.status(404).json({ message: 'Không tìm thấy thành viên' });
    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật thành viên', error });
  }
});

// Xóa thành viên
router.delete('/:id', async (req, res) => {
  try {
    const deletedMember = await TeamMember.findByIdAndDelete(req.params.id);
    if (!deletedMember) return res.status(404).json({ message: 'Không tìm thấy thành viên' });
    res.json({ message: 'Đã xóa thành viên thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa thành viên', error });
  }
});

module.exports = router;
