import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import projets from '../../Data/Projets.json'

const Carousel = () => {
  return (
    <div className="carousel-element">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={0}
        slidesPerView={3}
        breakpoints={{
          500: { slidesPerView: 1 },
          930: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {projets.map((projet) => (
          <SwiperSlide key={projet.id}>
            <div className="carousel__slide">
              <img src={projet.arcade.close} alt="" width={400} height={400} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Carousel
