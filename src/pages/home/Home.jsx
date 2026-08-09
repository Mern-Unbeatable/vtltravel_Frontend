import HeroSection from './sections/HeroSection'
import FerryTicketsSection from './sections/FerryTicketsSection'
import FamilyPackagesSection from './sections/FamilyPackagesSection'
import EpicSaleSection from './sections/EpicSaleSection'
import GroupToursSection from './sections/GroupToursSection'

const Home = () => {
  return (
    <>
      <HeroSection />
       <EpicSaleSection />
      <FerryTicketsSection />
      <FamilyPackagesSection />
      <GroupToursSection />
    </>
  )
}

export default Home
