const axios = require('axios');
const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');

function scheduleCron() {
    //Run every 8 Days
    cron.schedule('0 0 */8 * *', async () => {
    //  cron.schedule('* * * * *', async () => {

        console.log('Running token generation task...');
        try {
                await generateToken();
        } catch (error) {
            console.error('Failed to generate token in scheduled task:', error.message);
        }
    });
}
/**
 * Generate token for Shiprocket API
 */
const generateToken =async () => {
    try {
        const response = await axios.post(process.env.AUTH_URL, {
            email: process.env.API_EMAIL,
            password: process.env.EMAIL_PASS
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Token generated:', response.data.token);
       await saveTokenToFile(response.data.token)
       return response.data.token
    } catch (error) {
        console.error('Error generating token:', error.message);
    }
}
/**
 * 
 * @param {string} token 
 */
async function saveTokenToFile(token) {
    const filePath = path.join(__dirname, 'token.json');

    try {
        await fs.unlink(filePath).catch(() => {});

        const data = { token };

        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log('Token saved successfully');
    } catch (error) {
        console.error('Error saving token:', error);
    }
}

module.exports = {
    generateToken,
    scheduleCron
};
