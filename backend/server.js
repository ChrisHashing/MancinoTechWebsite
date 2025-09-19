// server/server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const clientEmailMap = require('./clientEmailMap');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// Admin credentials from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234';

// Precomputed admin password hash if provided as plain text env
let ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
if (!ADMIN_PASSWORD_HASH && ADMIN_PASSWORD) {
    // hash synchronously at boot once
    const salt = bcrypt.genSaltSync(10);
    ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD, salt);
}

// Allow CORS for local dev and production
app.use(cors());
app.use(bodyParser.json());

// --- Models ---
const Lead = require('./models/Lead');

// --- Nodemailer transporter setup ---
// Using environment variables for email credentials (avoid hardcoding secrets)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

// --- MongoDB connection ---
// Use environment-provided MONGODB_URI when available; fallback to a safe hardcoded URI
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://chriswindow466_db_user:ptRWa4SOPkfvi5Ew@cluster0.fjgg11v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose
    .connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// --- Auth helpers ---
function createToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (e) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// --- Auth routes ---
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
        if (email !== ADMIN_EMAIL) return res.status(401).json({ error: 'Invalid credentials' });
        const ok = ADMIN_PASSWORD_HASH && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
        if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
        const token = createToken({ sub: email, role: 'admin' });
        return res.json({ token, user: { email, role: 'admin' } });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
    return res.json({ user: { email: req.user.sub, role: req.user.role } });
});

// --- Leads CRUD API ---
// Create lead (also sends email)
app.post('/api/leads', async (req, res) => {
    try {
        const { clientId, name, email, phone, logo, budget, deliveryDate, style, purpose, source, status, meta } = req.body;
        
        console.log('=== LEAD CREATION DEBUG ===');
        console.log('Request body:', { clientId, name, email, phone, logo, budget, deliveryDate, style, purpose, source, status, meta });
        
        // clientId is optional now; only validate required lead fields
        if (!name || !email) {
            console.log('❌ Validation failed: Missing required fields');
            return res.status(400).json({ error: 'Missing required fields: name, email' });
        }

        // Build lead object and include clientId only if provided
        const leadData = { name, email, phone, logo, budget, deliveryDate, style, purpose, source, status, meta };
        if (clientId) {
            leadData.clientId = clientId;
            console.log('✅ ClientId provided:', clientId);
        } else {
            console.log('ℹ️ No clientId provided');
        }

        console.log('Lead data to create:', leadData);
        const lead = await Lead.create(leadData);
        console.log('✅ Lead created successfully:', lead._id);

        // Determine recipients based on clientId from clientEmailMap
        let recipients;
        console.log('=== RECIPIENT SELECTION DEBUG ===');
        console.log('Available client mappings:', Object.keys(clientEmailMap));
        
        if (clientId && clientEmailMap[clientId]) {
            recipients = clientEmailMap[clientId].join(',');
            console.log('✅ Using client email mapping for', clientId, ':', clientEmailMap[clientId]);
        } else {
            // Fallback to environment variable or Gmail user
            recipients = (process.env.NOTIFICATION_RECIPIENTS && process.env.NOTIFICATION_RECIPIENTS.split(',').map(s => s.trim()).filter(Boolean).join(',')) || process.env.GMAIL_USER;
            console.log('⚠️ Using fallback recipients:', recipients);
            if (clientId) {
                console.log('❌ ClientId', clientId, 'not found in clientEmailMap');
            }
        }
        
        console.log('Final recipients:', recipients);

        const subject = clientId ? `New Lead for ${clientId}: ${name}` : `New Lead: ${name}`;
        console.log('Email subject:', subject);
        
        const text = [
            `Name: ${name}`,
            `Email: ${email}`,
            phone ? `Phone: ${phone}` : null,
            logo ? `Logo: ${logo}` : null,
            budget ? `Budget: ${budget}` : null,
            deliveryDate ? `Delivery Date: ${deliveryDate}` : null,
            style ? `Style: ${style}` : null,
            purpose ? `Purpose: ${purpose}` : null,
            source ? `Source: ${source}` : null,
            `Created At: ${new Date(lead.createdAt).toISOString()}`,
        ]
            .filter(Boolean)
            .join('\n');

        console.log('=== EMAIL SENDING DEBUG ===');
        console.log('Email details:', {
            from: process.env.GMAIL_USER,
            to: recipients,
            subject: subject,
            textLength: text.length
        });

        try {
            await transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: recipients,
                subject,
                text,
            });
            console.log('✅ Email sent successfully to:', recipients);
        } catch (emailErr) {
            console.error('❌ Email send error:', emailErr);
            // Do not fail the API because of email; report in response
            return res.status(201).json({ success: true, lead, emailSent: false, emailError: 'Failed to send email' });
        }

        console.log('=== LEAD CREATION COMPLETE ===');
        return res.status(201).json({ success: true, lead, emailSent: true });
    } catch (err) {
        console.error('❌ Create lead error:', err);
        return res.status(500).json({ error: 'Failed to create lead.' });
    }
});

// List leads with optional filters and pagination (protected)
app.get('/api/leads', authMiddleware, async (req, res) => {
    try {
        const { clientId, status, q, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (clientId) filter.clientId = clientId;
        if (status) filter.status = status;
        if (q) {
            const regex = new RegExp(q, 'i');
            filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [items, total] = await Promise.all([
            Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            Lead.countDocuments(filter),
        ]);
        res.json({ items, total, page: Number(page), limit: Number(limit) });
    } catch (err) {
        console.error('List leads error:', err);
        res.status(500).json({ error: 'Failed to fetch leads.' });
    }
});

// Get single lead (protected)
app.get('/api/leads/:id', authMiddleware, async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ error: 'Lead not found' });
        res.json(lead);
    } catch (err) {
        console.error('Get lead error:', err);
        res.status(500).json({ error: 'Failed to fetch lead.' });
    }
});

// Update lead (protected)
app.put('/api/leads/:id', authMiddleware, async (req, res) => {
    try {
        const leadId = req.params.id;
        const update = req.body;
        
        // Debug logging for update operation
        console.log('=== MongoDB Update Debug ===');
        console.log('Lead ID:', leadId);
        console.log('Update data:', JSON.stringify(update, null, 2));
        console.log('User making update:', req.user);
        
        // Validate lead ID format
        if (!mongoose.Types.ObjectId.isValid(leadId)) {
            console.log('Invalid ObjectId format for lead ID:', leadId);
            return res.status(400).json({ error: 'Invalid lead ID format' });
        }
        
        // Check if lead exists before update
        const existingLead = await Lead.findById(leadId);
        console.log('Existing lead found:', existingLead ? 'Yes' : 'No');
        if (existingLead) {
            console.log('Current lead data:', JSON.stringify(existingLead, null, 2));
        }
        
        // Perform the update
        console.log('Executing findByIdAndUpdate...');
        const lead = await Lead.findByIdAndUpdate(leadId, update, { 
            new: true,
            runValidators: true // Ensure schema validation runs
        });
        
        if (!lead) {
            console.log('No lead found with ID:', leadId);
            return res.status(404).json({ error: 'Lead not found' });
        }
        
        console.log('Update successful. Updated lead:', JSON.stringify(lead, null, 2));
        console.log('=== End MongoDB Update Debug ===');
        
        res.json({ success: true, lead });
    } catch (err) {
        console.error('=== MongoDB Update Error ===');
        console.error('Lead ID:', req.params.id);
        console.error('Update data:', JSON.stringify(req.body, null, 2));
        console.error('Error details:', err);
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        if (err.errors) {
            console.error('Validation errors:', err.errors);
        }
        console.error('=== End MongoDB Update Error ===');
        res.status(500).json({ error: 'Failed to update lead.' });
    }
});

// Delete lead (protected)
app.delete('/api/leads/:id', authMiddleware, async (req, res) => {
    try {
        const result = await Lead.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Lead not found' });
        res.json({ success: true });
    } catch (err) {
        console.error('Delete lead error:', err);
        res.status(500).json({ error: 'Failed to delete lead.' });
    }
});

// Development-only: seed some dummy leads
// GET /seed-dummy-leads - creates a few sample leads if they don't already exist
app.get('/seed-dummy-leads', async (req, res) => {
    try {
        const dummyLeads = [
            { name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101', source: 'seed' },
            { name: 'Bob Smith', email: 'bob@example.com', phone: '555-0102', source: 'seed' },
            { name: 'Carol Lee', email: 'carol@example.com', phone: '555-0103', source: 'seed' }
        ];

        const created = [];
        for (const d of dummyLeads) {
            const exists = await Lead.findOne({ email: d.email });
            if (!exists) {
                const lead = new Lead(d);
                await lead.save();
                created.push(lead);
            }
        }

        return res.json({ message: 'Seed complete', createdCount: created.length, created });
    } catch (err) {
        console.error('Seed failed', err);
        return res.status(500).json({ error: 'Seed failed' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('=== CLIENT EMAIL MAPPINGS ===');
    Object.entries(clientEmailMap).forEach(([clientId, emails]) => {
        console.log(`${clientId}:`, emails.join(', '));
    });
    console.log('=============================');
});