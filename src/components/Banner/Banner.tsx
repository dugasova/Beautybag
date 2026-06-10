import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';

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
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const playActiveVideo = (swiper: SwiperClass) => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === swiper.realIndex) {
        video.play().catch(() => { });
      } else {
        video.pause();
      }
    });
  };

  return (
    <div className="container">
      <main className='main'>
        <div className='hero-section' aria-label="Promotional video banner">
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
            onSwiper={playActiveVideo}
            onSlideChange={playActiveVideo}
          >
            {videos.map((vid, index) => (
              <SwiperSlide key={vid}>
                <div className="swiper-slide-inner">
                  <video
                    ref={(el) => { videoRefs.current[index] = el; }}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    disablePictureInPicture
                    controlsList="nodownload"
                    aria-hidden="true"
                    className='hero-video'
                  >
                    <source src={`${vid}#t=0.1`} type="video/mp4" />
                  </video>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </main>
    </div>
  );
}
