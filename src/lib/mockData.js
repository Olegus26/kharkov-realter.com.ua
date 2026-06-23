export const MOCK_PROPERTIES = [
  {
    id: 'mock-1',
    title: 'Панорамний пентхаус у центрі',
    type: 'penthouse',
    location: 'Шевченківський район, вул. Сумська 82',
    price: 35000000,
    deal: 'sale',
    featured: true,
    new_building: true,
    rooms: 5,
    area: 240,
    floor: 24,
    floors_total: 24,
    year_built: 2021,
    description: 'Ексклюзивний пентхаус з круговим панорамним оглядом на все місто. Величезна тераса, дизайнерський ремонт, система розумного будинку, 3 паркомісця.',
    image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'
    ]
  },
  {
    id: 'mock-2',
    title: 'Затишна вілла з басейном',
    type: 'villa',
    location: 'Київський район, Сокільники',
    price: 85000000,
    deal: 'sale',
    featured: true,
    new_building: false,
    rooms: 8,
    area: 450,
    floor: 2,
    floors_total: 2,
    year_built: 2018,
    description: 'Розкішна вілла в елітному екологічно чистому районі. На території: відкритий басейн з підігрівом, ландшафтний дизайн, зона барбекю, гараж на 4 авто.',
    image_url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
    ]
  },
  {
    id: 'mock-3',
    title: 'Апартаменти бізнес-класу',
    type: 'apartment',
    location: 'м. Наукова, пр. Науки 24',
    price: 150000,
    deal: 'rent',
    featured: true,
    new_building: true,
    rooms: 3,
    area: 110,
    floor: 12,
    floors_total: 18,
    year_built: 2023,
    description: 'Простора світла квартира в новому житловому комплексі бізнес-класу. Панорамні вікна в підлогу, повністю укомплектована преміальною технікою.',
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80'
    ]
  },
  {
    id: 'mock-4',
    title: 'Офісний простір Лофт',
    type: 'commercial',
    location: 'Центр, вул. Пушкінська 50',
    price: 350000,
    deal: 'rent',
    featured: false,
    new_building: false,
    rooms: 10,
    area: 320,
    floor: 3,
    floors_total: 5,
    year_built: 1910,
    description: 'Облаштований офіс в стилі loft для IT-компанії. Високі стелі, історична будівля, кімнати для переговорів, зона відпочинку.',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80'
    ]
  },
  {
    id: 'mock-5',
    title: 'Стильний хай-тек будинок',
    type: 'house',
    location: 'Велика Данилівка',
    price: 45000000,
    deal: 'sale',
    featured: false,
    new_building: true,
    rooms: 4,
    area: 180,
    floor: 2,
    floors_total: 2,
    year_built: 2024,
    description: 'Новий енергоефективний будинок з мінімалістичним дизайном. Велика ділянка 15 соток з виходом до води.',
    image_url: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1200&q=80'
    ]
  }
]

export const MOCK_AGENTS = [
  {
    id: 'agent-1',
    name: 'Моїсеєва Наталія',
    role: 'Провідний експерт з продажу',
    bio: "Спеціалізуюсь на елітній нерухомості Харкова понад 15 років. Знайду підхід до будь-якого клієнта та підберу ідеальний об'єкт.",
    deals_count: 512,
    experience_years: 15,
    phone: '+380501112233',
    email: 'koval@kharkov-realty.ua',
    photo: '/agent1.jpg'
  },
  {
    id: 'agent-2',
    name: 'Ганшина Наталія',
    role: 'Спеціаліст з оренди VIP',
    bio: 'Допоможу вигідно здати вашу нерухомість або знайти розкішне житло в оренду всього за кілька годин.',
    deals_count: 145,
    experience_years: 8,
    phone: '+380671112233',
    email: 'sokolova@kharkov-realty.ua',
    photo: '/agent2.jpg'
  },
  {
    id: 'agent-3',
    name: 'Коробейник Ліна',
    role: 'Комерційна нерухомість',
    bio: 'Знаю все про ринок комерційної нерухомості. Мої клієнти — найбільші IT та торгові компанії регіону.',
    deals_count: 340,
    experience_years: 10,
    phone: '+380931112233',
    email: 'shevchenko@kharkov-realty.ua',
    photo: '/agent3.jpg'
  }
]
