// A simple Node.js Express server to securely handle API calls to Google Gemini.
// This version is updated for the multi-step, multi-design generation workflow.
// **HYPER-OPTIMIZED PROMPT for maximum speed and quality.**

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const Razorpay = require('razorpay'); // <-- Import Razorpay
const crypto = require('crypto'); // <-- Import Crypto for verification AND Job IDs
require('dotenv').config();

const app = express();
const PORT = 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- Environment Variable Check ---
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not set in the .env file.");
    process.exit(1);
}

// --- Razorpay API Key Check ---
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.error("FATAL ERROR: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set in the .env file.");
    process.exit(1);
}

// --- Initialize Razorpay ---
const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
});


// --- MOCK DATABASE AND CONFIGURATION ---
const ADMIN_PASSWORD = "admin123"; // WARNING: Use a secure method in production!

// In-memory store for active generation jobs
const generationJobs = {};

// Initial Mock Orders Data (to simulate persistence)
let mockOrders = [
    {
        _id: 'ord1001',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
        businessName: 'Innovate Tech Solutions',
        businessType: 'IT Consulting',
        userId: { phone: '9876543210', email: 'innovate@tech.com' },
        selectedDesignStyle: 'Tech & Futuristic',
        paymentStatus: 'advance_paid',
        orderStatus: 'new',
        advanceAmount: 199,
        finalAmount: 3999,
        deliveryUrl: '',
        selectedWebsiteHtml: '<html><head><title>Innovate Tech</title><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-gray-900 text-white p-10"><h1 class="text-4xl text-cyan-400">Innovate Tech Solutions</h1><p class="text-lg mt-4">This is the Tech & Futuristic design chosen by the client. Order ID: ord1001</p><a href="#" class="inline-block mt-6 px-4 py-2 bg-cyan-600 rounded">View Live Site</a></body></html>'
    },
    {
        _id: 'ord1002',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
        businessName: 'The Green Cafe',
        businessType: 'Organic Restaurant',
        userId: { phone: '8877665544', email: 'green@cafe.com' },
        selectedDesignStyle: 'Natural & Earthy',
        paymentStatus: 'full_paid',
        orderStatus: 'delivered',
        advanceAmount: 199,
        finalAmount: 3999,
        deliveryUrl: 'https://thegreencafe.live',
        selectedWebsiteHtml: '<html><head><title>Green Cafe</title><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-green-50 text-green-900 p-10"><h1 class="text-4xl text-green-700">The Green Cafe</h1><p class="text-lg mt-4">This is the Natural & Earthy design. Order ID: ord1002</p><a href="#" class="inline-block mt-6 px-4 py-2 bg-green-500 text-white rounded">Visit Site</a></body></html>'
    },
    {
        _id: 'ord1003',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        businessName: 'Modern Home Decor',
        businessType: 'E-commerce Store',
        userId: { phone: '7766554433', email: 'sales@modernhome.com' },
        selectedDesignStyle: 'Modern & Clean',
        paymentStatus: 'advance_paid',
        orderStatus: 'contacted',
        advanceAmount: 199,
        finalAmount: 3999,
        deliveryUrl: '',
        selectedWebsiteHtml: '<html><head><title>Modern Home</title><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-white text-gray-800 p-10"><h1 class="text-4xl text-gray-800">Modern Home Decor</h1><p class="text-lg mt-4">This is the Modern & Clean design. Order ID: ord1003</p></body></html>'
    }
];
// --- END MOCK DATABASE ---

// --- Helper function for exponential backoff retry logic ---
const fetchWithBackoff = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            const contentType = response.headers.get("content-type");

            if (response.ok && contentType && contentType.includes("application/json")) {
                return response.json();
            }

            if (response.status === 429) {
                 console.warn(`Quota exceeded (429). Retrying in ${delay * Math.pow(2, i)}ms... Attempt ${i + 1} of ${retries}.`);
                 if (i === retries - 1) {
                     throw new Error(`AI Service Error: Quota Exhausted (429). Please check your API key usage.`);
                 }
            } else if (response.status >= 400) {
                 const errorBodyText = await response.text();
                 console.error("AI API Non-JSON Error:", response.status, errorBodyText);
                 try {
                    const errorBodyJson = JSON.parse(errorBodyText);
                    throw new Error(`AI Service Error: ${errorBodyJson.error?.message || response.statusText}`);
                 } catch (e) {
                    throw new Error(`AI Service returned an invalid response (not JSON). Status: ${response.status}`);
                 }
            }
            
            if (!response.ok) {
                console.warn(`Request failed with status ${response.status}. Retrying in ${delay * Math.pow(2, i)}ms... Attempt ${i + 1} of ${retries}.`);
            }
        } catch (error) {
            if (i === retries - 1) throw error;
        }
        await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
    }
     throw new Error("Request failed after multiple retries.");
};

// --- Single Website Generation Function (Optimized for Speed) ---
const generateSingleWebsite = async (businessName, businessType, style, colorTheme) => {
    const TEXT_MODEL = "gemini-2.5-flash-preview-09-2025";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${API_KEY}`;
    
    const placeholderLogo = `https://placehold.co/150x50/FFFFFF/000000?text=${businessName.replace(/\s+/g, '+')}`;
    
    const systemPrompt = `**Objective:** Create a compact, professional, single-page HTML website.
**Output:** Raw HTML only. No markdown.
**Tech:** Tailwind CSS via CDN (\`<script src="https://cdn.tailwindcss.com"></script>\`).
**Content:** MUST include a Hero section, a 3-card Features/Services section (with simple inline SVG icons), and a simple Footer.
**Images:** Use Unsplash Source (\`https://source.unsplash.com/random/800x600/?<query>\`).
**Style:** Use user-provided style and colors. Keep it concise.`;

    const userPrompt = `Generate a website with a "${style}" design style and a "${colorTheme}" color palette for the following business:\n\nBusiness Name: ${businessName}\nBusiness Type: ${businessType}\n\nUse this Logo URL: ${placeholderLogo}\n\nGenerate the complete HTML code following all instructions.`;
    
    const payload = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userPrompt }] }],
    };
    
    const result = await fetchWithBackoff(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (result && result.candidates && result.candidates[0].content.parts[0].text) {
        let html = result.candidates[0].content.parts[0].text.trim();
        if (html.startsWith('```html')) {
            html = html.substring(7);
        }
        if (html.endsWith('```')) {
            html = html.substring(0, html.length - 3);
        }
        return html.trim();
    } else {
        console.error("Unexpected API response structure:", result);
        throw new Error(`HTML generation failed for style: ${style}. Invalid API response.`);
    }
};

// --- CLIENT-FACING API Routes ---

// STEP 1: Start the generation job
app.post('/api/start-generation', (req, res) => {
    const { businessName, businessType } = req.body;
    if (!businessName || !businessType) {
        return res.status(400).json({ error: 'Business Name and Type are required.' });
    }
    
    const jobId = crypto.randomUUID();
    generationJobs[jobId] = {
        businessName,
        businessType,
        status: 'pending',
    };
    
    console.log(`New generation job created: ${jobId}`);
    res.json({ success: true, jobId });
});

// STEP 2: Stream the results
app.get('/api/generation-stream/:jobId', (req, res) => {
    const { jobId } = req.params;
    const job = generationJobs[jobId];

    if (!job) {
        return res.status(404).json({ error: 'Job not found.' });
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for production

    const designVariations = [
        { style: "Modern & Clean", color: "White, Slate Gray, and Sky Blue", description: "Minimalist and structured layout with cool tones." },
        { style: "Elegant & Professional", color: "Off-white, Charcoal, and Gold", description: "Sophisticated design ideal for high-end services." },
        { style: "Natural & Earthy", color: "Beige, Forest Green, and Brown", description: "Organic feel with warm colors for eco-friendly businesses." },
        { style: "Bold & Vibrant", color: "Dark Gray, White, and Bright Red", description: "High-impact, eye-catching design with strong contrast." },
        { style: "Minimalist & Serene", color: "Light Gray, White, and a soft Sage Green", description: "Calm and simple, focusing heavily on readability." },
        { style: "Tech & Futuristic", color: "Deep Blue, Black, and Electric Cyan", description: "Sleek, dark mode design for technology and SaaS." }
    ];

    // Asynchronously generate and send each website
    (async () => {
        try {
            for (let i = 0; i < designVariations.length; i++) {
                const design = designVariations[i];
                const { businessName, businessType } = job;
                
                console.log(`Job ${jobId}: Generating design ${i + 1} (${design.style})...`);
                const html = await generateSingleWebsite(businessName, businessType, design.style, design.color);
                
                const data = {
                    html,
                    design,
                    index: i
                };
                
                // Send the data as an SSE message
                res.write(`data: ${JSON.stringify(data)}\n\n`);
            }
            
            // Send a "done" event
            console.log(`Job ${jobId}: All designs complete.`);
            res.write('event: done\ndata: {"message": "complete"}\n\n');
            
        } catch (error) {
            console.error(`Job ${jobId}: Error during generation:`, error);
            // Send an error event
            res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
        } finally {
            // Clean up and close the connection
            console.log(`Job ${jobId}: Closing connection.`);
            delete generationJobs[jobId];
            res.end();
        }
    })();

    // Handle client disconnect
    req.on('close', () => {
        console.log(`Job ${jobId}: Client disconnected.`);
        // Stop any ongoing generation if necessary (more complex logic)
        delete generationJobs[jobId];
        res.end();
    });
});

// --- Razorpay REAL Endpoints ---

app.post('/api/payment/create-order', async (req, res) => {
    const { amount } = req.body;
    const amountInPaise = amount * 100;

    const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const order = await razorpayInstance.orders.create(options);
        console.log("Razorpay Order Created:", order);
        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            razorpayKeyId: RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Razorpay order creation failed:", error);
        res.status(500).json({ success: false, error: "Failed to create payment order." });
    }
});

app.post('/api/payment/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        console.log(`--- Payment Verification SUCCESS ---`);
        
        const newOrder = {
            _id: razorpay_order_id,
            createdAt: new Date().toISOString(),
            businessName: orderData.businessName,
            businessType: orderData.businessType,
            userId: { phone: orderData.phone, email: orderData.email },
            selectedDesignStyle: orderData.selectedDesignStyle,
            paymentStatus: 'advance_paid',
            orderStatus: 'new',
            advanceAmount: 199,
            finalAmount: 3999,
            deliveryUrl: '',
            selectedWebsiteHtml: orderData.selectedWebsiteHtml,
            razorpay_payment_id: razorpay_payment_id
        };

        mockOrders.unshift(newOrder);
        console.log(`New Order Created for ${newOrder.businessName}.`);
        console.log(`Payment ID: ${razorpay_payment_id}`);
        console.log(`-----------------------------------------`);

        res.json({
            success: true,
            message: 'Payment verified and order confirmed.',
        });

    } else {
        console.error("Payment Verification FAILED: Signatures do not match.");
        res.status(400).json({ success: false, error: 'Payment verification failed. Signature mismatch.' });
    }
});


// --- ADMIN API Routes ---

app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        return res.json({ success: true, message: 'Login successful' });
    }
    res.status(401).json({ success: false, error: 'Invalid password' });
});

app.get('/api/admin/orders', (req, res) => {
    setTimeout(() => {
        res.json({ success: true, orders: mockOrders });
    }, 500);
});

app.put('/api/admin/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const { orderStatus, deliveryUrl, paymentStatus } = req.body;

    const orderIndex = mockOrders.findIndex(o => o._id === orderId);

    if (orderIndex === -1) {
        return res.status(4404).json({ success: false, error: 'Order not found' });
    }

    mockOrders[orderIndex].orderStatus = orderStatus;
    mockOrders[orderIndex].paymentStatus = paymentStatus;
    
    if (deliveryUrl && deliveryUrl !== mockOrders[orderIndex].deliveryUrl) {
        mockOrders[orderIndex].deliveryUrl = deliveryUrl;
        mockOrders[orderIndex].orderStatus = 'delivered';
    }

    res.json({ success: true, order: mockOrders[orderIndex] });
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`Admin Password: ${ADMIN_PASSWORD}`);
});