//  Create an api to get the order details by order id

import db from "@/utils/db";
import Order from "@/models/Order";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send("signin required");
  }

  await db.connect();

  const order = await Order.findById(req.query.id);
  await db.disconnect();
  res.send(order);
};

export default handler;
