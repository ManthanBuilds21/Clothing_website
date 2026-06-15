import HeroCarousel from '../../sections/hero/HeroCarousel'
import BrandStorySection from '../../sections/about/BrandStorySection'
import FeaturedCollectionsSection from '../../sections/collections/FeaturedCollectionsSection'
import LookbookSection from '../../sections/LookbookSection'
import NewsletterSection from '../../sections/NewsletterSection'
import BestSellersSection from '../../sections/products/BestSellersSection'
import NewArrivalsSection from '../../sections/products/NewArrivalsSection'

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <FeaturedCollectionsSection />
      <NewArrivalsSection />
      <BrandStorySection />
      <BestSellersSection />
      <LookbookSection />
      <NewsletterSection />
    </>
  )
}
