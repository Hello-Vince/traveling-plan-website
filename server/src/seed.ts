import mongoose from 'mongoose';
import Sticker from './models/Sticker';
import ShoppingItem from './models/ShoppingItem';
import Flight from './models/Flight';
import ItineraryDay from './models/ItineraryDay';
import Expense from './models/Expense';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/japan-trip';

const stickers = [
  { stickerId: 1, emoji: '🦞', name: { en: 'Lobster', zhHK: '龍蝦' }, category: 'food' },
  { stickerId: 2, emoji: '⚓', name: { en: 'Harbour', zhHK: '海港' }, category: 'landmark' },
  { stickerId: 3, emoji: '🍺', name: { en: 'Alexander Keith\'s', zhHK: 'Keith\'s 啤酒' }, category: 'food' },
  { stickerId: 4, emoji: '🏰', name: { en: 'Citadel Hill', zhHK: '城堡山' }, category: 'landmark' },
  { stickerId: 5, emoji: '⛴️', name: { en: 'Ferry', zhHK: '渡輪' }, category: 'transport' },
  { stickerId: 6, emoji: '🌊', name: { en: 'Atlantic Ocean', zhHK: '大西洋' }, category: 'nature' },
  { stickerId: 7, emoji: '🍁', name: { en: 'Maple Leaf', zhHK: '楓葉' }, category: 'nature' },
  { stickerId: 8, emoji: '🏛️', name: { en: 'Maritime Museum', zhHK: '海事博物館' }, category: 'culture' },
  { stickerId: 9, emoji: '🐟', name: { en: 'Fish & Chips', zhHK: '炸魚薯條' }, category: 'food' },
  { stickerId: 10, emoji: '🏠', name: { en: 'Peggy\'s Cove', zhHK: '佩姬灣' }, category: 'landmark' },
  { stickerId: 11, emoji: '🎵', name: { en: 'Celtic Music', zhHK: '凱爾特音樂' }, category: 'culture' },
  { stickerId: 12, emoji: '☕', name: { en: 'Tim Hortons', zhHK: 'Tim Hortons' }, category: 'food' },
  { stickerId: 13, emoji: '🦭', name: { en: 'Harbour Seals', zhHK: '海豹' }, category: 'nature' },
  { stickerId: 14, emoji: '🎻', name: { en: 'Fiddle Music', zhHK: '小提琴音樂' }, category: 'culture' },
  { stickerId: 15, emoji: '🥧', name: { en: 'Blueberry Pie', zhHK: '藍莓批' }, category: 'food' },
  { stickerId: 16, emoji: '🌅', name: { en: 'Sunset', zhHK: '日落' }, category: 'nature' },
  { stickerId: 17, emoji: '🏔️', name: { en: 'Cape Breton', zhHK: '布雷頓角' }, category: 'nature' },
  { stickerId: 18, emoji: '🛒', name: { en: 'Halifax Market', zhHK: '哈利法克斯市場' }, category: 'shopping' },
  { stickerId: 19, emoji: '🍷', name: { en: 'Nova Scotia Wine', zhHK: '新斯科舍酒' }, category: 'food' },
  { stickerId: 20, emoji: '⛪', name: { en: 'Old Town Clock', zhHK: '舊城鐘樓' }, category: 'landmark' },
  { stickerId: 21, emoji: '🦀', name: { en: 'Snow Crab', zhHK: '雪蟹' }, category: 'food' },
  { stickerId: 22, emoji: '🚌', name: { en: 'Transit', zhHK: '巴士' }, category: 'transport' },
  { stickerId: 23, emoji: '🎨', name: { en: 'Street Art', zhHK: '街頭藝術' }, category: 'culture' },
  { stickerId: 24, emoji: '🌲', name: { en: 'Point Pleasant Park', zhHK: '快樂角公園' }, category: 'nature' },
];

const shoppingItems = [
  {
    name: { en: 'Maple Syrup', zhHK: '楓糖漿' },
    image: '🍁',
    tags: [
      { label: { en: 'Food', zhHK: '食品' }, color: '#F4A7BB' },
      { label: { en: 'Gift', zhHK: '手信' }, color: '#D4B8E0' },
    ],
    checked: false, quantity: 2,
  },
  {
    name: { en: 'Lobster Treats', zhHK: '龍蝦零食' },
    image: '🦞',
    tags: [
      { label: { en: 'Snack', zhHK: '零食' }, color: '#F4A7BB' },
      { label: { en: 'Gift', zhHK: '手信' }, color: '#D4B8E0' },
    ],
    checked: false, quantity: 3,
  },
  {
    name: { en: 'Nova Scotia Tartan Scarf', zhHK: '新斯科舍格紋圍巾' },
    image: '🧣',
    tags: [
      { label: { en: 'Clothing', zhHK: '服裝' }, color: '#A8D8EA' },
      { label: { en: 'Gift', zhHK: '手信' }, color: '#D4B8E0' },
    ],
    checked: false, quantity: 1,
  },
  {
    name: { en: 'Blueberry Jam', zhHK: '藍莓果醬' },
    image: '🫐',
    tags: [
      { label: { en: 'Food', zhHK: '食品' }, color: '#B8D4A3' },
      { label: { en: 'Gift', zhHK: '手信' }, color: '#D4B8E0' },
    ],
    checked: false, quantity: 2,
  },
  {
    name: { en: 'Alexander Keith\'s Beer', zhHK: 'Keith\'s 啤酒' },
    image: '🍺',
    tags: [
      { label: { en: 'Drink', zhHK: '飲品' }, color: '#FFD93D' },
    ],
    checked: false, quantity: 6,
  },
  {
    name: { en: 'Maritimes Fudge', zhHK: '海洋省份軟糖' },
    image: '🍬',
    tags: [
      { label: { en: 'Snack', zhHK: '零食' }, color: '#F4A7BB' },
    ],
    checked: false, quantity: 2,
  },
  {
    name: { en: 'Pewter Ornament', zhHK: '錫製飾品' },
    image: '✨',
    tags: [
      { label: { en: 'Souvenir', zhHK: '紀念品' }, color: '#A8D8EA' },
    ],
    checked: false, quantity: 1,
  },
  {
    name: { en: 'Oatcakes', zhHK: '燕麥餅' },
    image: '🍪',
    tags: [
      { label: { en: 'Snack', zhHK: '零食' }, color: '#B8D4A3' },
      { label: { en: 'Gift', zhHK: '手信' }, color: '#D4B8E0' },
    ],
    checked: false, quantity: 3,
  },
];

const flights = [
  {
    airline: 'Air Canada',
    flightNo: 'AC624',
    departure: {
      code: 'HKG',
      city: { en: 'Hong Kong', zhHK: '香港' },
      time: '23:55',
      date: '2026-09-15',
    },
    arrival: {
      code: 'YHZ',
      city: { en: 'Halifax', zhHK: '哈利法克斯' },
      time: '08:30',
      date: '2026-09-16',
    },
    gate: 'C22',
    seat: '18A',
    status: 'scheduled' as const,
  },
  {
    airline: 'Air Canada',
    flightNo: 'AC625',
    departure: {
      code: 'YHZ',
      city: { en: 'Halifax', zhHK: '哈利法克斯' },
      time: '19:00',
      date: '2026-09-23',
    },
    arrival: {
      code: 'HKG',
      city: { en: 'Hong Kong', zhHK: '香港' },
      time: '22:15',
      date: '2026-09-24',
    },
    gate: 'A8',
    seat: '22F',
    status: 'scheduled' as const,
  },
];

const itinerary = [
  {
    dayNumber: 1, date: '2026-09-16',
    title: { en: 'Arrival & Halifax Waterfront', zhHK: '抵達 & 哈利法克斯海濱' },
    weather: { icon: '🌤️', temp: '18°C', description: { en: 'Partly cloudy', zhHK: '間中多雲' } },
    locations: [
      { time: '08:30', name: { en: 'Halifax Stanfield Airport', zhHK: '哈利法克斯機場' }, category: 'transport', emoji: '✈️', notes: { en: 'Collect luggage, rent car', zhHK: '取行李，租車' } },
      { time: '10:30', name: { en: 'Hotel Check-in', zhHK: '酒店入住' }, category: 'hotel', emoji: '🏨', notes: { en: 'The Halliburton, Downtown Halifax', zhHK: 'The Halliburton，市中心' } },
      { time: '12:00', name: { en: 'Halifax Waterfront Boardwalk', zhHK: '海濱步道' }, category: 'landmark', emoji: '🌊', notes: { en: 'Stroll along the harbour', zhHK: '沿海港散步' } },
      { time: '13:30', name: { en: 'Salty\'s Fish & Chips', zhHK: 'Salty\'s 炸魚薯條' }, category: 'food', emoji: '🐟', notes: { en: 'Waterfront seafood restaurant', zhHK: '海濱海鮮餐廳' } },
      { time: '16:00', name: { en: 'Maritime Museum of the Atlantic', zhHK: '大西洋海事博物館' }, category: 'culture', emoji: '🏛️', notes: { en: 'Titanic exhibit & Halifax Explosion', zhHK: '鐵達尼號展覽 & 哈利法克斯大爆炸' } },
    ],
  },
  {
    dayNumber: 2, date: '2026-09-17',
    title: { en: 'Citadel Hill & Downtown', zhHK: '城堡山 & 市中心' },
    weather: { icon: '☀️', temp: '20°C', description: { en: 'Sunny', zhHK: '晴天' } },
    locations: [
      { time: '09:00', name: { en: 'Citadel Hill', zhHK: '城堡山' }, category: 'landmark', emoji: '🏰', notes: { en: 'Star-shaped fort, noon cannon', zhHK: '星形堡壘，正午大砲' } },
      { time: '11:00', name: { en: 'Halifax Public Gardens', zhHK: '公共花園' }, category: 'nature', emoji: '🌷', notes: { en: 'Victorian-era gardens', zhHK: '維多利亞時代花園' } },
      { time: '12:30', name: { en: 'Seaport Farmers\' Market', zhHK: '海港農夫市場' }, category: 'food', emoji: '🍎', notes: { en: 'North America\'s oldest farmers\' market', zhHK: '北美最古老農夫市場' } },
      { time: '14:00', name: { en: 'Alexander Keith\'s Brewery', zhHK: 'Keith\'s 啤酒廠' }, category: 'activity', emoji: '🍺', notes: { en: 'Historic brewery tour', zhHK: '歷史啤酒廠導賞' } },
      { time: '18:00', name: { en: 'Argyle Street Dinner', zhHK: 'Argyle 街晚餐' }, category: 'food', emoji: '🍽️', notes: { en: 'Lively restaurant district', zhHK: '熱鬧餐廳區' } },
    ],
  },
  {
    dayNumber: 3, date: '2026-09-18',
    title: { en: 'Peggy\'s Cove Day Trip', zhHK: '佩姬灣一日遊' },
    weather: { icon: '⛅', temp: '16°C', description: { en: 'Cloudy', zhHK: '多雲' } },
    locations: [
      { time: '09:00', name: { en: 'Drive to Peggy\'s Cove', zhHK: '駕車前往佩姬灣' }, category: 'transport', emoji: '🚗', notes: { en: '~45 min scenic coastal drive', zhHK: '約45分鐘沿海風景路線' } },
      { time: '10:00', name: { en: 'Peggy\'s Point Lighthouse', zhHK: '佩姬角燈塔' }, category: 'landmark', emoji: '🏠', notes: { en: 'Most photographed lighthouse in Canada', zhHK: '加拿大最多人影相嘅燈塔' } },
      { time: '12:00', name: { en: 'Lobster Lunch', zhHK: '龍蝦午餐' }, category: 'food', emoji: '🦞', notes: { en: 'Fresh lobster at Ryer Lobsters', zhHK: '新鮮龍蝦' } },
      { time: '14:00', name: { en: 'Swissair Memorial', zhHK: '瑞航紀念碑' }, category: 'landmark', emoji: '🕊️', notes: { en: 'Memorial site near Peggy\'s Cove', zhHK: '佩姬灣附近紀念碑' } },
      { time: '16:00', name: { en: 'Prospect Village', zhHK: 'Prospect 村' }, category: 'nature', emoji: '🌅', notes: { en: 'Quiet fishing village, great views', zhHK: '寧靜漁村，靚景' } },
    ],
  },
  {
    dayNumber: 4, date: '2026-09-19',
    title: { en: 'Lunenburg UNESCO Town', zhHK: '盧嫩堡 UNESCO 小鎮' },
    weather: { icon: '🌤️', temp: '19°C', description: { en: 'Partly cloudy', zhHK: '間中多雲' } },
    locations: [
      { time: '08:30', name: { en: 'Drive to Lunenburg', zhHK: '駕車前往盧嫩堡' }, category: 'transport', emoji: '🚗', notes: { en: '~1 hour drive south', zhHK: '約1小時車程南下' } },
      { time: '10:00', name: { en: 'Old Town Lunenburg', zhHK: '盧嫩堡舊城' }, category: 'landmark', emoji: '🏘️', notes: { en: 'UNESCO World Heritage colourful buildings', zhHK: 'UNESCO 世界遺產彩色建築' } },
      { time: '11:30', name: { en: 'Fisheries Museum', zhHK: '漁業博物館' }, category: 'culture', emoji: '🐟', notes: { en: 'Atlantic fisheries heritage', zhHK: '大西洋漁業遺產' } },
      { time: '13:00', name: { en: 'Grand Banker Seafood', zhHK: 'Grand Banker 海鮮' }, category: 'food', emoji: '🦐', notes: { en: 'Waterfront fine dining', zhHK: '海濱高級餐廳' } },
      { time: '15:00', name: { en: 'Mahone Bay', zhHK: '馬洪灣' }, category: 'landmark', emoji: '⛪', notes: { en: 'Three churches view, craft shops', zhHK: '三教堂景觀，手工藝品店' } },
    ],
  },
  {
    dayNumber: 5, date: '2026-09-20',
    title: { en: 'Cape Breton & Cabot Trail', zhHK: '布雷頓角 & 卡博特步道' },
    weather: { icon: '🌤️', temp: '17°C', description: { en: 'Partly sunny', zhHK: '間晴' } },
    locations: [
      { time: '07:00', name: { en: 'Drive to Cape Breton', zhHK: '駕車前往布雷頓角' }, category: 'transport', emoji: '🚗', notes: { en: '~3.5 hour drive, scenic route', zhHK: '約3.5小時車程，風景路線' } },
      { time: '11:00', name: { en: 'Cabot Trail Lookouts', zhHK: '卡博特步道觀景台' }, category: 'nature', emoji: '🏔️', notes: { en: 'Stunning coastal highlands', zhHK: '壯觀海岸高地' } },
      { time: '13:00', name: { en: 'Red Barn Restaurant', zhHK: 'Red Barn 餐廳' }, category: 'food', emoji: '🍽️', notes: { en: 'Local comfort food', zhHK: '本地家常菜' } },
      { time: '14:30', name: { en: 'Skyline Trail Hike', zhHK: 'Skyline 步道行山' }, category: 'activity', emoji: '🥾', notes: { en: '7km trail with ocean views', zhHK: '7公里步道，海景' } },
      { time: '18:00', name: { en: 'Ingonish Beach', zhHK: 'Ingonish 海灘' }, category: 'nature', emoji: '🏖️', notes: { en: 'Relax at the beach', zhHK: '海灘休息' } },
    ],
  },
  {
    dayNumber: 6, date: '2026-09-21',
    title: { en: 'Halifax Food & Culture', zhHK: '哈利法克斯美食文化' },
    weather: { icon: '☀️', temp: '20°C', description: { en: 'Sunny', zhHK: '晴天' } },
    locations: [
      { time: '10:00', name: { en: 'Canadian Museum of Immigration', zhHK: '加拿大移民博物館' }, category: 'culture', emoji: '🏛️', notes: { en: 'Pier 21 National Historic Site', zhHK: '21號碼頭國家古蹟' } },
      { time: '12:00', name: { en: 'Donair Lunch', zhHK: '多內爾午餐' }, category: 'food', emoji: '🌯', notes: { en: 'Halifax\'s signature dish', zhHK: '哈利法克斯招牌美食' } },
      { time: '14:00', name: { en: 'Spring Garden Road Shopping', zhHK: 'Spring Garden 路購物' }, category: 'shopping', emoji: '🛍️', notes: { en: 'Main shopping street', zhHK: '主要購物街' } },
      { time: '16:00', name: { en: 'Point Pleasant Park', zhHK: '快樂角公園' }, category: 'nature', emoji: '🌲', notes: { en: 'Coastal trails and ruins', zhHK: '海岸步道同遺跡' } },
      { time: '19:00', name: { en: 'Lobster Dinner at Five Fishermen', zhHK: 'Five Fishermen 龍蝦晚餐' }, category: 'food', emoji: '🦞', notes: { en: 'Award-winning seafood restaurant', zhHK: '獲獎海鮮餐廳' } },
    ],
  },
  {
    dayNumber: 7, date: '2026-09-22',
    title: { en: 'Last Day & Departure Prep', zhHK: '最後一日 & 準備離開' },
    weather: { icon: '☀️', temp: '19°C', description: { en: 'Sunny', zhHK: '晴天' } },
    locations: [
      { time: '09:00', name: { en: 'Halifax Boardwalk Sunrise Walk', zhHK: '海濱步道日出散步' }, category: 'nature', emoji: '🌅', notes: { en: 'Last morning by the harbour', zhHK: '最後一個早上喺海港' } },
      { time: '10:30', name: { en: 'Art Gallery of Nova Scotia', zhHK: '新斯科舍美術館' }, category: 'culture', emoji: '🎨', notes: { en: 'Folk art & Maud Lewis exhibit', zhHK: '民間藝術 & Maud Lewis 展覽' } },
      { time: '12:30', name: { en: 'Final Seafood Chowder', zhHK: '最後一碗海鮮濃湯' }, category: 'food', emoji: '🍲', notes: { en: 'One more bowl for the road', zhHK: '臨走再食一碗' } },
      { time: '14:00', name: { en: 'Pack & Check-out', zhHK: '執行李退房' }, category: 'hotel', emoji: '🧳', notes: { en: 'Last-minute packing', zhHK: '最後執行李' } },
      { time: '16:00', name: { en: 'Halifax Shopping Centre', zhHK: '哈利法克斯購物中心' }, category: 'shopping', emoji: '🏬', notes: { en: 'Last-minute souvenirs near airport', zhHK: '機場附近最後手信' } },
    ],
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB for seeding');

  await Sticker.deleteMany({});
  await ShoppingItem.deleteMany({});
  await Flight.deleteMany({});
  await ItineraryDay.deleteMany({});
  await Expense.deleteMany({});

  await Sticker.insertMany(stickers);
  await ShoppingItem.insertMany(shoppingItems);
  await Flight.insertMany(flights);
  await ItineraryDay.insertMany(itinerary);

  console.log('Seed complete!');
  await mongoose.disconnect();
}

seed().catch(console.error);
