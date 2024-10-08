"use client";
import { Heart } from "@/assets/svg/Heart";
import { Star } from "@/assets/svg/Star";
import { TransparentStar } from "@/assets/svg/TransparentStar";
import { addToCart } from "@/components/ProductSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";

const fetchProducts = async (productId) => {
  try {
    const res = await fetch(`https://dummyjson.com/products/${productId}`);
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetching error:", error);
    return null;
  }
};
const renderRating = (rating) => {
  return Array.from({ length: 5 }, (_, index) => {
    let ratingNumber = index + 0.5;
    return rating >= index + 1 && rating > ratingNumber ? (
      <Star key={index} />
    ) : (
      <TransparentStar key={index} />
    );
  });
};

const ProductDetails = ({ productId }) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let dispatch = useDispatch();
  let handleCart = (item) => {
    toast("Added to cart");
    dispatch(addToCart({ ...item, qun: 1 }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchProducts(productId);
      if (data) {
        setItem(data);
        setError(null);
      } else {
        setError("Failed to fetch product details.");
      }
      setLoading(false);
    };

    fetchData();
  }, [productId]);

  if (loading) return <></>;
  if (error) return <></>;

  return (
    <div className="w-full lg:h-[470px] p-[25px] rounded-[2px] box-shadow5 my-[48px] lg:my-[121px]">
      <div className="lg:flex">
        <div className="flex flex-wrap justify-between lg:block">
          {item.images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`${item.title} image ${index + 1}`}
              width={177}
              height={1}
              className="w-[32%] lg:w-[182px] bg-[#F6F7FB] mb-[25px]"
            />
          ))}
        </div>
        <div className="lg:w-[375px] lg:h-[410px] lg:pt-[100px]  bg-[#F6F7FB] lg:ml-[25px] lg:mr-[41px]">
          <Image
            src={item.thumbnail}
            alt={item.title}
            width={375}
            height={5}
            className="w-[100%] lg:w-[375px]"
          />
        </div>
        <div className="">
          <div className="text-[#0D134E] text-[36px] font-semibold pt-[61px]">
            {item.title}
          </div>
          <div className="flex gap-x-[3px] my-[14px]">
            {renderRating(item.rating)}
          </div>
          <div className="flex gap-x-[18px]">
            <div className="text-[#151875] text-[16px] font-normal">
              ${item.price}
            </div>
            {item.discountPercentage > 0 && (
              <div className="text-[#FB2E86] text-[16px] font-normal line-through">
                $
                {((item.price / (100 - item.discountPercentage)) * 100).toFixed(
                  2
                )}
              </div>
            )}
          </div>
          <div className="text-[#A9ACC6] text-[16px] font-semibold mt-[14px] mb-[34px]">
            {item.description}
          </div>
          <button
            className="flex items-center gap-x-[26px] text-[#151875] text-[16px] font-normal"
            onClick={() => handleCart(item)}
          >
            Add to cart <Heart />
          </button>
          {item.category && (
            <div className="pt-[17px] pb-[10px] text-[#151875] text-[16px] font-semibold capitalize">
              Category: <span className="font-normal">{item.category}</span>
            </div>
          )}
          {item.brand && (
            <div className="pb-[10px] text-[#151875] text-[16px] font-semibold capitalize">
              Brand: <span className="font-normal">{item.brand}</span>
            </div>
          )}
          {item.stock !== undefined && (
            <div className="text-[#151875] text-[16px] font-semibold capitalize">
              Stock: <span className="font-normal">{item.stock}</span>
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={800}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default ProductDetails;
