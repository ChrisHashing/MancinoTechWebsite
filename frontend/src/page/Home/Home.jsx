import React, { useEffect } from 'react'
import HeroSection from '../../sections/HeroSection/HeroSection'
import StoreSection from '../../sections/StoreSection/StoreSection'
import BottomSection from '../../sections/BottomSection/BottomSection'

function Home() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <HeroSection />
      <StoreSection />
      <BottomSection />
    </div>
  )
}

export default Home