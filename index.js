const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');

const connection = require('./config/db.js');
const Stock = require('./models/stockModel.js')

const app = express();
app.use(express.json());
app.use(cors());


// Function to fetch and store real-time data
const fetchData = async () => {
    try {
        const symbols = ['GOOG', 'BTC', 'ETH', 'AAPL', 'TSLA'];
        const api = process.env.API_URL;
        const apiKey = process.env.API_KEY;

        for (const symbol of symbols) {
            const response = await axios.post(api, {
                currency: "USD",
                sort: "rank",
                order: "ascending",
                offset: 0,
                limit: 2,
                meta: false,
            }, {
                headers: {
                    "content-type": "application/json",
                    "x-api-key": apiKey,
                }
            });

            const coinData = response.data.find(coin => coin.code === symbol);
            console.log('COINDATA', coinData)

            if (coinData) {
                const newCoinData = new Stock({
                    code: coinData.code,
                    rate: coinData.rate,
                    volume: coinData.volume,
                    cap: coinData.cap,
                    delta: coinData.delta,
                });
                await newCoinData.save();
            }
        }
    } catch (error) {
        console.error('Error fetching coin data:', error);
    }
};

//To Schedule the fetch every 5 seconds
cron.schedule('*/5 * * * * *', fetchData);

app.get('/', (req, res) => {
    res.send('Welcome to the base route');
});

app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log('Connected to the Database!');
    }
    catch (err) {
        console.log('Unable to connect', err);
    }

    console.log(`Listening at PORT:${process.env.PORT || 8000}`);
});