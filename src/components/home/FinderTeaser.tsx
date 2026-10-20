import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { philippinesCities } from '@/data/philippines-regions';
import { BiTitle } from './BiTitle';
import { useBilingual } from './useBilingual';

const CITY_COUNT = philippinesCities.length;
const REGION_COUNT = new Set(philippinesCities.map((c) => c.region)).size;

export const FinderTeaser = () => {
  const { t } = useBilingual();
  return (
    <div>
      <BiTitle id="home-finder" k="finder.title" kicker={t('finder.kicker')} />
      <p className="max-w-xl text-lg">{t('finder.text', { cities: CITY_COUNT, regions: REGION_COUNT })}</p>
      <Button asChild size="lg" className="mt-5">
        <Link to="/emergency-finder">{t('finder.link')}</Link>
      </Button>
    </div>
  );
};
