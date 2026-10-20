import { SEO } from '@/components/SEO';
import { DuringStrip, FinderTeaser, HomeFaq, HomeHero, Hotlines, OfflineNote, RecentQuakes } from '@/components/home';
import { useLocaleStore } from '@/store/localeStore';
import { getHomeSEO } from '@/utils/seo';

const Home: React.FC = () => {
  const isPhilippines = useLocaleStore((s) => s.countryCode === 'PH');

  return (
    <>
      <SEO {...getHomeSEO()} />
      <HomeHero />
      <RecentQuakes />
      <DuringStrip />
      <Hotlines />
      <section
        aria-labelledby={isPhilippines ? 'home-finder' : 'home-offline'}
        className={`page-wrap grid gap-8 py-8 ${isPhilippines ? 'md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-10' : ''}`}
      >
        {isPhilippines && <FinderTeaser />}
        <div className={isPhilippines ? 'md:pt-5' : ''}>
          <OfflineNote />
        </div>
      </section>
      <HomeFaq />
    </>
  );
};

export default Home;
