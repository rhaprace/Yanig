import type { NewsArticle, NewsCategoryId } from '@/types/news';

/** Category ids for the filter. Names come from the "about" translation file (news.categories). */
export const NEWS_CATEGORY_IDS: Array<'all' | NewsCategoryId> = [
  'all',
  'safety',
  'research',
  'preparedness',
  'technology',
  'community',
];

/**
 * Sample articles. Yanig shows these only when it cannot get real news.
 * They are general safety notes written for Yanig, not news reports.
 * The page labels them "Sample articles".
 */
type SampleText = Pick<NewsArticle, 'title' | 'excerpt' | 'content'>;
interface SampleArticle extends Omit<NewsArticle, 'title' | 'excerpt' | 'content'> {
  text: { en: SampleText; tl: SampleText };
}

const SAMPLE_ARTICLES: SampleArticle[] = [
  {
    id: 'sample-go-bag',
    author: 'Yanig',
    source: 'Yanig',
    datePublished: '2026-10-01T00:00:00Z',
    category: 'preparedness',
    tags: ['preparedness', 'emergency'],
    readTime: 2,
    text: {
      en: {
        title: 'What to put in your go-bag',
        excerpt: 'A go-bag holds the things you need for the first three days after an earthquake.',
        content: `A go-bag is a bag you can carry when you must leave your home fast. Keep it near the door.

- Water: 4 litres for each person for each day, for 3 days
- Food that does not need cooking
- First aid kit and your medicines
- Flashlight, radio and extra batteries
- Whistle to call for help
- Copies of IDs and important papers in a waterproof bag
- Cash in small bills

Check the bag every 6 months. Replace old food, water and batteries.`,
      },
      tl: {
        title: 'Ano ang ilalagay sa iyong go-bag',
        excerpt: 'Nasa go-bag ang mga kailangan mo sa unang tatlong araw pagkatapos ng lindol.',
        content: `Ang go-bag ay bag na madadala mo kapag kailangan mong umalis agad ng bahay. Itabi ito malapit sa pinto.

- Tubig: 4 litro bawat tao bawat araw, para sa 3 araw
- Pagkaing hindi kailangang lutuin
- First aid kit at ang iyong mga gamot
- Flashlight, radyo at ekstrang baterya
- Pito para humingi ng tulong
- Kopya ng mga ID at mahahalagang papeles sa bag na hindi nababasa
- Pera na maliliit na halaga

Suriin ang bag tuwing 6 na buwan. Palitan ang lumang pagkain, tubig at baterya.`,
      },
    },
  },
  {
    id: 'sample-drop-cover-hold',
    author: 'Yanig',
    source: 'Yanig',
    datePublished: '2026-10-01T00:00:00Z',
    category: 'safety',
    tags: ['safety', 'earthquake'],
    readTime: 2,
    text: {
      en: {
        title: 'Drop, Cover, Hold on: what each step means',
        excerpt: 'Do these three steps as soon as you feel shaking.',
        content: `When the ground shakes, do not run outside. Most injuries happen when people move during the shaking.

1. Drop: Go down on your hands and knees.
2. Cover: Get under a strong table. If there is no table, cover your head and neck with your arms.
3. Hold on: Hold the table leg until the shaking stops.

Stay away from windows, glass and tall furniture. When the shaking stops, check for injuries. Then go out carefully. Aftershocks can come.`,
      },
      tl: {
        title: 'Dapa, Takip, Kapit: ang ibig sabihin ng bawat hakbang',
        excerpt: 'Gawin ang tatlong hakbang na ito kapag naramdaman mo ang pagyanig.',
        content: `Kapag yumanig ang lupa, huwag tumakbo palabas. Karamihan ng sugat ay nangyayari kapag gumagalaw ang tao habang yumayanig.

1. Dapa: Bumaba sa iyong mga kamay at tuhod.
2. Takip: Pumunta sa ilalim ng matibay na mesa. Kung walang mesa, takpan ang ulo at leeg gamit ang mga braso.
3. Kapit: Kumapit sa paa ng mesa hanggang tumigil ang pagyanig.

Lumayo sa bintana, salamin at matataas na kasangkapan. Kapag tumigil na ang pagyanig, tingnan kung may nasugatan. Saka lumabas nang maingat. Maaaring may aftershock.`,
      },
    },
  },
  {
    id: 'sample-why-philippines',
    author: 'Yanig',
    source: 'Yanig',
    datePublished: '2026-10-01T00:00:00Z',
    category: 'research',
    tags: ['tectonic', 'fault', 'earthquake'],
    readTime: 2,
    text: {
      en: {
        title: 'Why the Philippines has many earthquakes',
        excerpt: 'The country is on the Pacific Ring of Fire, where plates of the earth meet.',
        content: `The Philippines is on the Pacific Ring of Fire. Here, large plates of the earth push against each other. This movement causes earthquakes.

The country also has many active faults on land. One example is the West Valley Fault. It goes through parts of Metro Manila.

No one can predict when an earthquake will happen. The best protection is to prepare before it happens.`,
      },
      tl: {
        title: 'Bakit maraming lindol sa Pilipinas',
        excerpt: 'Nasa Pacific Ring of Fire ang bansa, kung saan nagtatagpo ang mga plate ng mundo.',
        content: `Nasa Pacific Ring of Fire ang Pilipinas. Dito, nagtutulakan ang malalaking plate ng mundo. Ang galaw na ito ang sanhi ng lindol.

Marami ring aktibong fault sa lupa ang bansa. Isang halimbawa ang West Valley Fault. Dumadaan ito sa ilang bahagi ng Metro Manila.

Walang makapagsasabi kung kailan magkakaroon ng lindol. Ang pinakamabuting proteksyon ay maghanda bago ito mangyari.`,
      },
    },
  },
  {
    id: 'sample-magnitude-intensity',
    author: 'Yanig',
    source: 'Yanig',
    datePublished: '2026-10-01T00:00:00Z',
    category: 'research',
    tags: ['magnitude', 'earthquake'],
    readTime: 2,
    text: {
      en: {
        title: 'Magnitude and intensity are different',
        excerpt: 'Magnitude is the size of the earthquake. Intensity is how strong the shaking is where you are.',
        content: `Each earthquake has one magnitude. It tells the energy that the earthquake releases.

Intensity is different in each place. Shaking is usually stronger near the centre of the earthquake and weaker far away.

In the Philippines, PHIVOLCS uses the PHIVOLCS Earthquake Intensity Scale. It has ten levels, from I to X.

The first magnitude that an agency gives is an estimate. The agency can change it later.`,
      },
      tl: {
        title: 'Magkaiba ang magnitude at intensity',
        excerpt: 'Ang magnitude ay ang laki ng lindol. Ang intensity ay ang lakas ng yanig kung nasaan ka.',
        content: `Iisa ang magnitude ng bawat lindol. Sinasabi nito ang lakas ng enerhiyang inilabas ng lindol.

Iba-iba ang intensity sa bawat lugar. Karaniwang mas malakas ang yanig malapit sa gitna ng lindol at mas mahina sa malayo.

Sa Pilipinas, ginagamit ng PHIVOLCS ang PHIVOLCS Earthquake Intensity Scale. Mayroon itong sampung antas, mula I hanggang X.

Tantiya lamang ang unang magnitude na ibinibigay ng ahensya. Maaari itong baguhin ng ahensya pagkatapos.`,
      },
    },
  },
  {
    id: 'sample-earthquake-drill',
    author: 'Yanig',
    source: 'Yanig',
    datePublished: '2026-10-01T00:00:00Z',
    category: 'community',
    tags: ['preparedness', 'safety'],
    readTime: 1,
    text: {
      en: {
        title: 'Join the earthquake drill',
        excerpt: 'Practice helps you act fast when a real earthquake comes.',
        content: `The Philippines holds the Nationwide Simultaneous Earthquake Drill (NSED) each quarter. Schools, offices and barangays join.

During a drill, practise Drop, Cover, Hold on. Then walk to your evacuation area. Learn the route before an emergency.

Ask your barangay or school for the next drill date.`,
      },
      tl: {
        title: 'Sumali sa earthquake drill',
        excerpt: 'Ang pagsasanay ay tumutulong sa iyo na kumilos agad kapag may tunay na lindol.',
        content: `May Nationwide Simultaneous Earthquake Drill (NSED) ang Pilipinas bawat quarter. Sumasali ang mga paaralan, opisina at barangay.

Sa drill, sanayin ang Dapa, Takip, Kapit. Saka maglakad papunta sa inyong evacuation area. Alamin ang daan bago pa magkaroon ng emergency.

Tanungin ang inyong barangay o paaralan kung kailan ang susunod na drill.`,
      },
    },
  },
];

/** Sample articles in Tagalog for "tl", otherwise in English. */
export const getSampleArticles = (language: string = 'en'): NewsArticle[] => {
  const lang = language.toLowerCase().startsWith('tl') ? 'tl' : 'en';
  return SAMPLE_ARTICLES.map(({ text, ...rest }) => ({ ...rest, ...text[lang] }));
};
