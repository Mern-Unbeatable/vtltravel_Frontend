import HeroSection from './sections/HeroSection'
import FerryTicketsSection from './sections/FerryTicketsSection'
import FamilyPackagesSection from './sections/FamilyPackagesSection'

import EpicSaleSection from './sections/EpicSaleSection'
import { GroupIcon } from 'lucide-react'
import GroupToursSection from './sections/GroupToursSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <FerryTicketsSection />
      <FamilyPackagesSection />
      <EpicSaleSection />
      <GroupToursSection />

    </>
  )
}
