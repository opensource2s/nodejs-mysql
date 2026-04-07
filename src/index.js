require('dotenv').config();

const app = require('./app');
const { createUsersTable } = require('./models/userModel');

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await createUsersTable();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📋 API: http://localhost:${PORT}/api/users`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
