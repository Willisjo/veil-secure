import Stripe from "stripe";
import { db } from "./db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Create a Stripe payment intent for one-time payments
export const createPaymentIntent = async (amount: number, userId: number) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert dollars to cents
      currency: "usd",
      metadata: {
        userId: userId.toString(),
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

// Create a subscription in Stripe
export const createSubscription = async (userId: number, priceId: string) => {
  try {
    // Get the user from database
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      throw new Error("User not found");
    }

    // If the user already has a Stripe customer ID, use it
    let customerId = user.stripeCustomerId;

    // Otherwise, create a new customer in Stripe
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || "unknown@example.com",
        name: user.username,
        metadata: {
          userId: userId.toString(),
        },
      });
      customerId = customer.id;

      // Update the user with the Stripe customer ID
      await db
        .update(users)
        .set({
          stripeCustomerId: customerId,
        })
        .where(eq(users.id, userId));
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    // Update the user with the subscription ID
    await db
      .update(users)
      .set({
        stripeSubscriptionId: subscription.id,
      })
      .where(eq(users.id, userId));

    // Return the client secret needed for payment confirmation
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

// Handle Stripe webhook events
export const handleWebhookEvent = async (event: Stripe.Event) => {
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Update your database - payment successful
        console.log(`Payment intent ${paymentIntent.id} succeeded`);
        break;

      case "payment_intent.payment_failed":
        // Payment failed - notify user or handle accordingly
        break;

      case "invoice.payment_succeeded":
        // Subscription payment succeeded
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Invoice ${invoice.id} payment succeeded`);
        break;

      case "invoice.payment_failed":
        // Subscription payment failed
        break;

      case "customer.subscription.created":
        // New subscription created
        break;

      case "customer.subscription.updated":
        // Subscription updated
        break;

      case "customer.subscription.deleted":
        // Subscription cancelled
        const subscription = event.data.object as Stripe.Subscription;
        // Update user's subscription status in database
        break;
    }
  } catch (error) {
    console.error("Error handling webhook event:", error);
    throw error;
  }
};

// Get available subscription plans
export const getSubscriptionPlans = async () => {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ["data.product"],
      limit: 10,
    });

    // Format the prices into a more friendly structure
    return prices.data.map((price) => {
      const product = price.product as Stripe.Product;
      return {
        id: price.id,
        name: product.name,
        description: product.description,
        price: price.unit_amount ? price.unit_amount / 100 : 0, // Convert from cents to dollars
        currency: price.currency,
        interval: price.recurring?.interval || "one-time",
        intervalCount: price.recurring?.interval_count || 1,
      };
    });
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    // Return default plans if Stripe isn't set up yet
    return [
      {
        id: "price_monthly",
        name: "VPN Monthly",
        description: "Access to all premium VPN servers",
        price: 9.99,
        currency: "usd",
        interval: "month",
        intervalCount: 1,
      },
      {
        id: "price_yearly",
        name: "VPN Yearly",
        description: "Access to all premium VPN servers at a discounted rate",
        price: 99.99,
        currency: "usd",
        interval: "year",
        intervalCount: 1,
      },
    ];
  }
};

// Cancel a subscription
export const cancelSubscription = async (userId: number) => {
  try {
    // Get the user from database
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user?.stripeSubscriptionId) {
      throw new Error("No active subscription found for this user");
    }

    // Cancel the subscription at period end
    const subscription = await stripe.subscriptions.update(
      user.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    return subscription;
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    throw error;
  }
};