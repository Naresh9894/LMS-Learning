import { Webhook } from "svix";
import User from "../models/user.js";
import Stripe from "stripe";
import Purchase from "../models/Purchase.js";
import Course from "../models/course.js";

//Api controller for handling webhooks function to mangae clerk User with database

 export const clerkWebhooks = async (req, res) => {
    try{
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body),{
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });
        const {data, type} = req.body;
        
        switch(type){
            case 'user.created':{
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imgageUrl: data.image_url
                }
                await User.create(userData);
                res.json({})
                break;
            }
            case 'user.updated':{
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imgageUrl: data.image_url
            }
            await User.findByIdAndUpdate(data.id, userData);
            res.json({})
            break;
            }
            case 'user.deleted':{
                await User.findByIdAndDelete(data.id);
                res.json({})
                break;
            }
            default:{
                break
            }
        }
    }catch(error){
        res.json({sucess: false, message: error.message});
    }
 }

 //Stripe Webhooks

export const stripeWebhooks = async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // Get checkout session with metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId, userId, courseId } = session.data[0].metadata;

      // ✅ Fix: use courseId & userId from metadata instead of purchaseData
      const purchaseData = await Purchase.findById(purchaseId);
      const userData = await User.findById(userId);
      const courseData = await Course.findById(courseId);

      if (!courseData || !userData) {
        console.error("Course or User not found");
        break;
      }

      // Update course
      courseData.enrolledStudents.push(userData._id);
      await courseData.save();

      // Update user
      userData.enrolledCourses.push(courseData._id);
      await userData.save();

      // Update purchase status
      purchaseData.status = 'completed';
      await purchaseData.save();

      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId);
      if (purchaseData) {
        purchaseData.status = 'failed';
        await purchaseData.save();
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({ received: true });
};
