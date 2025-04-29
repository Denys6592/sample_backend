const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/payments');

const createCheckoutSession = async (req, res) => {
    try {
        console.log("Received request:", req.body); // ✅ Log request data

        const { userId, amount, currency } = req.body;
        if (!userId || !amount || !currency) {
            console.error("Missing fields", req.body);
            return res.status(400).json({ success: false, message: "User ID, amount, and currency are required" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ 
                price_data: { 
                    currency, 
                    product_data: { name: "Test Product" }, 
                    unit_amount: amount 
                }, 
                quantity: 1 
            }],
            mode: 'payment',
            success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/cancel`,
            metadata: { userId } 
        });

        console.log("Session created:", session);

        res.json({ success: true, url: session.url });
    } catch (error) {
        console.error("Stripe Error:", error); // ✅ Log detailed error
        res.status(500).json({ success: false, message: error.message });
    }
};


const getPaymentStatus = async (req, res) => {
    try {
        const { session_id } = req.query;
        if (!session_id) {
            return res.status(400).json({ success: false, message: "Session ID is required" });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);
        console.log("Retrieved Stripe session:", session); // ✅ Debugging

        if (!session.metadata.userId) {
            return res.status(400).json({ success: false, message: "User ID not found in session metadata" });
        }

        if (session.payment_status === 'paid') {
            const updatedPayment = await Payment.findOneAndUpdate(
                { sessionId: session_id },
                { status: 'paid' },
                { new: true }
            );

            if (!updatedPayment) {
                console.error("Payment not found in DB, inserting new entry.");
                const newPayment = new Payment({
                    userId: session.metadata.userId, // ✅ Now retrieved correctly
                    sessionId: session.id,
                    amount: session.amount_total / 100,
                    currency: session.currency,
                    status: 'paid',
                });
                await newPayment.save();
            }

            console.log("Updated payment status in DB:", updatedPayment);
        }

        res.json({ success: true, status: session.payment_status });
    } catch (error) {
        console.error("Error updating payment in DB:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};



module.exports = { createCheckoutSession, getPaymentStatus };
