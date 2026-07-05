const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Models
const User = require('./models/User');
const Product = require('./models/Product');
const Contact = require('./models/Contact');

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected!');

    console.log('Clearing old data...');
    await User.deleteMany();
    await Product.deleteMany();
    await Contact.deleteMany();

    console.log('Inserting default Admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin BioCane',
      email: 'admin@biocane.vn',
      password: hashedPassword
    });

    console.log('Inserting default Products...');
    const products = [
      {
        name: 'Fuel Ethanol E10',
        description: 'Ethanol sinh học chất lượng cao dùng pha trộn xăng sinh học E10, E5.',
        purity: '99.5% PURE',
        category: 'Nhiên liệu',
        badge: 'Bán chạy nhất'
      },
      {
        name: 'Pharma-Grade Ethanol',
        description: 'Cồn y tế tinh khiết tuyệt đối, an toàn cho y tế và sản xuất thuốc.',
        purity: '99.8% PURE',
        category: 'Dược phẩm',
        badge: 'Cao cấp'
      },
      {
        name: 'Food-Grade Ethanol',
        description: 'Cồn thực phẩm nguồn gốc tự nhiên, chuyên dùng cho đồ uống và thực phẩm.',
        purity: '96.0% PURE',
        category: 'Thực phẩm',
        badge: 'Tự nhiên'
      }
    ];
    await Product.insertMany(products);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
