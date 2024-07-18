'use client';

interface CarouselProps {
  images: string[];
}

import React, { Component } from 'react';

// pages/-app.js
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

const ImageCarousel = ({ images }: CarouselProps) => {
  return (
    <Carousel>
      {images.map((image, index) => (
        <img key={index} src={image} alt='' />
      ))}
    </Carousel>
  );
};

export default ImageCarousel;
