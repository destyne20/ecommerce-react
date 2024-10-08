import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FetchedProductsContext } from "../context/AppContext";
import { Product } from "../components/Product";
import { ProductPageSkeleton } from "../components/ProductPageSkeleton";
import { ProductSkeleton } from "../components/ProductSkeleton";

const ProductPage = ({ setProductsInCart }) => {
  const { products } = useContext(FetchedProductsContext);
  const { id } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // ensure User sees the top of the product page when navigating to it
    window.scrollTo(0, 0);
  }, []);

  function updateProductsInCart(productsInCart) {
    let productAlreadyInCart = false;
    let products;

    if (productsInCart.length > 0) {
      products = productsInCart.map((productInCart) => {
        // update product quantity if already in cart
        if (productInCart.product.id === selectedProduct.id) {
          productAlreadyInCart = true;
          return { ...productInCart, quantity };
        }
        return productInCart;
      });

      if (!productAlreadyInCart) {
        products.push({ product: selectedProduct, quantity });
      }

      return products;
    }

    return [{ product: selectedProduct, quantity }];
  }

  async function fetchProduct() {
    const { data } = await axios.get(
      `https://ecommerce-samurai.up.railway.app/product/${id}`
    );

    const productData = data.data;

    setSelectedProduct(productData);
    setSelectedImage(productData.images[0]);
    setQuantity(1);
  }

  useEffect(() => {
    fetchProduct();
  }, [id]);

  return (
    <main className="products__main">
      <div className="container">
        <div className="row product-page__row">
          {selectedProduct ? (
            <>
              <div className="selected-product">
                <div className="selected-product__left">
                  <figure className="selected-product__img__wrapper">
                    <img
                      src={`https://ecommerce-samurai.up.railway.app/${selectedImage}`}
                      alt=""
                      className="selected-product__img"
                    />
                  </figure>
                  <div className="selected-product__img__options">
                    {selectedProduct?.images.map((image, index) => (
                      <img
                        key={index}
                        src={`https://ecommerce-samurai.up.railway.app/${image}`}
                        alt=""
                        className="selected-product__img__option"
                        onClick={() =>
                          setSelectedImage(selectedProduct.images[index])
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="selected-product__right">
                  <h1 className="selected-product__title">
                    {selectedProduct?.name}
                  </h1>
                  <p className="selected-product__para">
                    {selectedProduct?.description}
                  </p>
                  <div className="selected-product__quantity">
                    <span className="selected-product__quantity__span selected-product__quantity__span-1">
                      Quantity
                    </span>
                    <div className="selected-product__quantity__wrapper">
                      <button
                        onClick={() => {
                          if (quantity > 1) {
                            console.log();
                            setQuantity((prevQuantity) => prevQuantity - 1);
                          }
                        }}
                        className="selected-product__quantity__btn"
                      >
                        -
                      </button>
                      <div className="selected-product__quantity__amount">
                        {quantity}
                      </div>
                      <button
                        onClick={() => {
                          if (quantity < 100) {
                            setQuantity((prevQuantity) => prevQuantity + 1);
                          }
                        }}
                        className="selected-product__quantity__btn"
                      >
                        +
                      </button>
                    </div>
                    <span className="selected-product__quantity__span selected-product__quantity__span-2">
                      ${products[0]?.price}
                    </span>
                    <button
                      onClick={() => {
                        setProductsInCart((productsInCart = []) =>
                          updateProductsInCart(productsInCart)
                        );
                      }}
                      className="selected-product__add"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
              <div className="specifications">
                <div className="spec">
                  <h2 className="spec__title">Weight</h2>
                  <span className="spec__detail">{products[0]?.weight}</span>
                </div>
                <div className="spec">
                  <h2 className="spec__title">Texture</h2>
                  <span className="spec__detail">{products[0]?.texture}</span>
                </div>{" "}
                <div className="spec">
                  <h2 className="spec__title">Size</h2>
                  <span className="spec__detail">{products[0]?.size}</span>
                </div>
              </div>
            </>
          ) : (
            <ProductPageSkeleton />
          )}
          <div className="recommendations">
            <h2 className="products__title">Trending Now</h2>
            <div className="products__list">
              {products.length > 0 && selectedProduct
                ? products
                    .filter((product) => product.id !== selectedProduct.id)
                    .slice(0, 4)
                    .map((product) => (
                      <Product product={product} key={product.id} />
                    ))
                : new Array(4)
                    .fill(0)
                    .map((_, index) => <ProductSkeleton key={index} />)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
