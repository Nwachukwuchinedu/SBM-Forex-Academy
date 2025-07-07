import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

export const initializePayment = async (form) => {
  try {
    const response = await paystack.post("/transaction/initialize", form);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const verifyPayment = async (ref) => {
  try {
    const response = await paystack.get(
      `/transaction/verify/${encodeURIComponent(ref)}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
