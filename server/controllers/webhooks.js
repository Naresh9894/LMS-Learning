import { Webhook } from "svix";
import User from "../models/user.js";
import Stripe from "stripe";
import Purchase from "../models/Purchase.js";
import Course from "../models/course.js";

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url
                }
                await User.create(userData);
                res.json({})
                break;
            }
            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url
                }
                await User.findByIdAndUpdate(data.id, userData);
                res.json({})
                break;
            }
            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                res.json({})
                break;
            }
            default: {
                res.json({})
                break;
            }
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

const completePurchase = async (purchaseId) => {
    if (!purchaseId) {
        console.warn("Stripe webhook: missing purchaseId in metadata.");
        return;
    }

    const purchaseData = await Purchase.findById(purchaseId);
    if (!purchaseData) {
        console.warn(`Stripe webhook: purchase not found for id ${purchaseId}.`);
        return;
    }

    if (purchaseData.status === 'completed') {
        return;
    }

    const [courseRes, userRes] = await Promise.all([
        Course.updateOne(
            { _id: purchaseData.courseId },
            { $addToSet: { enrolledStudents: purchaseData.userId } }
        ),
        User.updateOne(
            { _id: purchaseData.userId },
            { $addToSet: { enrolledCourses: purchaseData.courseId } }
        ),
    ]);

    if (!courseRes.matchedCount || !userRes.matchedCount) {
        console.warn(`Stripe webhook: user/course missing for purchase ${purchaseId}.`);
    }

    purchaseData.status = 'completed';
    await purchaseData.save();
};

const failPurchase = async (purchaseId) => {
    if (!purchaseId) {
        console.warn("Stripe webhook: missing purchaseId in metadata.");
        return;
    }
    const purchaseData = await Purchase.findById(purchaseId);
    if (!purchaseData) {
        console.warn(`Stripe webhook: purchase not found for id ${purchaseId}.`);
        return;
    }
    purchaseData.status = 'failed';
    await purchaseData.save();
};

export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = Stripe.webhooks.constructEvent(
            request.body, sig, process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`Stripe webhook received: ${event.type} (${event.id})`);

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const { purchaseId } = session.metadata || {};
                if (session.payment_status === 'paid') {
                    await completePurchase(purchaseId);
                }
                break;
            }
            case 'checkout.session.async_payment_succeeded': {
                const session = event.data.object;
                const { purchaseId } = session.metadata || {};
                await completePurchase(purchaseId);
                break;
            }
            case 'checkout.session.async_payment_failed': {
                const session = event.data.object;
                const { purchaseId } = session.metadata || {};
                await failPurchase(purchaseId);
                break;
            }
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;
                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                    limit: 1
                });
                if (!session.data.length) {
                    console.warn(`Stripe webhook: no session for payment_intent ${paymentIntentId}.`);
                    break;
                }
                const purchaseId = session.data[0]?.metadata?.purchaseId;
                await completePurchase(purchaseId);
                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;
                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                    limit: 1
                });
                if (!session.data.length) {
                    console.warn(`Stripe webhook: no session for payment_intent ${paymentIntentId}.`);
                    break;
                }
                const purchaseId = session.data[0]?.metadata?.purchaseId;
                await failPurchase(purchaseId);
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (err) {
        console.error(`Stripe webhook handler error (${event.type} ${event.id}):`, err);
        return response.status(500).json({ received: false });
    }

    response.json({ received: true });
}

