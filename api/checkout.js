xport default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { cart, shippingZone, customer } = req.body;

        const PRICES = { wood: 109, driver: 119 };
        const BUNDLE_PRICE = 218;

        let woods = cart.filter(item => item.type === 'wood').length;
        let drivers = cart.filter(item => item.type === 'driver').length;

        let bundlesCount = Math.min(woods, drivers);
        let productsTotal = (bundlesCount * BUNDLE_PRICE) + 
                    ((woods - bundlesCount) * PRICES.wood) + 
                    ((drivers - bundlesCount) * PRICES.driver);

        let shippingFee = 0;
        let zoneName = "West Malaysia";
        if (shippingZone === 'west') { shippingFee = 10; zoneName = "West Malaysia"; }
        if (shippingZone === 'east') { shippingFee = 15; zoneName = "East Malaysia"; }

        let total = productsTotal + shippingFee;

        const hitpayUrl = 'https://api.sandbox.hit-pay.com/v1/payment-requests';
        
        // We use the address object explicitly supported by HitPay's payment-requests API
        const hitpayPayload = {
            amount: total,
            currency: 'MYR',
            reference_number: 'BARREL-' + Date.now(), 
            purpose: `Barrel Headcovers (${zoneName})`,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: {
                line1: customer.address,
                city: customer.city,
                state: customer.state,
                postal_code: customer.postcode,
                country: 'MY'
            },
            redirect_url: 'https://' + req.headers.host + '/?status=success' 
        };

        const response = await fetch(hitpayUrl, {
            method: 'POST',
            headers: {
                'X-BUSINESS-API-KEY': process.env.HITPAY_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(hitpayPayload)
        });

        const data = await response.json();

        if (response.ok && data.url) {
            res.status(200).json({ url: data.url });
        } else {
            console.error("HitPay API Error:", data); // Log the exact error for debugging
            res.status(400).json({ error: 'Failed to create payment link', details: data });
        }

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
