//import HeroSection from './HeroSection'
import LatestJobs from './LatestJobs'
import CategoryCarousel from './CategoryCarousel'
import HeroSection from './HeroSection'
import { Accordion } from './ui/accordion'

const Home = () => {
  return (
    <div>
      <HeroSection/>
      <CategoryCarousel/>
      <LatestJobs />
      <Accordion/>
    </div>
  )
}

export default Home