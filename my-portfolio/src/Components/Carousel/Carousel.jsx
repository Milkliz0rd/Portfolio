import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import projets from '../../Data/Projets.json'
import ArcadeItem from '../ArcadeItem/ArcadeItem'

const Carousel = () => {
  return (
    <div className="carousel">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          500: { slidesPerView: 1 },
          930: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {projets.map((projet) => (
          <SwiperSlide key={projet.id}>
            <ArcadeItem projet={projet} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Carousel
