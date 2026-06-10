import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './Banner.css';
import Video from '../../assets/videos/video.mp4';
import Video2 from '../../assets/videos/video2.mp4';
import Video3 from '../../assets/videos/video3.mp4';
import Video4 from '../../assets/videos/video4.mp4';

const videos = [Video, Video2, Video3, Video4];

export default function Banner() {
  return (
    <div className="container">

      <main className='main'>
        <div className='hero-section'>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            loop={true}
            className="hero-swiper"
          >
            {videos.map((vid, index) => (
              <SwiperSlide key={index}>
                <div className="swiper-slide-inner">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className='hero-video'
                  >
                    <source src={vid} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className='hero-overlay'>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </main>
    </div>

  );
}
