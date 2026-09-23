// Complete, well-commented, runnable code for this single file
export async function onRequestPost(context) {
    try {
        // 1. Read the payment data sent securely from your index.html frontend
        const bodyText = await context.request.text();

        // 2. ⚠️ INSERT YOUR HITPAY LIVE API KEY HERE ⚠️
        // This file runs entirely on Cloudflare's secure servers.
        // Your key is completely hidden from the public browser here.
        const HITPAY_API_KEY = "live_92b0b068df82a71ea8999fe9ef30b74ac9cc612d276c1b8eb483c0a5ed957760";

        // 3. Forward the exact same request to HitPay securely
        const response = await fetch("https://api.hit-pay.com/v1/payment-requests", {
            method: "POST",
            headers: {
                "X-BUSINESS-API-KEY": HITPAY_API_KEY,
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: bodyText
        });

        // 4. Get the secure checkout URL back from HitPay
        const data = await response.json();

        // 5. Send that URL back to your index.html so it can redirect the customer
        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Backend connection failed." }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
