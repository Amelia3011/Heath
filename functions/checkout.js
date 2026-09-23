export async function onRequestPost(context) {
    try {
        const bodyText = await context.request.text();

        // ⚠️ FINAL STEP: Paste your LIVE HitPay API Key here!
        // You can find this in your HitPay Dashboard under Developers > API Keys
        const HITPAY_API_KEY = "live_92b0b068df82a71ea8999fe9ef30b74ac9cc612d276c1b8eb483c0a5ed957760";

        // ⚠️ LIVE ENDPOINT (Notice 'sandbox' is removed from the URL)
        const response = await fetch("https://api.hit-pay.com/v1/payment-requests", {
            method: "POST",
            headers: {
                "X-BUSINESS-API-KEY": HITPAY_API_KEY,
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: bodyText
        });

        const data = await response.json();

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
