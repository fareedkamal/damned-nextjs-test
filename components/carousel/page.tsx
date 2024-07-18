'use client';

interface CarouselProps {
  images: string[];
}

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import { Loader } from '../utils';

const ImageCarousel = ({ images }: CarouselProps) => {
  return (
    <Carousel>
      {images.map((image, index) => (
        // <Image key={index} src={image} alt='' height={1000} width={1000} />
        <img key={index} src={image} alt='' />
      ))}
    </Carousel>
  );
};

export default ImageCarousel;
