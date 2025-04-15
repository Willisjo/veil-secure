import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as api from './api';
import * as stripeService from './stripe';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Authentication middleware (simplified for demo)
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // In a real app, verify JWT tokens, session cookies, etc.
  // For now, we'll just check for an admin header
  const isAdmin = req.headers['x-admin-access'] === 'true';
  
  if (!isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// Server routes
app.get('/api/servers', async (req, res) => {
  try {
    const servers = await api.getServers();
    res.json(servers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch servers' });
  }
});

// Admin routes - protected by authMiddleware
app.get('/api/admin/users', authMiddleware, async (req, res) => {
  try {
    const users = await api.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/admin/servers', authMiddleware, async (req, res) => {
  try {
    const newServer = await api.createServer(req.body);
    res.status(201).json(newServer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create server' });
  }
});

app.put('/api/admin/servers/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedServer = await api.updateServer(Number(id), req.body);
    res.json(updatedServer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update server' });
  }
});

app.delete('/api/admin/servers/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedServer = await api.deleteServer(Number(id));
    res.json(deletedServer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete server' });
  }
});

// Session management
app.get('/api/admin/sessions', authMiddleware, async (req, res) => {
  try {
    const sessions = await api.getSessions();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Stats and analytics
app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  try {
    const activeSessionsCount = await api.getActiveSessionsCount();
    
    // In a real app, you'd gather more stats
    res.json({
      activeSessions: activeSessionsCount,
      // Add more stats as needed
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Payment routes
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    // In a real application, you would get the userId from the authenticated session
    const userId = 1; // Default for demonstration
    
    const paymentIntent = await stripeService.createPaymentIntent(amount, userId);
    res.json({ clientSecret: paymentIntent.clientSecret });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Subscription plans route
app.get('/api/subscription-plans', async (req, res) => {
  try {
    const plans = await stripeService.getSubscriptionPlans();
    res.json(plans);
  } catch (error: any) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create subscription route
app.post('/api/create-subscription', async (req, res) => {
  try {
    const { priceId, userId } = req.body;
    const subscription = await stripeService.createSubscription(userId, priceId);
    res.json(subscription);
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription route
app.post('/api/cancel-subscription', async (req, res) => {
  try {
    const { userId } = req.body;
    const subscription = await stripeService.cancelSubscription(userId);
    res.json(subscription);
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle Stripe events
app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    // Handle the event using our stripe service
    await stripeService.handleWebhookEvent(event);

    // Return a 200 response to acknowledge receipt of the event
    res.json({received: true});
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});