import React, { useContext, useEffect, useState } from "react";
import CheckoutWizard from "@/components/CheckoutWizard";
import { Store } from "@/context/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Layout from "../components/Layout";

export default function PaymentScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  const router = useRouter();

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error("Payment method is required");
    }
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );
    router.push("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push("/shipping");
    }
    setSelectedPaymentMethod(paymentMethod || "");
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {/* //define this array paypal stripe and cash on delivery they are the payment ways, function to convert each payment method to a <div></div> in the div set the key to the payments to make it unique and set class */}
        {["PayPal", "Stripe", "CashOnDelivery"].map((payment) => (
          <div key={payment} className="mb-4">
            <input
              name="paymentMethod"
              className="p-2 outline-none focus:ring-0"
              id={payment}
              type="radio"
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />
            <label className="p-2" htmlFor={payment}>
              {payment}
            </label>
          </div>
        ))}

        <div className="mb-4 flex justify-between">
          <button
            onClick={() => router.push("/shipping")}
            type="button"
            className="default-button text-black"
          >
            Back
          </button>
          <button className="primary-button text-black">Next</button>
        </div>
      </form>
    </Layout>
  );
}

PaymentScreen.auth = true;
