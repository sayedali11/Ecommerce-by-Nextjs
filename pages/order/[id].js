// let's go to the front-end part what we're gonna do  in the front end is to create a new page  at this address slash order id so we need to create a folder inside pages and the folder name is order inside and set file name to id dot js , inside this file create order screen

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";

// and use switch statement to check the action.type  if it is FETCH_REQUEST the state that i'm going to return is previous state ( return { ...state) but  change loading to true and change error to empty (return { ...state, loading: true, error: '' }) it means that i send ajax request to back end and i want to show a loading message and no errormessage and no error  , the next state is 'FETCH_SUCCESS' it happens after getting data from backend so loading is false order is coming from the action.payload and there is no error  ,  the next state is 'FETCH_FAIL'  for error states show loading to false and show the error based on the error in the action.payload  , for default case just return the state as it is default:  state;
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };
    default:
      state;
  }
}
function OrderScreen() {
  // order/:id
  const { query } = useRouter();
  const orderId = query.id;
  // define use paypal script reducer it's a hook , reducer is is pending states and paypal dispatch we use paypalDispatch to reset the options and set the client id for  paypal go to the user effect and in the else part we are going to define loadPaypalScript let's define this function it's an async function and what it does  is to load the script reset the options and what we're gonna do in the load script function is to get the client id from the backend here is the code to get the client id use  axios.get this address api ('/api/keys/paypal') and get the client id we will implement this api  (const { data: clientId }) after finishing this function after getting client id use paypalDispatch to set the client id for the paypal script (paypalDispatch({ type: 'resetOptions',value: {'client-id': clientId,  currency: 'USD', },});) and set the currency to the currency that you want to have i'm using usd after dispatching resetOptions it's time to dispatch another action from paypal script and it's setLoadingStatus to pending at the end we need to  call this function (loadPaypalScript) and click here on the lamp to add  paypalDispatch to the dependency array [order, orderId,paypalDispatch] for the use effect , great so at this point i'm loading the script (loadPaypalScript)  but to use the paypal script we need to go to the app.js

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  // and the first parameter is the reducer function we need to implement the reducer function later second parameter is default value for the default value we load data on page load so i set loading to true we want to get the order so i set the order to empty object and we want to show an error if there is an issue in getting order so the order by default is empty  it means that there is no error and from the reducer we are going to get loading  error and order and the second thing that we are going to get from the  reducer hook is dispatch  to dispatch actions let's define the reducer above order
  // use reducer in id.js from use reducer i'm going to get successPay from the reducer and inside the if condition in the useEffect here add  successPay if success pay we need to fetchOrder because i'm going to update the state of the order based on the latest data from backend and inside the if condition check successPay if it's true dispatch pay resets we need to reset the payment status for the next orders go to the reducer function here  undefine pay request case so it happens when i'm going to update a state of payment of current order in the back end so change loadingPay to true  the next one is 'PAY_SUCCESS' when i updated the state of payment i'm going to to change the successPay to true and set loadingPay to false if there is an error 'PAY_FAIL'  the errorPay with the action.payload and this one is for 'PAY_RESET' set loadingPay to false successPay to false and errorPay to empty a string , get loadingPay  , click on the lamp click update and add the success pay to the dependency array of the use effect  [order, orderId,paypalDispatch, successPay]
  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: "",
    });

  // i'm going to define the use effect because i'm gonna send an ajax request  to back end on page load that's why i need to define use effect and inside that define fetch order function it is an async function  and call it right after defining this function what i'm gonna do here is to dispatch 'FETCH_REQUEST' first then send an ajax request to backend using axios.get slash api slash order order id (axios.get(`/api/orders/${orderId}`)) we already implemented this api in this (in [id].js in folder api folder orders) after getting the order from back end it's in the data {data} dispatch fetch success FETCH_SUCCESS  and pass the data the order as a payload so it's gonna be saved inside the order (order: action.payload) in the reducer here { loading, error, order } ,wrap it inside try catch here  try and catch if there is an error dispatch FETCH_FAIL and the payload is get error pass the error to get the correct error message from the error object , update if there [order, orderId] is a change in the order id use effect runs again, a condition for calling fetchOrder if order that id does not exist it means that we don't have order id we need to fetch order if the order id exists but order that underline id does not equal to the orderId  in the url it means that we have  order but it's about the previously visited order id so i need to fetchOrder for the new order (orderId) in the url  here if there is a change in the order or order id run use effect function again
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal");
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [order, orderId, paypalDispatch, successPay]);

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  // it accept two parameter data and actions and it returns  action.order and call create method on order object this parameter purchase units equal to and pass this parameter purchase units equal to an array and in this array we have an object and in this object we have amount and amount is an object that that has a value filled and the value is  total price from the order  it returns a promise so after this  call then and get the orderId and return it
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  // the next function is on approve what i'm gonna do in the unapprove is to call capture an order object in paypal so what this function does (order.capture())is to confirm the payment commit the payments complete the payment and it returns a promise so i use then and get the details  (details) here it's time to update the state of order in the backend  if there is an error dispatch  'PAY_SUCCESS' show the error message then use toast to show the error message , react hostify in the try part simply dispatch 'PAY_REQUEST' to show a loading message then call this api put method on this address slash api  slash  (put( `/api/orders/${order._id}/pay`,  details );) pay pass the details from the paypal like this and we need to implement this api later after success payment dispatch pay after success payment dispatch 'PAY_SUCCESS'  success and show this beautiful message orders paid successfully
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is paid successgully");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function onError(err) {
    toast.error(getError(err));
  }

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </div>
              {isDelivered ? (
                <div className="alert-success">Delivered at {deliveredAt}</div>
              ) : (
                <div className="alert-error">Not delivered</div>
              )}
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">Paid at {paidAt}</div>
              ) : (
                <div className="alert-error">Not paid</div>
              )}
            </div>

            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="    p-5 text-right">Quantity</th>
                    <th className="  p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link href={`/product/${item.slug}`}>
                          <div className="flex items-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                            &nbsp;
                            {item.name}
                          </div>
                        </Link>
                      </td>
                      <td className=" p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>{" "}
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
                {/* is paid is false it means that we need  to show the paypal button because it's not paid then render this ally create an ally  inside ally check isPending spending is a variable that check loading of paypal script in the web application so if it's pending show loading  otherwise in a dev with class name with  render paypal buttons then set createOrder onApprove and onError handler to three functions that we will implement later*/}
                {!isPaid && (
                  <li>
                    {isPending ? (
                      <div>Loading...</div>
                    ) : (
                      <div className="w-full">
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {/* if loadingPay  if it's true show the loading box  */}
                    {loadingPay && <div>Loading...</div>}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
// order screen function make this function auth to true so only authenticated user can have access to this page and export it
OrderScreen.auth = true;
export default OrderScreen;
