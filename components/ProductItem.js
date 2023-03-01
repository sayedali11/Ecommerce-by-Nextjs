/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

const ProductItem = ({ product, addToCartHandler }) => {
  return (
    <div className="card transition-all hover:scale-105  shadow-md">
      <Link href={`/product/${product.slug}`}>
        <p>
          <img
            src={product.image}
            alt={product.name}
            className="rounded-t-lg w-full"
          />
        </p>
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg">{product.name}</h2>
        </Link>
        <p className="mb-2"> {product.brand}</p>
        <p>${product.price}</p>
        <button
          className="primary-button mt-2 text-black"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
