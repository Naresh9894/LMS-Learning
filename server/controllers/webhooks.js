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

 const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = Stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { purchaseId, courseId, userId } = session.metadata;

        const purchaseData = await Purchase.findById(purchaseId);
        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);

        if (!purchaseData || !userData || !courseData) {
          console.error("Missing data for purchase", { purchaseId, courseId, userId });
          break;
        }

        // update purchase
        purchaseData.status = "completed";
        purchaseData.stripeSessionId = session.id;
        await purchaseData.save();

        // update course
        if (!courseData.enrolledStudents.includes(userId)) {
          courseData.enrolledStudents.push(userId);
          await courseData.save();
        }

        // update user
        if (!userData.enrolledCourses.includes(courseId)) {
          userData.enrolledCourses.push(courseId);
          await userData.save();
        }

        console.log("✅ Purchase completed and enrollment updated");
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        const { purchaseId } = session.metadata || {};
        if (purchaseId) {
          await Purchase.findByIdAndUpdate(purchaseId, { status: "failed" });
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook handling error:", err);
    res.status(500).send("Webhook internal error");
  }
};