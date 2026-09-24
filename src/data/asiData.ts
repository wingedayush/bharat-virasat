export interface AsiCircle {
  id: string;
  name: string;
  hindiName: string;
  headquarters: string;
  state: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';
  monumentCount: number;
  establishedYear: number;
  superintendingArchaeologist: string;
  officeAddress: string;
  contactEmail: string;
  phone: string;
  keyMonuments: string[];
  description: string;
  badge: string;
}

export interface AsiMuseum {
  id: string;
  name: string;
  hindiName: string;
  circleId: string;
  location: string;
  state: string;
  establishedYear: number;
  image: string;
  ticketFee: { indian: number; foreigner: number; child: number };
  timings: string;
  closedOn: string;
  keyAntiquities: { name: string; era: string; material: string; significance: string }[];
  description: string;
}

export interface AsiConservationProject {
  id: string;
  title: string;
  monument: string;
  location: string;
  era: string;
  scientificTechnique: string;
  objective: string;
  status: 'Ongoing' | 'Phase II Completed' | 'National Priority';
  leadWing: string;
  image: string;
  details: string;
}

export interface AsiEpigraphyRecord {
  id: string;
  title: string;
  script: string;
  language: string;
  period: string;
  dynasty: string;
  findspot: string;
  summary: string;
  translationSnippet: string;
  discoveredYear: number;
}

export interface AsiTicketPricing {
  monumentId: string;
  monumentName: string;
  circle: string;
  category: 'A (World Heritage)' | 'B (Ticketed Centrally Protected)';
  indianRate: number;
  saarcBimstecRate: number;
  foreignRate: number;
  domeFee?: number;
  timings: string;
  weeklyClosure?: string;
  photographyAllowed: boolean;
  droneAllowed: boolean;
}

// 24+ Official ASI Circles
export const asiCircles: AsiCircle[] = [
  {
    id: 'agra-circle',
    name: 'Agra Circle',
    hindiName: 'आगरा मंडल',
    headquarters: 'Agra',
    state: 'Uttar Pradesh',
    region: 'North',
    monumentCount: 268,
    establishedYear: 1885,
    superintendingArchaeologist: 'Superintending Archaeologist, Agra Circle',
    officeAddress: '22, The Mall, Agra - 282001, Uttar Pradesh',
    contactEmail: 'circleagra.asi@gov.in',
    phone: '+91-562-2227261',
    keyMonuments: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri', 'Akbar’s Tomb at Sikandra', 'Itmad-ud-Daulah', 'Mehtab Bagh'],
    description: 'Agra Circle administers some of the world’s most iconic Mughal architectural treasures, including three UNESCO World Heritage Sites along the Yamuna river basin.',
    badge: 'Premier Heritage Circle'
  },
  {
    id: 'delhi-circle',
    name: 'Delhi Circle',
    hindiName: 'दिल्ली मंडल',
    headquarters: 'New Delhi',
    state: 'Delhi (NCT)',
    region: 'North',
    monumentCount: 174,
    establishedYear: 1911,
    superintendingArchaeologist: 'Superintending Archaeologist, Delhi Circle',
    officeAddress: 'Purana Qila, Mathura Road, New Delhi - 110003',
    contactEmail: 'circledel.asi@gov.in',
    phone: '+91-11-24698304',
    keyMonuments: ['Qutub Minar Complex', 'Red Fort (Lal Qila)', 'Humayun’s Tomb', 'Purana Qila', 'Tughlaqabad Fort', 'Safdarjung Tomb', 'Hauz Khas'],
    description: 'Delhi Circle oversees seven historic cities within the National Capital Territory spanning the Delhi Sultanate, Suri dynasty, and Mughal imperial eras.',
    badge: 'National Capital Wing'
  },
  {
    id: 'aurangabad-circle',
    name: 'Aurangabad Circle (Chhatrapati Sambhajinagar)',
    hindiName: 'औरंगाबाद मंडल',
    headquarters: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    region: 'West',
    monumentCount: 168,
    establishedYear: 1953,
    superintendingArchaeologist: 'Superintending Archaeologist, Aurangabad Circle',
    officeAddress: 'Bibi Ka Maqbara Complex, Chhatrapati Sambhajinagar - 431004, Maharashtra',
    contactEmail: 'circleaur.asi@gov.in',
    phone: '+91-240-2400582',
    keyMonuments: ['Ajanta Caves', 'Ellora Caves (Kailasa Temple)', 'Daulatabad Fort', 'Bibi Ka Maqbara', 'Pitalkhora Caves'],
    description: 'Cradle of ancient Indian rock-cut architecture. Houses 34 caves at Ellora including the monolithic Kailasa Temple and 30 painted Buddhist caves at Ajanta.',
    badge: 'Rock-Cut Marvels'
  },
  {
    id: 'bhopal-circle',
    name: 'Bhopal Circle',
    hindiName: 'भोपाल मंडल',
    headquarters: 'Bhopal',
    state: 'Madhya Pradesh',
    region: 'Central',
    monumentCount: 291,
    establishedYear: 1953,
    superintendingArchaeologist: 'Superintending Archaeologist, Bhopal Circle',
    officeAddress: 'Bhartiya Pratna Bhawan, Block-B, GTB Complex, TT Nagar, Bhopal - 462003, MP',
    contactEmail: 'circlebho.asi@gov.in',
    phone: '+91-755-2777300',
    keyMonuments: ['Great Stupa at Sanchi', 'Khajuraho Group of Temples', 'Bhimbetka Rock Shelters', 'Mandu Monuments', 'Gwalior Fort & Gujari Mahal'],
    description: 'Heart of Central Indian archaeology with three UNESCO sites: Sanchi Stupas (3rd c. BCE), Bhimbetka Paleolithic rock art (100,000 BP), and Khajuraho temples.',
    badge: 'Three UNESCO Sites'
  },
  {
    id: 'chennai-circle',
    name: 'Chennai Circle',
    hindiName: 'चेन्नई मंडल',
    headquarters: 'Chennai',
    state: 'Tamil Nadu & Puducherry',
    region: 'South',
    monumentCount: 413,
    establishedYear: 1902,
    superintendingArchaeologist: 'Superintending Archaeologist, Chennai Circle',
    officeAddress: 'Fort St. George, Chennai - 600009, Tamil Nadu',
    contactEmail: 'circleche.asi@gov.in',
    phone: '+91-44-25670396',
    keyMonuments: ['Group of Monuments at Mahabalipuram', 'Great Living Chola Temples (Brihadisvara Thanjavur, Gangaikonda Cholapuram, Airavatesvara)', 'Gingee Fort', 'Rock-cut Fort of Tiruchirappalli'],
    description: 'Custodian of Dravidian temple architecture, Pallava monoliths along the Coromandel coast, and the architectural zenith of the imperial Chola dynasty.',
    badge: 'Living Chola Temples'
  },
  {
    id: 'dharwad-circle',
    name: 'Dharwad & Hampi Mini-Circle',
    hindiName: 'धारवाड़ एवं हम्पी मंडल',
    headquarters: 'Dharwad / Kamalapur',
    state: 'Karnataka',
    region: 'South',
    monumentCount: 300,
    establishedYear: 1985,
    superintendingArchaeologist: 'Superintending Archaeologist, Dharwad Circle',
    officeAddress: 'DC Compound, Dharwad - 580001, Karnataka',
    contactEmail: 'circledha.asi@gov.in',
    phone: '+91-836-2440306',
    keyMonuments: ['Monuments of Hampi', 'Group of Monuments at Pattadakal', 'Aihole Chalukyan Cradle', 'Badami Cave Temples', 'Bidar Fort & Mahmud Gawan Madrasa'],
    description: 'Home to the magnificent capital of the Vijayanagara Empire at Hampi and the early architectural experimentation laboratories of the Badami Chalukyas.',
    badge: 'Imperial Vijayanagara'
  },
  {
    id: 'bhubaneswar-circle',
    name: 'Bhubaneswar Circle',
    hindiName: 'भुवनेश्वर मंडल',
    headquarters: 'Bhubaneswar',
    state: 'Odisha',
    region: 'East',
    monumentCount: 80,
    establishedYear: 1968,
    superintendingArchaeologist: 'Superintending Archaeologist, Bhubaneswar Circle',
    officeAddress: 'Toshali Bhawan, Satya Nagar, Bhubaneswar - 751007, Odisha',
    contactEmail: 'circlebhu.asi@gov.in',
    phone: '+91-674-2571874',
    keyMonuments: ['Sun Temple at Konark', 'Rajarani Temple', 'Lingaraja Temple Complex', 'Udayagiri & Khandagiri Caves', 'Ratnagiri Buddhist Mahavihara'],
    description: 'Preserves the pinnacle of Kalinga architectural deula-jagamohana typology, maritime trade heritage, and the monumental 13th-century Konark solar dial.',
    badge: 'Kalinga Stone Art'
  },
  {
    id: 'kolkata-circle',
    name: 'Kolkata Circle',
    hindiName: 'कोलकाता मंडल',
    headquarters: 'Kolkata',
    state: 'West Bengal & Sikkim',
    region: 'East',
    monumentCount: 136,
    establishedYear: 1904,
    superintendingArchaeologist: 'Superintending Archaeologist, Kolkata Circle',
    officeAddress: 'Currency Building, 1, BBD Bagh, Kolkata - 700001, West Bengal',
    contactEmail: 'circlekol.asi@gov.in',
    phone: '+91-33-22108749',
    keyMonuments: ['Terracotta Temples of Bishnupur', 'Hazarduari Palace Murshidabad', 'Adina Mosque Pandua', 'Cooch Behar Palace', 'Rabdentse Ruins Sikkim'],
    description: 'Specializes in the unique brick-and-terracotta temple ornamentation of Bengal, medieval Islamic capitals of Gaur-Pandua, and ancient Himalayan kingdoms.',
    badge: 'Terracotta & Bengal'
  },
  {
    id: 'jaipur-circle',
    name: 'Jaipur Circle',
    hindiName: 'जयपुर मंडल',
    headquarters: 'Jaipur',
    state: 'Rajasthan',
    region: 'West',
    monumentCount: 162,
    establishedYear: 1958,
    superintendingArchaeologist: 'Superintending Archaeologist, Jaipur Circle',
    officeAddress: 'Bhartiya Pratna Bhawan, 70/133, Patel Marg, Mansarovar, Jaipur - 302020',
    contactEmail: 'circlejai.asi@gov.in',
    phone: '+91-141-2782782',
    keyMonuments: ['Chittorgarh Fort', 'Kumbhalgarh Fort (36km Wall)', 'Ranthambore Fort', 'Amer Fort Stepwells', 'Abhaneri Chand Baori', 'Deeg Palaces'],
    description: 'Guards the formidable Hill Forts of Rajasthan, defensive military architecture, water-harvesting stepwells, and Rajput-Mughal synthetic palaces.',
    badge: 'Heroic Hill Forts'
  },
  {
    id: 'vadodara-circle',
    name: 'Vadodara Circle',
    hindiName: 'वडोदरा मंडल',
    headquarters: 'Vadodara',
    state: 'Gujarat, Daman & Diu',
    region: 'West',
    monumentCount: 203,
    establishedYear: 1950,
    superintendingArchaeologist: 'Superintending Archaeologist, Vadodara Circle',
    officeAddress: 'Puratattva Bhawan, Near Central Jail, Dandia Bazar, Vadodara - 390001',
    contactEmail: 'circlevad.asi@gov.in',
    phone: '+91-265-2429302',
    keyMonuments: ['Rani Ki Vav at Patan', 'Dholavira Harappan Metropolis', 'Champaner-Pavagadh Archaeological Park', 'Sun Temple at Modhera', 'Lothal Dockyard'],
    description: 'Spans 5,000 years from Harappan urban water management at Dholavira and Lothal to Solanki stepwell engineering and pre-Mughal Islamic capitals.',
    badge: 'Harappan to Solanki'
  },
  {
    id: 'patna-circle',
    name: 'Patna Circle',
    hindiName: 'पटना मंडल',
    headquarters: 'Patna',
    state: 'Bihar',
    region: 'East',
    monumentCount: 70,
    establishedYear: 1912,
    superintendingArchaeologist: 'Superintending Archaeologist, Patna Circle',
    officeAddress: 'Bhartiya Pratna Bhawan, Anta Ghat, Patna - 800004, Bihar',
    contactEmail: 'circlepat.asi@gov.in',
    phone: '+91-612-2300062',
    keyMonuments: ['Archaeological Site of Nalanda Mahavihara', 'Vikramashila University Ruins', 'Barabar & Nagarjuni Caves', 'Sasaram Tomb of Sher Shah Suri', 'Kumhrar Mauryan Pillared Hall'],
    description: 'Seat of ancient Magadhan empires, Mauryan polished stone columns, the earliest rock-cut Ajivika caves, and the world’s foremost monastic universities.',
    badge: 'Magadha & Nalanda'
  },
  {
    id: 'hyderabad-circle',
    name: 'Hyderabad Circle',
    hindiName: 'हैदराबाद मंडल',
    headquarters: 'Hyderabad',
    state: 'Telangana & Andhra Pradesh',
    region: 'South',
    monumentCount: 212,
    establishedYear: 1955,
    superintendingArchaeologist: 'Superintending Archaeologist, Hyderabad Circle',
    officeAddress: 'Kendriya Sadan, Sultan Bazar, Koti, Hyderabad - 500095, Telangana',
    contactEmail: 'circlehyd.asi@gov.in',
    phone: '+91-40-24653835',
    keyMonuments: ['Golconda Fort Complex', 'Charminar', 'Kakatiya Rudreshwara (Ramappa) Temple', 'Warangal Thousand Pillar Temple', 'Nagarjunakonda Buddhist Remains'],
    description: 'Features the lightweight floating brick engineering of UNESCO-inscribed Ramappa Temple, Qutb Shahi acoustic architecture, and Ikshvaku river valleys.',
    badge: 'Kakatiya & Deccan'
  }
];

// Official ASI Site Museums
export const asiMuseums: AsiMuseum[] = [
  {
    id: 'taj-museum',
    name: 'Taj Museum',
    hindiName: 'ताज संग्रहालय',
    circleId: 'agra-circle',
    location: 'Western Naubat Khana, Taj Mahal Complex, Agra',
    state: 'Uttar Pradesh',
    establishedYear: 1982,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1080&q=80',
    ticketFee: { indian: 0, foreigner: 0, child: 0 }, // Included in Taj Mahal ticket
    timings: '09:00 AM - 05:00 PM',
    closedOn: 'Friday',
    keyAntiquities: [
      { name: 'Original Mughal Blueprints & Architectural Drawings', era: 'c. 1632 CE', material: 'Handmade Wasli Paper & Ink', significance: 'Original imperial layout maps showing geometry of mausoleum and water conduits.' },
      { name: 'Celadon Jade Inlaid Plates (Poison Testers)', era: '17th Century CE', material: 'Translucent Nephrite Jade', significance: 'Imperial dishware believed to crack or change color if food contained poison.' },
      { name: 'Gold and Silver Coins of Shah Jahan', era: '1628–1658 CE', material: 'Pure Minted Gold & Silver', significance: 'Coins bearing the Kalima and the royal titles of Emperor Shah Jahan.' }
    ],
    description: 'Located inside the Taj Mahal complex, this museum displays original farmans (royal decrees), ivory carvings, miniature portraits of Shah Jahan and Mumtaz Mahal, and samples of semi-precious stones used in the pietra dura inlay.'
  },
  {
    id: 'sarnath-museum',
    name: 'Sarnath Archaeological Museum',
    hindiName: 'सारनाथ पुरातत्व संग्रहालय',
    circleId: 'patna-circle',
    location: 'Sarnath, Varanasi',
    state: 'Uttar Pradesh',
    establishedYear: 1910,
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=1080&q=80',
    ticketFee: { indian: 20, foreigner: 100, child: 0 },
    timings: '09:00 AM - 05:00 PM',
    closedOn: 'Friday',
    keyAntiquities: [
      { name: 'Lion Capital of Ashoka (National Emblem of India)', era: 'c. 250 BCE', material: 'Chunar Sandstone with Mauryan Polish', significance: 'Four back-to-back lions standing on an abacus with the Ashoka Chakra, adopted as the State Emblem of India.' },
      { name: 'Dharmachakra Pravartana Buddha', era: '5th Century CE (Gupta Period)', material: 'Chunar Sandstone', significance: 'Masterpiece of Gupta classical art depicting Buddha turning the Wheel of Law.' },
      { name: 'Standing Bodhisattva of Kanishka', era: '1st Century CE (Kushan)', material: 'Spotted Red Mathura Sandstone', significance: 'Colossal sculpture dedicated by monk Bala during the reign of Emperor Kanishka.' }
    ],
    description: 'The oldest site museum of the Archaeological Survey of India, designed in the form of a half-monastery (Sangharama). Houses world-famous sculptures recovered during excavations at the sacred site of Buddha’s First Sermon.'
  },
  {
    id: 'lothal-museum',
    name: 'Lothal Archaeological Museum',
    hindiName: 'लोथल पुरातत्व संग्रहालय',
    circleId: 'vadodara-circle',
    location: 'Saragwala Village, Ahmedabad District',
    state: 'Gujarat',
    establishedYear: 1976,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1080&q=80',
    ticketFee: { indian: 15, foreigner: 50, child: 0 },
    timings: '10:00 AM - 05:00 PM',
    closedOn: 'Friday',
    keyAntiquities: [
      { name: 'Harappan Steatite Seals with Unicorn & Script', era: 'c. 2200 BCE', material: 'Carved Glazed Steatite', significance: 'Commercial stamp seals used in bronze age maritime trade with Mesopotamia.' },
      { name: 'Persian Gulf Circular Button Seal', era: 'c. 2000 BCE', material: 'Steatite', significance: 'Definitive physical evidence of direct trans-oceanic trade with Dilmun (Bahrain).' },
      { name: 'Micro-bead Carnelian Necklace & Ivory Scale', era: 'c. 2400 BCE', material: 'Etched Carnelian & Marine Shell', significance: 'Display of Harappan high-precision engineering and metallurgy.' }
    ],
    description: 'Adjacent to the world’s oldest known tidal dockyard at Lothal. Showcases over 800 artifacts including bead factories, copper implements, terracotta figurines, and standard binary weights.'
  },
  {
    id: 'red-fort-museum',
    name: 'Red Fort Archaeological Museum (Mumtaz Mahal)',
    hindiName: 'लाल किला पुरातत्व संग्रहालय',
    circleId: 'delhi-circle',
    location: 'Mumtaz Mahal, Red Fort Complex, Delhi',
    state: 'Delhi',
    establishedYear: 1911,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1080&q=80',
    ticketFee: { indian: 20, foreigner: 100, child: 0 },
    timings: '09:00 AM - 05:00 PM',
    closedOn: 'Monday',
    keyAntiquities: [
      { name: 'Bahadur Shah Zafar’s Personal Robe & Pen-case', era: '1857 CE', material: 'Silk Brocade & Inlaid Ivory', significance: 'Belongings of the last Mughal Emperor of India during the 1857 First War of Independence.' },
      { name: 'Mughal Imperial Jade Daggers with Ruby Pommels', era: '17th Century CE', material: 'Damascus Steel & Jade', significance: 'Imperial arms craftsmanship from the reign of Emperor Aurangzeb.' },
      { name: 'Royal Farmans & Astrological Compendiums', era: '1648 CE', material: 'Gold Illuminated Manuscript', significance: 'Imperial decrees issued on the founding of Shahjahanabad.' }
    ],
    description: 'Housed within the original Mumtaz Mahal inside Lal Qila, this museum preserves relics of the late Mughal period, astronomical instruments, carpets, textiles, and historical arms.'
  },
  {
    id: 'khajuraho-museum',
    name: 'Khajuraho Archaeological Museum',
    hindiName: 'खजुराहो पुरातत्व संग्रहालय',
    circleId: 'bhopal-circle',
    location: 'Western Group of Temples, Khajuraho',
    state: 'Madhya Pradesh',
    establishedYear: 1910,
    image: 'https://images.unsplash.com/photo-1600100397608-f010e42e4e70?w=1080&q=80',
    ticketFee: { indian: 10, foreigner: 50, child: 0 },
    timings: '09:00 AM - 05:00 PM',
    closedOn: 'Friday',
    keyAntiquities: [
      { name: 'Colossal Nritta Ganesha with 8 Arms', era: '10th Century CE (Chandela)', material: 'Buff Sandstone', significance: 'Remarkable dynamicity depicting Lord Ganesha dancing with divine attendants.' },
      { name: 'Alingana Murti of Uma-Maheshvara', era: '11th Century CE', material: 'Carved Sandstone', significance: 'Intricate iconographic representation of divine union and marital bliss.' },
      { name: 'Surasundari Writing a Love Letter', era: 'c. 1000 CE', material: 'Sandstone', significance: 'Iconic celestial beauty carving demonstrating Chandela sculptural virtuosity.' }
    ],
    description: 'Displays over 2,000 masterly sculptures from ruined Chandela shrines, illustrating the synthesis of Hindu, Jain, and tantric philosophies of 10th-century Bundelkhand.'
  },
  {
    id: 'hampi-kamalapur-museum',
    name: 'Hampi Archaeological Museum, Kamalapur',
    hindiName: 'हम्पी पुरातत्व संग्रहालय, कमलापुर',
    circleId: 'dharwad-circle',
    location: 'Kamalapur, Vijayanagara District',
    state: 'Karnataka',
    establishedYear: 1972,
    image: 'https://images.unsplash.com/photo-1600100397608-f010e42e4e70?w=1080&q=80',
    ticketFee: { indian: 15, foreigner: 50, child: 0 },
    timings: '10:00 AM - 05:00 PM',
    closedOn: 'Friday',
    keyAntiquities: [
      { name: 'Scale Model of Vijayanagara Capital Topography', era: 'Modern ASI Model', material: '3D Relief Diorama', significance: 'Shows the complete 41 sq km layout of hills, river, fortified gateways and temples.' },
      { name: 'Gold Varaha Coins of Krishnadevaraya', era: '1509–1529 CE', material: 'Minted Gold', significance: 'Coins depicting Lord Venkateshwara and the emblem of the Royal Boar.' },
      { name: 'Sati Stones and Hero Stones (Viragallu)', era: '14th–16th Century CE', material: 'Granite & Chloritic Schist', significance: 'Honoring warriors fallen defending the southern frontier.' }
    ],
    description: 'Contains four galleries exhibiting royal sculpture, weapons, brass icons, medieval palm-leaf manuscripts, and an extraordinary relief map of the sacred Kishkindha geography.'
  }
];

// Cutting-edge ASI Scientific Conservation Projects
export const asiConservationProjects: AsiConservationProject[] = [
  {
    id: 'taj-mahal-marble-poultice',
    title: 'Mud-Pack Fuller’s Earth Poultice Treatment',
    monument: 'Taj Mahal Mausoleum',
    location: 'Agra, Uttar Pradesh',
    era: '17th Century Mughal (1631–1648 CE)',
    scientificTechnique: 'Multani Mitti non-abrasive clay poultice absorption of particulate hydrocarbons and sulfur deposits',
    objective: 'Restoration of natural translucent luster of Makrana white marble without chemical erosion',
    status: 'Ongoing',
    leadWing: 'Science Branch, Archaeological Survey of India, Dehradun',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1080&q=80',
    details: 'The ASI Science Branch utilizes a traditional paste of Multani Mitti (Fuller’s Earth) applied across the marble facade. As the clay dries over 48 hours, it gently draws out embedded airborne grime, oil particles, and yellowing deposits from the marble pores before being washed with distilled de-ionized water.'
  },
  {
    id: 'konark-sand-extraction',
    title: 'Jagmohana Sand Evacuation & Seismic Stabilization',
    monument: 'Sun Temple at Konark',
    location: 'Konark, Puri, Odisha',
    era: '13th Century Eastern Ganga (c. 1250 CE)',
    scientificTechnique: 'Endoscopic micro-drilling, laser LiDAR deflection telemetry & controlled sand evacuation',
    objective: 'Safely removing 118-year-old British sand filling inside the 40m Jagamohana assembly hall',
    status: 'Phase II Completed',
    leadWing: 'Bhubaneswar Circle & Central Building Research Institute (CBRI Roorkee)',
    image: 'https://images.unsplash.com/photo-1600100397608-f010e42e4e70?w=1080&q=80',
    details: 'In 1903, British engineers filled the colossal assembly hall of Konark with sand and sealed its doorways to prevent structural collapse. ASI and CBRI engineered a computerized sand extraction protocol using stainless steel temporary support frames and fiber-optic endoscopy to ensure internal stability.'
  },
  {
    id: 'dwarka-underwater-survey',
    title: 'Marine Archaeological Excavation of Submerged Port City',
    monument: 'Dwarka Ancient Submerged Port & Bet Dwarka',
    location: 'Gulf of Kutch, Arabian Sea, Gujarat',
    era: 'Late Harappan to Mahabharata Era (c. 1500–500 BCE)',
    scientificTechnique: 'Side-scan sonar bathymetry, scuba underwater airlift suction & photogrammetry',
    objective: 'Mapping submerged stone bastion walls, three-holed anchors, and ancient harbor wharves',
    status: 'National Priority',
    leadWing: 'Underwater Archaeology Wing (UAW), ASI Headquarters',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&q=80',
    details: 'Led by the Underwater Archaeology Wing, marine archaeologists have uncovered massive composite stone masonry walls, bastion structures, and Mediterranean-type triangular stone anchors submerged 6 to 12 meters beneath the Arabian Sea, validating coastal descriptions in ancient Sanskrit chronicles.'
  },
  {
    id: 'rakhigarhi-harappan-dna',
    title: 'Excavation of Necropolis & Ancient DNA Genomics',
    monument: 'Rakhigarhi Harappan Metropolis (Site RGR-7)',
    location: 'Hisar District, Haryana',
    era: 'Mature Harappan (2600–1900 BCE)',
    scientificTechnique: 'Stratigraphic archaeological excavation, cranial ancient DNA sequencing, accelerator mass spectrometry',
    objective: 'Reconstructing the indigenous genetic continuity, trade diets, and urban sanitary systems',
    status: 'Ongoing',
    leadWing: 'Excavation Branch V, ASI & Birbal Sahni Institute of Palaeosciences',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1080&q=80',
    details: 'Covering over 350 hectares, Rakhigarhi is the largest Harappan city discovered to date. ASI excavations revealed a sophisticated mud-brick citadel, underground baked-brick drains, standardized granaries, and intact human burials yielding pristine ancient genome samples demonstrating continuous indigenous ancestry.'
  }
];

// Epigraphy & Ancient Inscriptions Archive
export const asiEpigraphyRecords: AsiEpigraphyRecord[] = [
  {
    id: 'ashoka-girnar-rock-edict',
    title: 'Major Rock Edict of Emperor Ashoka at Junagadh',
    script: 'Brahmi Script',
    language: 'Prakrit',
    period: 'c. 257 BCE (Mauryan Empire)',
    dynasty: 'Mauryan Dynasty (Emperor Ashoka Devanampriya Priyadarsin)',
    findspot: 'Junagadh, Saurashtra, Gujarat',
    summary: 'Contains fourteen rock edicts preaching non-violence (Ahimsa), religious tolerance, medical treatment for humans and animals, and planting banyan trees along highways.',
    translationSnippet: '"Everywhere within the conquered dominions of King Priyadarsin, Beloved of the Gods, and likewise among neighboring borders... medical treatment for men and animals has been established."',
    discoveredYear: 1822
  },
  {
    id: 'delhi-iron-pillar-inscription',
    title: 'Sanskrit Eulogy of King Chandra on the Iron Pillar',
    script: 'Late Brahmi (Gupta Script)',
    language: 'Classical Sanskrit (Verses in Shardulavikridita meter)',
    period: 'c. 4th–5th Century CE',
    dynasty: 'Gupta Empire (Identified with Chandragupta II Vikramaditya)',
    findspot: 'Qutub Minar Courtyard, Mehrauli, Delhi',
    summary: 'A 6-line poetic inscription incised on the 1600-year-old rust-resistant iron pillar recording the conquests of King Chandra across Bengal and the Indus delta.',
    translationSnippet: '"He, on whose arm fame was inscribed by the sword when in the Vanga countries he turned back with his breast the enemies... he has erected this lofty standard of divine Vishnu on the hill called Vishnupada."',
    discoveredYear: 1838
  },
  {
    id: 'uttaramerur-democracy-inscription',
    title: 'Uttaramerur Temple Village Democracy & Kudavolai Edict',
    script: 'Grantha & Tamil Script',
    language: 'Old Tamil',
    period: '920 CE (12th & 14th regnal years of Parantaka Chola I)',
    dynasty: 'Imperial Chola Dynasty',
    findspot: 'Vaikunta Perumal Temple, Uttaramerur, Tamil Nadu',
    summary: 'A historic constitutional inscription laying down qualifications, disqualifications, lottery voting (Kudavolai), and strict anti-corruption rules for village assembly representatives.',
    translationSnippet: '"Of the thirty wards in Uttaramerur, people of each ward shall assemble and write names on palm-leaf tickets. A young boy shall draw the tickets... Candidates must own tax-paying land and have an unblemished record."',
    discoveredYear: 1898
  },
  {
    id: 'aihole-ravikirti-prasasti',
    title: 'Aihole Meguti Temple Inscription of Poet Ravikirti',
    script: 'Southern Brahmi Script',
    language: 'Classical Sanskrit',
    period: '634 CE (Saka 556)',
    dynasty: 'Badami Chalukyas (Emperor Pulakeshin II)',
    findspot: 'Meguti Jain Temple, Aihole, Bagalkot, Karnataka',
    summary: 'Composed by royal court poet Ravikirti, celebrated for dating the Mahabharata war and recording Pulakeshin II’s legendary victory over Emperor Harsha of Kannauj on the banks of the Narmada.',
    translationSnippet: '"Harsha (whose very name means Joy), whose joy melted away through fear when his array of elephants fell in the fierce battle on the Narmada river..."',
    discoveredYear: 1876
  }
];

// Official ASI Ticket Pricing & Guidelines Catalog
export const asiTicketPricingList: AsiTicketPricing[] = [
  {
    monumentId: 'taj-mahal',
    monumentName: 'Taj Mahal (Mausoleum & Complex)',
    circle: 'Agra Circle',
    category: 'A (World Heritage)',
    indianRate: 50,
    saarcBimstecRate: 540,
    foreignRate: 1100,
    domeFee: 200, // Optional ticket to enter the main mausoleum cenotaph chamber
    timings: 'Sunrise to Sunset (30 mins before sunrise to 30 mins before sunset)',
    weeklyClosure: 'Friday (Open only for Friday prayer attendees at mosque)',
    photographyAllowed: true,
    droneAllowed: false
  },
  {
    monumentId: 'qutub-minar',
    monumentName: 'Qutub Minar and its Monuments',
    circle: 'Delhi Circle',
    category: 'A (World Heritage)',
    indianRate: 40,
    saarcBimstecRate: 40,
    foreignRate: 600,
    timings: '07:00 AM - 09:00 PM (Illuminated Night Viewing)',
    weeklyClosure: 'Open 7 Days',
    photographyAllowed: true,
    droneAllowed: false
  },
  {
    monumentId: 'red-fort',
    monumentName: 'Red Fort Complex (Lal Qila)',
    circle: 'Delhi Circle',
    category: 'A (World Heritage)',
    indianRate: 35,
    saarcBimstecRate: 35,
    foreignRate: 550,
    timings: '09:00 AM - 09:00 PM',
    weeklyClosure: 'Monday',
    photographyAllowed: true,
    droneAllowed: false
  },
  {
    monumentId: 'ellora-caves',
    monumentName: 'Ellora Caves (Caves 1–34 & Kailasa)',
    circle: 'Aurangabad Circle',
    category: 'A (World Heritage)',
    indianRate: 40,
    saarcBimstecRate: 40,
    foreignRate: 600,
    timings: '06:00 AM - 06:00 PM',
    weeklyClosure: 'Tuesday',
    photographyAllowed: true,
    droneAllowed: false
  },
  {
    monumentId: 'konark-sun-temple',
    monumentName: 'Sun Temple at Konark',
    circle: 'Bhubaneswar Circle',
    category: 'A (World Heritage)',
    indianRate: 40,
    saarcBimstecRate: 40,
    foreignRate: 600,
    timings: '06:00 AM - 08:00 PM',
    weeklyClosure: 'Open 7 Days',
    photographyAllowed: true,
    droneAllowed: false
  },
  {
    monumentId: 'hampi',
    monumentName: 'Group of Monuments at Hampi (Vittala Temple & Zenana Enclosure)',
    circle: 'Dharwad Circle',
    category: 'A (World Heritage)',
    indianRate: 40,
    saarcBimstecRate: 40,
    foreignRate: 600,
    timings: '06:00 AM - 06:00 PM',
    weeklyClosure: 'Open 7 Days',
    photographyAllowed: true,
    droneAllowed: false
  },
  {
    monumentId: 'khajuraho',
    monumentName: 'Western Group of Temples, Khajuraho',
    circle: 'Bhopal Circle',
    category: 'A (World Heritage)',
    indianRate: 40,
    saarcBimstecRate: 40,
    foreignRate: 600,
    timings: 'Sunrise to Sunset',
    weeklyClosure: 'Open 7 Days',
    photographyAllowed: true,
    droneAllowed: false
  },
  {
    monumentId: 'sanchi-stupa',
    monumentName: 'Buddhist Monuments at Sanchi',
    circle: 'Bhopal Circle',
    category: 'A (World Heritage)',
    indianRate: 40,
    saarcBimstecRate: 40,
    foreignRate: 600,
    timings: '06:30 AM - 06:30 PM',
    weeklyClosure: 'Open 7 Days',
    photographyAllowed: true,
    droneAllowed: false
  },
  {
    monumentId: 'rani-ki-vav',
    monumentName: 'Rani Ki Vav (The Queen’s Stepwell)',
    circle: 'Vadodara Circle',
    category: 'A (World Heritage)',
    indianRate: 40,
    saarcBimstecRate: 40,
    foreignRate: 600,
    timings: '08:00 AM - 06:00 PM',
    weeklyClosure: 'Open 7 Days',
    photographyAllowed: true,
    droneAllowed: false
  },
  {
    monumentId: 'mahabalipuram',
    monumentName: 'Group of Monuments at Mahabalipuram (Shore Temple & Rathas)',
    circle: 'Chennai Circle',
    category: 'A (World Heritage)',
    indianRate: 40,
    saarcBimstecRate: 40,
    foreignRate: 600,
    timings: '06:00 AM - 06:00 PM',
    weeklyClosure: 'Open 7 Days',
    photographyAllowed: true,
    droneAllowed: false
  }
];

// AMASR Act Legal Heritage Protection Codes
export const amasrActSummary = {
  actName: 'The Ancient Monuments and Archaeological Sites and Remains Act, 1958 (Amended 2010)',
  authority: 'National Monuments Authority (NMA) & Archaeological Survey of India (ASI)',
  zones: [
    {
      zone: 'Prohibited Area',
      radius: '100 meters in all directions from the protected monument boundary',
      rules: 'No construction of any kind (commercial or residential) is permitted under any circumstances. Mining, blasting, and heavy vehicle vibrations strictly forbidden.'
    },
    {
      zone: 'Regulated Area',
      radius: '200 meters extending beyond the prohibited area (total 300m buffer)',
      rules: 'Construction or repair work requires prior NOC and permission from the National Monuments Authority (NMA).'
    }
  ],
  penalties: 'Up to 2 years rigorous imprisonment and fine of ₹1,00,000 for illegal encroachment, defacement, or vandalism of national heritage.',
  freeEntryRules: [
    'Children below 15 years of age enter free of charge at all ASI monuments.',
    'World Heritage Day (April 18) - Free admission for all visitors.',
    'International Museum Day (May 18) - Free admission to all ASI site museums.',
    'World Heritage Week (November 19 to 25) - Free entry on opening day.',
    'International Women’s Day (March 8) - Free entry for all women visitors.'
  ]
};
