import { initializePayment, verifyPayment } from "../code/paystack.js";

// Initialize payment
app.post("/pay", async (req, res) => {
  try {
    const form = {
      ...req.body,
      amount: req.body.amount * 100, // Convert to kobo
      callback_url: process.env.CALLBACK_URL,
    };

    const response = await initializePayment(form);
    res.json(response);
    console.log("Payment initialized:", response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while initializing payment" });
  }
});

// Verify payment
app.get("/verify-payment/:reference", async (req, res) => {
  try {
    const reference = req.params.reference;
    const response = await verifyPayment(reference);

    if (response.data.status === "success") {
      // Payment was successful
      // Update your database here
      res.json({ success: true, data: response.data });
    } else {
      res.json({ success: false, message: "Payment not successful" });
    }
    console.log("Payment successful:", response.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while verifying payment" });
  }
});
