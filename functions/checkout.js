export async function onRequestPost(context) {
    try {
        const bodyText = await context.request.text();

        // ⚠️ TEMPORARY: Use your SANDBOX API Key here while testing
        const HITPAY_API_KEY = "test_1554ccdaf16fec87c81079393854722844f09859a9c5c4fe6bde22d8d31f55db";

        // ⚠️ TEMPORARY: Point to the Sandbox API URL while testing
        const response = await fetch("https://api.sandbox.hit-pay.com/v1/payment-requests", {
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
