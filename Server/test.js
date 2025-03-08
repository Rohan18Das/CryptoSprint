const express = require('express');
const mongoose = require('mongoose');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const ApiHandler = require("./routes/ApiHandler");
const cors = require('cors');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Update with your frontend URL if different
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Update this to allow only specific origins if necessary
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});

// Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50, // Limit each IP to 50 requests per minute
    message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

// Use API handler routes
app.use("/api", ApiHandler);

// Apply bodyParser.json() to all routes except /webhook
app.use((req, res, next) => {
    if (req.originalUrl === '/webhook') {
        next();
    } else {
        bodyParser.json()(req, res, next);
    }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Wallet Schema
const walletSchema = new mongoose.Schema({
    email: { type: String, required: true },
    balance: { type: Number, default: 0 }
});

const Wallet = mongoose.model('Wallet', walletSchema);

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    email: { type: String, required: true },
    coin: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    transactionType: { type: String, enum: ['credit', 'debit'], required: true },
    createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// CoinPurchase Schema
const coinPurchaseSchema = new mongoose.Schema({
    email: { type: String, required: true },
    coin: { type: String, required: true },
    quantity: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
});

const CoinPurchase = mongoose.model('CoinPurchase', coinPurchaseSchema);

// Routes
app.get('/', (req, res) => {
    res.send('<h1>Server is running!</h1><p>Welcome to the API server...</p>');
});

// Fetch user wallet balance
app.get('/api/wallet/balance', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        let wallet = await Wallet.findOne({ email });

        if (!wallet) {
            wallet = new Wallet({ email, balance: 0 });
            await wallet.save();
        }

        res.json({ balanceINR: wallet.balance });
    } catch (error) {
        console.error('Error fetching balance:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Initialize user wallet
app.post('/api/wallet/init', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        let wallet = await Wallet.findOne({ email });

        if (!wallet) {
            wallet = new Wallet({ email, balance: 0 });
            await wallet.save();
        }

        res.json({ balance: wallet.balance });
    } catch (error) {
        console.error('Error initializing wallet:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create checkout session
app.post('/checkout/create-checkout-session', async (req, res) => {
    const { email, amountInINR } = req.body;

    if (!email || !amountInINR || amountInINR <= 0) {
        console.error('Invalid input:', { email, amountInINR });
        return res.status(400).json({ error: 'Valid email and positive amount are required.' });
    }

    try {
        const amountInCents = Math.round(amountInINR * 100);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Wallet Top-up',
                        },
                        unit_amount: amountInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:5173/success?status=success',
            cancel_url: 'http://localhost:5173/cancel?status=failure',
            customer_email: email,
            billing_address_collection: 'required',
        });
        console.log(`Checkout session created: ${session.id}`);
        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error.message);
        res.status(500).json({ error: 'Internal Server Error. Unable to create checkout session.' });
    }
});

// Handle buy transaction
app.post('/api/transactions/buy', async (req, res) => {
    const { email, coin, quantity, price, totalPrice, useWallet } = req.body;

    if (!email || !coin || !quantity || !price || !totalPrice) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        let wallet = await Wallet.findOne({ email });

        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        if (totalPrice > wallet.balance) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        wallet.balance -= totalPrice;
        await wallet.save();

        const transaction = new Transaction({
            email,
            coin,
            quantity,
            price,
            totalPrice,
            transactionType: 'debit',
        });

        await transaction.save();

        const coinPurchase = new CoinPurchase({
            email,
            coin,
            quantity,
            purchasePrice: price,
        });

        await coinPurchase.save();

        res.json({ message: 'Buy transaction successful', balance: wallet.balance });
    } catch (error) {
        console.error('Error processing buy transaction:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Handle sell transaction
app.post('/api/transactions/sell', async (req, res) => {
    const { email, coin, quantity, price } = req.body;

    if (!email || !coin || !quantity || !price) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Find the user's wallet
        let wallet = await Wallet.findOne({ email });

        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        // Find the user's coin purchase
        const coinPurchase = await CoinPurchase.findOne({ email, coin });

        if (!coinPurchase) {
            return res.status(400).json({ error: `No purchases found for the coin: ${coin}` });
        }

        if (coinPurchase.quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient quantity of coin' });
        }

        // Update coin purchase quantity or delete it if quantity becomes 0
        coinPurchase.quantity -= quantity;

        if (coinPurchase.quantity === 0) {
            await CoinPurchase.deleteOne({ _id: coinPurchase._id });
        } else {
            await coinPurchase.save();
        }

        // Update wallet balance
        const totalPrice = quantity * price;
        wallet.balance += totalPrice;
        await wallet.save();

        // Create a transaction
        const transaction = new Transaction({
            email,
            coin,
            quantity,
            price,
            totalPrice,
            transactionType: 'credit',
        });

        await transaction.save();

        res.json({ message: 'Sell transaction successful', balance: wallet.balance });
    } catch (error) {
        console.error('Error processing sell transaction:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch transactions by email
app.get('/api/transactions', async (req, res) => {
    const { email } = req.query;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const transactions = await Transaction.find({ email }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Handle webhook for Stripe payment status
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const amountInINR = session.amount_total / 100;
            const email = session.customer_email;
    
            let wallet = await Wallet.findOne({ email });
            if (!wallet) wallet = new Wallet({ email, balance: 0 });
    
            wallet.balance += amountInINR;
            await wallet.save();
    
            const transaction = new Transaction({
                email,
                amount: amountInINR,
                currency: 'INR',
                transactionType: 'credit',
            });
            await transaction.save();
    
            console.log('Checkout Session Completed:', session.id);
            res.json({ received: true });
        } else {
            console.log(`Unhandled event type: ${event.type}`);
            res.json({ received: true });
        }
    } catch (error) {
        console.error('Webhook error:', error.message);
        res.status(400).send(`Webhook error: ${error.message}`);
    }
    });
    
    // Start the server
    app.listen(30001, () => {
    console.log('Server is listening on port 30001');
    });
    