// create  products category
import db from "@/utils/db";
import Product from "@/models/Product";

const handler = async (req, res) => {
  await db.connect();
  const categories = await Product.find().distinct("category");
  await db.disconnect();
  res.send(categories);
};

export default handler;
