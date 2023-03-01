// seed.js is to see sample users
import data from "@/utils/data";
import db from "@/utils/db";
import Product from "@/models/Product";
import User from "@/models/User";
const handler = async (req, res) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Product.deleteMany(); // seed api we delete all products in the product collection
  await Product.insertMany(data.products); //and then we insert sample products in the data.js in the mongodb database
  res.send({ message: "seeded successfully" });
};
export default handler;
