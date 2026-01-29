import { ProductVariantImage } from "@/generated/prisma";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import { useEffect, useRef } from "react";

const ProductCardImageSwiper = ({
  images,
}: {
  images: ProductVariantImage[];
}) => {
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    swiperRef.current?.swiper?.autoplay.stop();
  }, [swiperRef]);

  return (
    <div
      className="relative mb-2 w-full h-[200px] bg-white contrast-[90%] rounded-2xl overflow-hidden"
      onMouseEnter={() => {
        swiperRef.current.swiper.autoplay.start();
      }}
      onMouseLeave={() => {
        swiperRef.current.swiper.autoplay.stop();
        swiperRef.current.swiper.slideTo(0);
      }}
    >
      {/* <Swiper modules={[Navigation, Pagination, Autoplay]} navigation pagination={{ clickable: true }} autoplay={{ delay: 3000 }} loop={true} className="w-full h-full">
       */}
      <Swiper ref={swiperRef} modules={[Autoplay]} autoplay={{ delay: 500 }}>
        {images.map((image) => (
          <SwiperSlide key={image.id} className="w-full h-full">
            <Image
              src={image.imageUrl}
              alt="Product Image"
              className="block object-cover  h-50 w-48 sm:w-52"
              width={400}
              height={400}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductCardImageSwiper;
