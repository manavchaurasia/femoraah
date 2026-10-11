const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows DNS SRV resolution on MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where setting DNS is restricted
}

const connectDB = async () => {
  try {
    const defaultUri = 'mongodb+srv://maanavc2006_db_user:manav782020@cluster0.trt1bcc.mongodb.net/femoraah?retryWrites=true&w=majority&appName=Cluster0';
    const mongoUri = process.env.MONGODB_URI || defaultUri;
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`);
    console.log(`ℹ️ Running in resilient mode (in-memory demo fallback active until MongoDB connects).`);
  }
};

module.exports = connectDB;
