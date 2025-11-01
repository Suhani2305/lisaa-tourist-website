require('dotenv').config();
const mongoose = require('mongoose');
const State = require('../models/State');
const City = require('../models/City');
const connectDB = require('../config/database');

// Connect to database
connectDB();

const rajasthanData = {
  name: "Rajasthan",
  slug: "rajasthan",
  description: "The Land of Kings - Experience royal palaces, desert safaris, vibrant culture, and magnificent forts. Rajasthan is India's largest state by area, located in the northwest part of the country. Known for its rich history, royal heritage, colorful culture, and stunning desert landscapes.",
  shortDescription: "The Land of Kings - Experience royal palaces, desert safaris, vibrant culture, and magnificent forts",
  heroImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1920&q=90",
  capital: "Jaipur",
  area: "342,239 km²",
  population: "68 million",
  languages: ["Hindi", "Rajasthani", "English"],
  bestTimeToVisit: "October to March (Winter season - perfect weather)",
  featured: true,
  isActive: true,
  order: 1,
  region: "North",
  metaTitle: "Rajasthan Tourism - Land of Kings | Complete Travel Guide",
  metaDescription: "Explore Rajasthan - The Land of Kings. Experience royal palaces, desert safaris, vibrant culture, magnificent forts, and rich heritage. Best time to visit, top cities, attractions, and tour packages.",
  metaKeywords: "Rajasthan, Rajasthan tourism, Land of Kings, Jaipur, Udaipur, Jaisalmer, Jodhpur, desert safari, royal palaces, heritage tours"
};

const rajasthanCities = [
  {
    name: "Jaipur",
    slug: "jaipur",
    state: "Rajasthan",
    stateSlug: "rajasthan",
    description: "Jaipur, the Pink City, is the capital of Rajasthan and a UNESCO World Heritage Site. Known for its stunning palaces, vibrant bazaars, and rich cultural heritage. The city's architecture reflects a perfect blend of Hindu and Mughal styles.",
    shortDescription: "The Pink City - Heritage, Cultural & Shopping",
    heroImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1920&q=90",
    attractions: ["Amber Fort", "City Palace", "Hawa Mahal", "Jantar Mantar", "Nahargarh Fort", "Jaigarh Fort"],
    bestTimeToVisit: "October to March",
    featured: true,
    isActive: true,
    order: 1,
    metaTitle: "Jaipur Tourism - Pink City Complete Travel Guide",
    metaDescription: "Explore Jaipur, the Pink City - capital of Rajasthan. Visit Amber Fort, City Palace, Hawa Mahal, Jantar Mantar. Best time to visit, attractions, and tour packages.",
    metaKeywords: "Jaipur, Pink City, Amber Fort, City Palace, Hawa Mahal, Rajasthan capital"
  },
  {
    name: "Udaipur",
    slug: "udaipur",
    state: "Rajasthan",
    stateSlug: "rajasthan",
    description: "Udaipur, the City of Lakes, is one of the most romantic destinations in India. Known for its beautiful lakes, magnificent palaces, and stunning architecture. Often called the 'Venice of the East'.",
    shortDescription: "City of Lakes - Romantic, Heritage & Nature",
    heroImage: "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=1920&q=90",
    attractions: ["City Palace", "Lake Pichola", "Jag Mandir", "Monsoon Palace", "Saheliyon Ki Bari", "Fateh Sagar Lake"],
    bestTimeToVisit: "September to March",
    featured: true,
    isActive: true,
    order: 2,
    metaTitle: "Udaipur Tourism - City of Lakes Travel Guide",
    metaDescription: "Visit Udaipur, the City of Lakes. Explore City Palace, Lake Pichola, Jag Mandir. Romantic destination with stunning palaces and beautiful lakes.",
    metaKeywords: "Udaipur, City of Lakes, Lake Pichola, City Palace, romantic destination, Venice of East"
  },
  {
    name: "Jaisalmer",
    slug: "jaisalmer",
    state: "Rajasthan",
    stateSlug: "rajasthan",
    description: "Jaisalmer, the Golden City, rises from the heart of the Thar Desert like a golden mirage. Known for its magnificent fort, desert safaris, camel rides, and stunning sandstone architecture that glows golden in the desert sun.",
    shortDescription: "The Golden City - Desert, Heritage & Adventure",
    heroImage: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1920&q=90",
    attractions: ["Jaisalmer Fort", "Sam Sand Dunes", "Patwon Ki Haveli", "Gadisar Lake", "Desert Safari", "Camel Safari"],
    bestTimeToVisit: "October to March",
    featured: true,
    isActive: true,
    order: 3,
    metaTitle: "Jaisalmer Tourism - Golden City Desert Safari Guide",
    metaDescription: "Experience Jaisalmer, the Golden City. Visit Jaisalmer Fort, Sam Sand Dunes, desert safari, camel rides. Perfect for adventure and heritage tourism.",
    metaKeywords: "Jaisalmer, Golden City, Jaisalmer Fort, Sam Sand Dunes, desert safari, Thar Desert"
  },
  {
    name: "Jodhpur",
    slug: "jodhpur",
    state: "Rajasthan",
    stateSlug: "rajasthan",
    description: "Jodhpur, the Blue City, is famous for its blue-painted houses and magnificent Mehrangarh Fort that towers over the city. Known for its rich history, royal heritage, and vibrant culture.",
    shortDescription: "The Blue City - Heritage, Adventure & Cultural",
    heroImage: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=1920&q=90",
    attractions: ["Mehrangarh Fort", "Umaid Bhawan Palace", "Clock Tower", "Jaswant Thada", "Mandore Gardens"],
    bestTimeToVisit: "October to March",
    featured: true,
    isActive: true,
    order: 4,
    metaTitle: "Jodhpur Tourism - Blue City Heritage Guide",
    metaDescription: "Explore Jodhpur, the Blue City. Visit Mehrangarh Fort, Umaid Bhawan Palace, Clock Tower. Rich heritage and royal culture.",
    metaKeywords: "Jodhpur, Blue City, Mehrangarh Fort, Umaid Bhawan Palace, heritage tours"
  },
  {
    name: "Pushkar",
    slug: "pushkar",
    state: "Rajasthan",
    stateSlug: "rajasthan",
    description: "Pushkar is one of the oldest cities in India and a sacred pilgrimage site for Hindus. Known for the famous Pushkar Fair, beautiful Brahma Temple, and the serene Pushkar Lake surrounded by ghats.",
    shortDescription: "Sacred City - Spiritual & Cultural",
    heroImage: "https://images.unsplash.com/photo-1587693266575-c337c15d223a?w=1920&q=90",
    attractions: ["Pushkar Lake", "Brahma Temple", "Pushkar Fair", "Camel Fair Ground", "Savitri Temple"],
    bestTimeToVisit: "October to March (especially during Pushkar Fair in November)",
    featured: true,
    isActive: true,
    order: 5,
    metaTitle: "Pushkar Tourism - Sacred City & Pushkar Fair Guide",
    metaDescription: "Visit Pushkar, the sacred city. Experience Pushkar Fair, Brahma Temple, Pushkar Lake. Spiritual and cultural destination.",
    metaKeywords: "Pushkar, Pushkar Fair, Brahma Temple, Pushkar Lake, sacred city, camel fair"
  },
  {
    name: "Ranthambore",
    slug: "ranthambore",
    state: "Rajasthan",
    stateSlug: "rajasthan",
    description: "Ranthambore National Park is one of India's premier tiger reserves and a paradise for wildlife enthusiasts. Home to Bengal tigers, leopards, and diverse flora and fauna. The historic Ranthambore Fort adds to its charm.",
    shortDescription: "Wildlife Paradise - Wildlife & Adventure",
    heroImage: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=1920&q=90",
    attractions: ["Tiger Safari", "Ranthambore Fort", "Wildlife Photography", "Padam Talao", "Jogi Mahal"],
    bestTimeToVisit: "October to June (best for tiger sightings)",
    featured: true,
    isActive: true,
    order: 6,
    metaTitle: "Ranthambore Tourism - Tiger Safari & Wildlife Guide",
    metaDescription: "Experience Ranthambore National Park - tiger safari, wildlife photography, Ranthambore Fort. Best place for wildlife adventure.",
    metaKeywords: "Ranthambore, Tiger Safari, Ranthambore National Park, wildlife photography, tiger reserve"
  },
  {
    name: "Ajmer",
    slug: "ajmer",
    state: "Rajasthan",
    stateSlug: "rajasthan",
    description: "Ajmer is a major pilgrimage center for both Hindus and Muslims. Home to the famous Ajmer Sharif Dargah, one of the most important Sufi shrines in India, and the beautiful Ana Sagar Lake.",
    shortDescription: "City of Sufism - Spiritual & Cultural",
    heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1920&q=90",
    attractions: ["Ajmer Sharif Dargah", "Ana Sagar Lake", "Akbari Fort", "Taragarh Fort"],
    bestTimeToVisit: "October to March",
    featured: true,
    isActive: true,
    order: 7,
    metaTitle: "Ajmer Tourism - Ajmer Sharif Dargah Guide",
    metaDescription: "Visit Ajmer - Ajmer Sharif Dargah, Ana Sagar Lake. Important spiritual destination for Muslims and Hindus.",
    metaKeywords: "Ajmer, Ajmer Sharif Dargah, Ana Sagar Lake, spiritual tourism, Sufi shrine"
  },
  {
    name: "Bikaner",
    slug: "bikaner",
    state: "Rajasthan",
    stateSlug: "rajasthan",
    description: "Bikaner is known for its magnificent forts, palaces, and camel safaris in the Thar Desert. Famous for the Junagarh Fort, Karni Mata Temple (Rat Temple), and its rich heritage.",
    shortDescription: "Desert Capital - Heritage, Desert & Cultural",
    heroImage: "https://images.unsplash.com/photo-1610519341503-1d45b96ee6f3?w=1920&q=90",
    attractions: ["Junagarh Fort", "Karni Mata Temple", "Camel Safari", "Lalgarh Palace", "Gajner Palace"],
    bestTimeToVisit: "October to March",
    featured: true,
    isActive: true,
    order: 8,
    metaTitle: "Bikaner Tourism - Desert Heritage Guide",
    metaDescription: "Explore Bikaner - Junagarh Fort, Karni Mata Temple, camel safaris. Desert capital with rich heritage.",
    metaKeywords: "Bikaner, Junagarh Fort, Karni Mata Temple, camel safari, desert heritage"
  },
  {
    name: "Mount Abu",
    slug: "mount-abu",
    state: "Rajasthan",
    stateSlug: "rajasthan",
    description: "Mount Abu is Rajasthan's only hill station, located in the Aravalli Range. Known for its cool climate, stunning Dilwara Jain Temples, beautiful Nakki Lake, and scenic viewpoints like Sunset Point.",
    shortDescription: "Hill Station - Nature, Spiritual & Hill Station",
    heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1920&q=90",
    attractions: ["Dilwara Temples", "Nakki Lake", "Sunset Point", "Guru Shikhar", "Achalgarh Fort", "Wildlife Sanctuary"],
    bestTimeToVisit: "October to March (summer escape from desert heat)",
    featured: true,
    isActive: true,
    order: 9,
    metaTitle: "Mount Abu Tourism - Hill Station Complete Guide",
    metaDescription: "Visit Mount Abu, Rajasthan's hill station. Explore Dilwara Temples, Nakki Lake, Sunset Point. Cool climate and spiritual destination.",
    metaKeywords: "Mount Abu, hill station, Dilwara Temples, Nakki Lake, Aravalli Range, Rajasthan hill station"
  }
];

const seedRajasthan = async () => {
  try {
    console.log('🌱 Starting Rajasthan data migration...\n');

    // Check if Rajasthan state already exists
    const existingState = await State.findOne({ slug: 'rajasthan' });
    if (existingState) {
      console.log('⚠️  Rajasthan state already exists. Updating...');
      await State.findOneAndUpdate({ slug: 'rajasthan' }, rajasthanData, { new: true });
      console.log('✅ Rajasthan state updated!\n');
    } else {
      const state = new State(rajasthanData);
      await state.save();
      console.log('✅ Rajasthan state created!\n');
    }

    // Seed cities
    console.log('🏙️  Creating cities...\n');
    let created = 0;
    let updated = 0;

    for (const cityData of rajasthanCities) {
      const existingCity = await City.findOne({ 
        stateSlug: 'rajasthan', 
        slug: cityData.slug 
      });

      if (existingCity) {
        await City.findOneAndUpdate(
          { stateSlug: 'rajasthan', slug: cityData.slug },
          cityData,
          { new: true }
        );
        updated++;
        console.log(`✅ Updated: ${cityData.name}`);
      } else {
        const city = new City(cityData);
        await city.save();
        created++;
        console.log(`✅ Created: ${cityData.name}`);
      }
    }

    console.log(`\n🎉 Migration complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - State: 1 (Rajasthan)`);
    console.log(`   - Cities: ${created} created, ${updated} updated (Total: ${rajasthanCities.length})`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

// Run migration
seedRajasthan();

