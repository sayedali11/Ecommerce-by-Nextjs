// define a handler here and export the handler function , going to do in this api is to connect to the database get the product in the database using findById method

import db from "@/utils/db";
import Product from "@/models/Product";

const handler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
};

export default handler;
