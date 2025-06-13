import cron from 'node-cron';
import axios from 'axios';

const RENDER_URL = process.env.RENDER_EXTERNAL_URL;

// Ping every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  try {
    await axios.get(`${RENDER_URL}/api/health`);
    console.log('Keep-alive ping sent successfully');
  } catch (error) {
    console.error('Keep-alive ping failed:', error.message);
  }
});

export default cron;