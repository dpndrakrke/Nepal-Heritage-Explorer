const { User, Heritage, Image } = require('./model');
const bcrypt = require('bcrypt');

const seedHeritageSites = async () => {
  try {
    console.log('🌱 Starting heritage sites seeding...');

    // First, create an admin user if it doesn't exist
    const adminUser = await User.findOne({ where: { email: 'admin@heritage.com' } });
    let adminId;

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        email: 'admin@heritage.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+977-1-4XXXXXX'
      });
      adminId = newAdmin.id;
      console.log('✅ Admin user created');
    } else {
      adminId = adminUser.id;
      console.log('✅ Admin user already exists');
    }

    // Sample heritage sites data
    const heritageSites = [
      {
        name: 'Pashupatinath Temple',
        description: 'Pashupatinath Temple is one of the most sacred Hindu temples dedicated to Lord Shiva. Located on the banks of the Bagmati River, it is a UNESCO World Heritage Site and one of the most important religious sites in Nepal.',
        shortDescription: 'Sacred Hindu temple dedicated to Lord Shiva',
        location: 'Kathmandu, Nepal',
        category: 'temple',
        historicalPeriod: 'Ancient',
        builtYear: '5th century',
        architect: 'Unknown',
        significance: 'One of the most sacred Hindu temples, UNESCO World Heritage Site',
        visitingHours: '4:00 AM - 9:00 PM',
        entryFee: 1000,
        latitude: 27.7101,
        longitude: 85.3483,
        featured: true,
        isActive: true,
        createdBy: adminId
      },
      {
        name: 'Boudhanath Stupa',
        description: 'Boudhanath Stupa is one of the largest stupas in the world and a UNESCO World Heritage Site. It is a sacred Buddhist site and an important center of Tibetan Buddhism in Nepal.',
        shortDescription: 'One of the largest Buddhist stupas in the world',
        location: 'Kathmandu, Nepal',
        category: 'monument',
        historicalPeriod: 'Ancient',
        builtYear: '14th century',
        architect: 'Unknown',
        significance: 'UNESCO World Heritage Site, important Buddhist pilgrimage site',
        visitingHours: '24 hours',
        entryFee: 400,
        latitude: 27.7215,
        longitude: 85.3621,
        featured: true,
        isActive: true,
        createdBy: adminId
      },
      {
        name: 'Swayambhunath Temple',
        description: 'Swayambhunath, also known as the Monkey Temple, is an ancient religious complex atop a hill in the Kathmandu Valley. It is one of the most sacred Buddhist sites in Nepal.',
        shortDescription: 'Ancient Buddhist temple complex on a hilltop',
        location: 'Kathmandu, Nepal',
        category: 'temple',
        historicalPeriod: 'Ancient',
        builtYear: '5th century',
        architect: 'Unknown',
        significance: 'Sacred Buddhist site, UNESCO World Heritage Site',
        visitingHours: '24 hours',
        entryFee: 200,
        latitude: 27.7148,
        longitude: 85.2904,
        featured: true,
        isActive: true,
        createdBy: adminId
      },
      {
        name: 'Kathmandu Durbar Square',
        description: 'Kathmandu Durbar Square is a historic palace complex in the heart of Kathmandu. It was the royal palace of the Malla kings and later the Shah dynasty.',
        shortDescription: 'Historic palace complex and royal residence',
        location: 'Kathmandu, Nepal',
        category: 'palace',
        historicalPeriod: 'Medieval',
        builtYear: '12th-18th century',
        architect: 'Various Malla and Shah architects',
        significance: 'UNESCO World Heritage Site, historic royal palace',
        visitingHours: '6:00 AM - 6:00 PM',
        entryFee: 1000,
        latitude: 27.7044,
        longitude: 85.3072,
        featured: true,
        isActive: true,
        createdBy: adminId
      },
      {
        name: 'Patan Durbar Square',
        description: 'Patan Durbar Square is one of the three Durbar Squares in the Kathmandu Valley. It is known for its beautiful architecture and intricate wood carvings.',
        shortDescription: 'Historic square with beautiful architecture',
        location: 'Lalitpur, Nepal',
        category: 'palace',
        historicalPeriod: 'Medieval',
        builtYear: '14th-18th century',
        architect: 'Various Malla architects',
        significance: 'UNESCO World Heritage Site, fine example of Newar architecture',
        visitingHours: '6:00 AM - 6:00 PM',
        entryFee: 1000,
        latitude: 27.6731,
        longitude: 85.3240,
        featured: false,
        isActive: true,
        createdBy: adminId
      },
      {
        name: 'Bhaktapur Durbar Square',
        description: 'Bhaktapur Durbar Square is the most well-preserved of the three Durbar Squares. It showcases the finest examples of Newar architecture and craftsmanship.',
        shortDescription: 'Well-preserved historic square with Newar architecture',
        location: 'Bhaktapur, Nepal',
        category: 'palace',
        historicalPeriod: 'Medieval',
        builtYear: '12th-18th century',
        architect: 'Various Malla architects',
        significance: 'UNESCO World Heritage Site, finest Newar architecture',
        visitingHours: '6:00 AM - 6:00 PM',
        entryFee: 1500,
        latitude: 27.6710,
        longitude: 85.4295,
        featured: true,
        isActive: true,
        createdBy: adminId
      },
      {
        name: 'Changu Narayan Temple',
        description: 'Changu Narayan is the oldest Hindu temple in the Kathmandu Valley. It is dedicated to Lord Vishnu and is known for its beautiful stone carvings.',
        shortDescription: 'Oldest Hindu temple in Kathmandu Valley',
        location: 'Bhaktapur, Nepal',
        category: 'temple',
        historicalPeriod: 'Ancient',
        builtYear: '4th century',
        architect: 'Unknown',
        significance: 'Oldest temple in Kathmandu Valley, UNESCO World Heritage Site',
        visitingHours: '6:00 AM - 6:00 PM',
        entryFee: 300,
        latitude: 27.7167,
        longitude: 85.4295,
        featured: false,
        isActive: true,
        createdBy: adminId
      },
      {
        name: 'Lumbini',
        description: 'Lumbini is the birthplace of Lord Buddha and one of the most important Buddhist pilgrimage sites in the world. It is a UNESCO World Heritage Site.',
        shortDescription: 'Birthplace of Lord Buddha',
        location: 'Lumbini, Nepal',
        category: 'monument',
        historicalPeriod: 'Ancient',
        builtYear: '6th century BCE',
        architect: 'Unknown',
        significance: 'Birthplace of Buddha, UNESCO World Heritage Site',
        visitingHours: '6:00 AM - 6:00 PM',
        entryFee: 500,
        latitude: 27.4692,
        longitude: 83.2756,
        featured: true,
        isActive: true,
        createdBy: adminId
      }
    ];

    // Create heritage sites
    for (const siteData of heritageSites) {
      const existingSite = await Heritage.findOne({ where: { name: siteData.name } });
      
      if (!existingSite) {
        const heritage = await Heritage.create(siteData);
        console.log(`✅ Created: ${heritage.name}`);
      } else {
        console.log(`⏭️  Skipped: ${siteData.name} (already exists)`);
      }
    }

    console.log('🎉 Heritage sites seeding completed!');
    console.log('\n📋 Sample Admin Login:');
    console.log('Email: admin@heritage.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error seeding heritage sites:', error);
  }
};

// Run the seeding if this file is executed directly
if (require.main === module) {
  const { connectDB } = require('./db/database');
  
  connectDB()
    .then(() => {
      return seedHeritageSites();
    })
    .then(() => {
      console.log('✅ Database seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedHeritageSites }; 