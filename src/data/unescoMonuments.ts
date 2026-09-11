export interface UnescoMonument {
  id: string;
  name: string;
  hindiName: string;
  location: string;
  stateId: string;
  stateName: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';
  yearInscribed: number;
  category: 'cultural' | 'natural' | 'mixed';
  image: string;
  history: string;
  coreHighlight: string;
  architecturalSignificance: string;
  architecturalWonders: string[];
  audioNarration: string;
  modelPreset:
    | 'vimana-temple'
    | 'taj-mausoleum'
    | 'konark-wheel'
    | 'qutub-minaret'
    | 'fort-bastions'
    | 'buddhist-stupa'
    | 'subterranean-stepwell'
    | 'rock-cut-caves';
  coordinates: { lat: number; lng: number };
  unescoCriteria: string;
}

export const unescoMonumentsList: UnescoMonument[] = [
  // 1. Hampi (Karnataka) - PDF Page 1
  {
    id: 'hampi',
    name: 'Group of Monuments at Hampi',
    hindiName: 'हम्पी स्मारक समूह',
    location: 'Vijayanagara district, east-central Karnataka',
    stateId: 'karnataka',
    stateName: 'Karnataka',
    region: 'South',
    yearInscribed: 1986,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1697730504977-26847b1f1f91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8SGFtcGklMjBzdG9uZSUyMGNoYXJpb3R8ZW58MHx8fHwxNzg5MDY4MTEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Hampi became the capital of the Vijayanagara Empire, founded in 1336 by Harihara I and Bukka Raya I. It grew into a major political, commercial and cultural centre of South India. During the 15th and early 16th centuries, particularly under Krishnadevaraya (1509–1530), the city reached great prosperity. Its decline came after the Battle of Talikota in 1565.',
    coreHighlight: 'Hampi was the grand capital of the Vijayanagara Empire, known for its magnificent temples, palaces, markets and fortifications. Its spectacular ruins spread across a landscape of granite hills and the Tungabhadra River. It became a UNESCO World Heritage Site in 1986.',
    architecturalSignificance: 'Hampi showcases the finest Vijayanagara-style architecture, with grand temples, ornate pillars, sculptures and towering gopurams. The Vittala Temple and Stone Chariot are iconic examples of its artistic excellence.',
    architecturalWonders: [
      '56 Musical Pillars in Vittala Temple that resonate musical notes when tapped',
      'Monolithic Stone Chariot carved like a processional wooden temple car',
      'Sophisticated stone aqueducts and inverted pinhole projection inside Virupaksha Temple'
    ],
    audioNarration: 'Welcome to Hampi in Vijayanagara district, Karnataka. Founded in 1336 by Harihara and Bukka, Hampi became the glorious capital of the Vijayanagara Empire, reaching its zenith under King Krishnadevaraya. Spread across boulder-strewn granite hills along the Tungabhadra River, Hampi is celebrated for the iconic monolithic Stone Chariot and the acoustic musical pillars of the Vittala Temple.',
    modelPreset: 'vimana-temple',
    coordinates: { lat: 15.3350, lng: 76.4600 },
    unescoCriteria: '(i), (iii), (iv)'
  },

  // 2. Konark Sun Temple (Odisha) - PDF Page 2
  {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple',
    hindiName: 'कोणार्क सूर्य मंदिर',
    location: 'Bhubaneswar, Odisha',
    stateId: 'odisha',
    stateName: 'Odisha',
    region: 'East',
    yearInscribed: 1984,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1694475136007-14c4dbf484f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8S29uYXJrJTIwU3VuJTIwVGVtcGxlJTIwd2hlZWx8ZW58MHx8fHwxNzg5MDY4MTEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'The Konark Sun Temple was built in the 13th century, around 1250 CE, during the reign of King Narasimhadeva I (1238–1264 CE) of the Eastern Ganga Dynasty. It was constructed as a grand temple dedicated to Surya, the Hindu Sun God, reflecting the power and prosperity of the Ganga kingdom.',
    coreHighlight: 'The Konark Sun Temple is a magnificent 13th-century temple in Odisha, built as the celestial chariot of Surya, the Sun God. Its 24 carved wheels and stone horses make it one of India’s most iconic monuments. It became a UNESCO World Heritage Site in 1984.',
    architecturalSignificance: 'The temple represents the peak of Kalinga architecture, featuring intricate stone carvings, sculpted wheels, dancers, musicians and mythological figures. Its detailed sculptures beautifully combine architecture, religion and artistic expression.',
    architecturalWonders: [
      '24 colossal stone wheels functioning as precision astronomical sundials accurate to minutes',
      'Seven galloping stone horses representing the days of the week pulling the Sun God chariot',
      'Built without mortar using precision iron dowels and Khondalite stone joinery'
    ],
    audioNarration: 'Behold the magnificent Sun Temple of Konark in Odisha, sculpted around 1250 CE by King Narasimhadeva I of the Eastern Ganga Dynasty. Conceived as the cosmic chariot of Lord Surya, its 24 carved stone wheels are precision astronomical sundials measuring time through sunbeam shadows, representing the pinnacle of ancient Kalinga stone architecture.',
    modelPreset: 'konark-wheel',
    coordinates: { lat: 19.8876, lng: 86.0945 },
    unescoCriteria: '(i), (iii), (vi)'
  },

  // 3. Qutub Minar (Delhi) - PDF Page 3
  {
    id: 'qutub-minar',
    name: 'Qutub Minar and its Monuments',
    hindiName: 'क़ुतुब मीनार',
    location: 'Mehrauli area of South New Delhi',
    stateId: 'delhi',
    stateName: 'Delhi',
    region: 'North',
    yearInscribed: 1993,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1697730320983-f99aab252a44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8UXV0dWIlMjBNaW5hciUyMERlbGhpfGVufDB8fHx8MTc4OTA2ODExM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'The Qutub Minar was started in the late 12th century, around 1199 CE, by Qutb-ud-din Aibak, founder of the Mamluk (Slave) Dynasty and the first Sultan of the Delhi Sultanate. His successor Iltutmish added three more storeys in the 13th century, later restored by Firoz Shah Tughlaq.',
    coreHighlight: 'Rising approximately 73 metres, Qutub Minar is one of the world\'s tallest brick minarets. Its five storeys, alternating angular and rounded fluting, and red sandstone construction make it a striking landmark of Delhi. Inscribed as a UNESCO World Heritage Site in 1993.',
    architecturalSignificance: 'Qutub Minar is an outstanding example of early Indo-Islamic architecture, combining Islamic forms with Indian craftsmanship. Its balconies, geometric patterns, floral motifs and Arabic and Nagari inscriptions display remarkable stone-carving skills, surrounded by the Quwwat-ul-Islam Mosque and rustless Iron Pillar.',
    architecturalWonders: [
      '72.5 meters tall with five tapering storeys and projecting bracketed balconies',
      'Alternating angular and rounded fluted sandstone columns on lower storeys',
      'The 1,600-year-old Gupta Iron Pillar nearby that has never rusted despite centuries of monsoon exposure'
    ],
    audioNarration: 'Welcome to the Qutub Minar in Mehrauli, South Delhi. Commenced in 1199 CE by Qutb-ud-din Aibak, founder of the Delhi Sultanate, this 73-meter tower is one of the world\'s tallest brick minarets. It features five storeys of alternating angular and rounded flutings, surrounded by the Quwwat-ul-Islam mosque and the enigmatic 1,600-year-old rust-resistant Iron Pillar.',
    modelPreset: 'qutub-minaret',
    coordinates: { lat: 28.5245, lng: 77.1855 },
    unescoCriteria: '(iv)'
  },

  // 4. Red Fort (Delhi) - PDF Page 4
  {
    id: 'red-fort',
    name: 'Red Fort Complex (Lal Qila)',
    hindiName: 'लाल किला',
    location: 'Netaji Subhash Marg in Old Delhi, Delhi',
    stateId: 'delhi',
    stateName: 'Delhi',
    region: 'North',
    yearInscribed: 2007,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1661919589683-f11880119fb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8UmVkJTIwRm9ydCUyMERlbGhpfGVufDB8fHx8MTc4OTA2ODExNHww&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'The Red Fort (Lal Qila) was built in the 17th century (1639–1648) by Mughal Emperor Shah Jahan as the palace-fort of Shahjahanabad, his new capital after shifting from Agra. It remained the main residence of Mughal emperors for nearly two centuries.',
    coreHighlight: 'Famous for its massive red sandstone walls, grand gateways and royal palaces. It is also a powerful symbol of modern India, as the Prime Minister hoists the national flag here every Independence Day. Inscribed as a UNESCO World Heritage Site in 2007.',
    architecturalSignificance: 'The Red Fort represents the peak of Mughal architecture, blending Persian, Timurid, Islamic and Indian traditions. Its marble pavilions, intricate floral decoration, pietra dura work, gardens and the Nahr-i-Behisht (Stream of Paradise) showcase the refined artistic style of Shah Jahan\'s period.',
    architecturalWonders: [
      'Massive 2.4-kilometer defensive red sandstone walls soaring up to 33 meters high',
      'Nahr-i-Behisht (Stream of Paradise) flowing through imperial marble pavilions for passive cooling',
      'The Diwan-i-Khas which once held the jewel-encrusted Peacock Throne and Koh-i-Noor diamond'
    ],
    audioNarration: 'You are standing before the historic Red Fort in Old Delhi. Commissioned in 1639 by Emperor Shah Jahan as the citadel of Shahjahanabad, this red sandstone fort represents the pinnacle of Mughal palace design. Enclosing the Diwan-i-Aam and marble pavilions cooled by the Stream of Paradise, it remains the sovereign emblem from where India celebrates Independence Day.',
    modelPreset: 'fort-bastions',
    coordinates: { lat: 28.6562, lng: 77.2410 },
    unescoCriteria: '(ii), (iii), (vi)'
  },

  // 5. Chittorgarh (Rajasthan) - PDF Page 5
  {
    id: 'chittorgarh',
    name: 'Chittorgarh Fort',
    hindiName: 'चित्तौड़गढ़ किला',
    location: 'Chittor Fort, Chittorgarh, Rajasthan',
    stateId: 'rajasthan',
    stateName: 'Rajasthan',
    region: 'North',
    yearInscribed: 2013,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1697729640715-b4f8b691b9ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Q2hpdHRvcmdhcmglMjBmb3J0fGVufDB8fHx8MTc4OTA2ODExNXww&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Chittorgarh Fort has origins dating to the 7th–8th century CE and became the principal stronghold and capital of Mewar under the Guhila and Sisodia Rajputs. The fort witnessed three major historic sieges—by Alauddin Khalji (1303), Bahadur Shah of Gujarat (1535) and Akbar (1567–68)—making it an enduring symbol of Rajput courage.',
    coreHighlight: 'Spread across a huge hilltop, the fort contains palaces, temples, towers, reservoirs and seven gateways. Its most famous landmarks include the Vijay Stambha (Tower of Victory) and Kirti Stambha (Tower of Fame). Chittorgarh was inscribed as a UNESCO World Heritage Site in 2013.',
    architecturalSignificance: 'Chittorgarh represents the development of Rajput military and Mewar architecture from the 8th to 16th centuries. Its massive defensive walls, temples and palaces combine strategic design with intricate stone carving, showcasing medieval Rajasthan traditions.',
    architecturalWonders: [
      'Vijay Stambha (Tower of Victory) soaring 37 meters with 9 storeys decorated with Hindu deities',
      '84 water reservoirs storing enough rainwater to supply an army of 50,000 soldiers for 4 years',
      'Seven monumental fortified gateways (Pols) built along an uphill defensive approach'
    ],
    audioNarration: 'Welcome to Chittorgarh Fort in Rajasthan, the legendary citadel of Mewar perched atop a 180-meter hill. Spanning seven hundred acres with palaces, ancient temples, and vast water reservoirs, Chittorgarh is renowned for the nine-storey Vijay Stambha and its unyielding spirit of Rajput valor.',
    modelPreset: 'fort-bastions',
    coordinates: { lat: 24.8879, lng: 74.6453 },
    unescoCriteria: '(ii), (iii)'
  },

  // 6. The Brihadisvar Temple (Tamil Nadu) - PDF Page 6
  {
    id: 'brihadisvara-temple',
    name: 'The Brihadisvara Temple, Thanjavur',
    hindiName: 'बृहदीश्वर मंदिर, तंजावुर',
    location: 'Thanjavur, Tamil Nadu',
    stateId: 'tamil-nadu',
    stateName: 'Tamil Nadu',
    region: 'South',
    yearInscribed: 1987,
    category: 'cultural',
    image: 'https://images.unsplash.com/photo-1686310894901-d326b8722c13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8VGhhbmphdnVyJTIwQnJpaGFkZWVzd2FyYXIlMjBUZW1wbGV8ZW58MHx8fHwxNzg5MDY4MTE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'The Brihadisvara Temple was built in the early 11th century CE (c. 1003–1010 CE) by Raja Raja Chola I of the Chola Dynasty. Dedicated to Lord Shiva, it was built as a grand expression of Chola power, devotion and architectural achievement. It later became an important centre of religious, cultural and artistic activity.',
    coreHighlight: 'The temple is famous for its enormous vimana (tower), rising about 66 metres above the sanctum. Built largely from granite, it is one of the greatest achievements of Chola architecture. It forms part of the UNESCO World Heritage property "Great Living Chola Temples", inscribed in 1987.',
    architecturalSignificance: 'Brihadisvara is a masterpiece of Dravidian temple architecture, featuring a monumental vimana, sculpted figures, inscriptions and elaborate stonework. Its frescoes, bronze traditions and detailed sculptures reflect the exceptional artistic achievements of the Chola period.',
    architecturalWonders: [
      'The Kumbam (apex dome capstone) is carved from a single 80-tonne granite block',
      'Built entirely of granite sourced from 60 kilometers away without nearby quarries',
      'The massive Vimana casts virtually no shadow outside its base plinth at noon'
    ],
    audioNarration: 'You are gazing upon the Brihadisvara Temple in Thanjavur, Tamil Nadu, completed in 1010 CE by Emperor Raja Raja Chola I. Rising sixty-six meters into the sky, this granite pyramid tower is crowned by a colossal eighty-ton monolith capstone rolled up an engineered earthen ramp. It stands as the grandest monument of Dravidian Chola architecture.',
    modelPreset: 'vimana-temple',
    coordinates: { lat: 10.7828, lng: 79.1318 },
    unescoCriteria: '(ii), (iii)'
  },

  // 7. Agra Fort (Uttar Pradesh) - PDF Page 7
  {
    id: 'agra-fort',
    name: 'Agra Fort',
    hindiName: 'आगरा किला',
    location: 'Agra, Uttar Pradesh',
    stateId: 'uttar-pradesh',
    stateName: 'Uttar Pradesh',
    region: 'North',
    yearInscribed: 1983,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1661930618375-aafabc2bf3e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8QWdyYSUyMEZvcnR8ZW58MHx8fHwxNzg5MDY4MTE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Agra Fort is a historic Mughal fortress whose present form was largely built by Emperor Akbar in the 16th century, beginning around 1565. It became an important imperial residence and political center of the Mughal Empire under rulers including Akbar, Jahangir, Shah Jahan, and Aurangzeb.',
    coreHighlight: 'One of the finest examples of Mughal imperial architecture, serving as a royal residence, military stronghold, and center of administration. Its enormous red sandstone walls enclose magnificent palaces, audience halls, mosques and gardens. Inscribed as a UNESCO World Heritage Site in 1983.',
    architecturalSignificance: 'Agra Fort showcases the evolution of Mughal architecture through its combination of Indian, Persian, Central Asian, and Timurid influences. Red sandstone structures built under Akbar contrast with the white-marble buildings added by Shah Jahan with intricate pietra dura and decorative screens.',
    architecturalWonders: [
      'Massive 2.5-kilometer double red sandstone ramparts pierced by four grand gateways',
      'Sheesh Mahal (Mirror Palace) lined with thousands of miniature glass mirrors',
      'Musamman Burj: the octagonal marble tower overlooking the Yamuna with direct views of the Taj Mahal'
    ],
    audioNarration: 'Welcome to Agra Fort in Uttar Pradesh, built by Emperor Akbar starting in 1565. Enclosed by massive red sandstone walls, this palace-citadel witnessed the grandeur of four generations of Mughal emperors. Within its walls, Akbar\'s rugged sandstone Jahangiri Mahal stands alongside Shah Jahan\'s delicate white marble pavilions overlooking the Taj Mahal.',
    modelPreset: 'fort-bastions',
    coordinates: { lat: 27.1795, lng: 78.0211 },
    unescoCriteria: '(iii)'
  },

  // 8. Ajanta Caves (Maharashtra) - PDF Page 8
  {
    id: 'ajanta-caves',
    name: 'Ajanta Caves',
    hindiName: 'अजंता गुफाएं',
    location: 'Chhatrapati Sambhajinagar, Maharashtra',
    stateId: 'maharashtra',
    stateName: 'Maharashtra',
    region: 'West',
    yearInscribed: 1983,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1697729588019-20a1f5a325d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8QWphbnRhJTIwQ2F2ZXN8ZW58MHx8fHwxNzg5MDY4MTE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'The Ajanta Caves are a remarkable group of Buddhist rock-cut caves developed in two major phases, beginning around the 2nd century BCE and flourishing again from the 5th to 6th centuries CE under the Vakataka dynasty during the reign of King Harishena.',
    coreHighlight: 'Its extraordinary collection of Buddhist murals, sculptures, and rock-cut architecture carved directly into a horseshoe-shaped cliff over the Waghur River. Famous for ancient tempera paintings depicting the life of Buddha and Jataka tales. Inscribed in 1983.',
    architecturalSignificance: 'Ajanta represents one of the finest achievements of ancient Indian rock-cut architecture and Buddhist art. The caves contain intricately carved pillars, stupas, monasteries, chaitya halls, and richly colored tempera murals with expressive human figures and spiritual serenity.',
    architecturalWonders: [
      '30 rock-cut caves carved into a panoramic horseshoe volcanic basalt cliff gorge',
      'World-famous murals of Bodhisattva Padmapani and Vajrapani painted with natural mineral pigments',
      'Chaitya Hall Cave 26 with a colossal 7-meter reclining Mahaparinirvana Buddha'
    ],
    audioNarration: 'Step into the serene Waghur gorge at Ajanta in Chhatrapati Sambhajinagar, Maharashtra. Carved into a dramatic horseshoe basalt cliff between the second century BCE and sixth century CE, these thirty Buddhist caves house the greatest masterworks of ancient Asian painting, illustrating the compassion and enlightenment of the Buddha.',
    modelPreset: 'rock-cut-caves',
    coordinates: { lat: 20.5519, lng: 75.7033 },
    unescoCriteria: '(i), (ii), (iii), (vi)'
  },

  // 9. Ellora Caves (Maharashtra) - PDF Page 9
  {
    id: 'ellora-caves',
    name: 'Ellora Caves & Kailasa Temple',
    hindiName: 'एलोरा गुफाएं व कैलाश मंदिर',
    location: 'Chhatrapati Sambhajinagar, Maharashtra',
    stateId: 'maharashtra',
    stateName: 'Maharashtra',
    region: 'West',
    yearInscribed: 1983,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1697729444936-8c6a6f643312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8RWxsb3JhJTIwS2FpbGFzYSUyMFRlbXBsZXxlbnwwfHx8fDE3ODkwNjgxMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'The Ellora Caves are a spectacular group of 34 rock-cut Buddhist, Hindu, and Jain monuments developed between the 6th and 10th centuries CE, with major construction taking place under the Rashtrakuta dynasty, reflecting religious coexistence and tolerance in ancient India.',
    coreHighlight: 'Inscribed on the UNESCO World Heritage List in 1983. Their greatest highlight is the Kailasa Temple (Cave 16), an enormous monolithic temple carved entirely from a single piece of rock from the top down, demonstrating extraordinary engineering and artistic skill.',
    architecturalSignificance: 'Ellora is renowned for bringing together Buddhist viharas, Hindu temples, and Jain shrines within one complex. The Kailasa Temple is notable for its monumental scale, sculpted elephants, elaborate pillars, and multi-storey pavilions sculpted from a single solid basalt cliff.',
    architecturalWonders: [
      'Kailasa Cave 16 is the world\'s largest monolithic rock excavation, carved top-down without scaffolding',
      'Over 200,000 tonnes of volcanic basalt stone excavated using only chisels and hammers',
      'Features a two-storey gateway, Nandi mandapa, assembly hall, and life-size rock-cut elephants'
    ],
    audioNarration: 'Behold the jaw-dropping Kailasa Temple at Ellora, Maharashtra. Commissioned by the Rashtrakuta Dynasty in the eighth century, master sculptors started at the summit of a mountain cliff and carved downwards, removing over two hundred thousand tons of basalt rock to liberate a complete multi-storey temple from a single stone monolith.',
    modelPreset: 'vimana-temple',
    coordinates: { lat: 20.0268, lng: 75.1790 },
    unescoCriteria: '(i), (iii), (vi)'
  },

  // 10. Taj Mahal (Uttar Pradesh) - PDF Page 10
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    hindiName: 'ताज महल',
    location: 'Agra, Uttar Pradesh',
    stateId: 'uttar-pradesh',
    stateName: 'Uttar Pradesh',
    region: 'North',
    yearInscribed: 1983,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1661885523029-fc960a2bb4f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8VGFqJTIwTWFoYWwlMjBBZ3JhfGVufDB8fHx8MTc4OTA2ODExOHww&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'A magnificent mausoleum in Agra commissioned by Mughal Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal, who died in 1631. Construction began around 1632 and was completed around 1648, belonging to the 17th century Mughal Dynasty.',
    coreHighlight: 'Inscribed on the UNESCO World Heritage List in 1983 for its outstanding universal value and exceptional architectural beauty. Built primarily from gleaming white Makrana marble, it is widely recognized as an eternal symbol of love and artistic perfection.',
    architecturalSignificance: 'The monument combines Persian, Islamic, Central Asian, and Indian styles. Its central dome, four minarets, symmetrical gardens, marble screens, calligraphy, and intricate pietra dura gemstone inlay make it an outstanding example of Mughal craftsmanship.',
    architecturalWonders: [
      'Four 40-meter minarets engineered to lean slightly outward to prevent dome collapse during tremors',
      'Pietra Dura (Parchin Kari) inlays utilizing lapis lazuli, carnelian, jade, and malachite',
      'Flawless bilateral symmetry reflected across the water channels of the Charbagh garden'
    ],
    audioNarration: 'Welcome to the Taj Mahal in Agra, Uttar Pradesh. Commissioned in 1632 by Emperor Shah Jahan in memory of his wife Mumtaz Mahal, this white marble mausoleum stands as a universally admired masterpiece. From its central bulbous dome to its intricate gemstone inlays, the Taj Mahal embodies pure mathematical symmetry and romance.',
    modelPreset: 'taj-mausoleum',
    coordinates: { lat: 27.1751, lng: 78.0421 },
    unescoCriteria: '(i)'
  },

  // 11. Monuments at Mahabalipuram (Tamil Nadu) - PDF Page 11
  {
    id: 'mahabalipuram',
    name: 'Group of Monuments at Mahabalipuram',
    hindiName: 'महाबलीपुरम स्मारक समूह',
    location: 'Mahabalipuram, Tamil Nadu',
    stateId: 'tamil-nadu',
    stateName: 'Tamil Nadu',
    region: 'South',
    yearInscribed: 1984,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1694475518874-bd12a29e3332?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8TWFoYWJhbGlwdXJhbSUyMFNob3JlJTIwVGVtcGxlfGVufDB8fHx8MTc4OTA2ODExOHww&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Built mainly under the Pallava Dynasty during the 7th and 8th centuries CE, particularly under rulers Narasimhavarman I and Narasimhavarman II. The site developed as an important center of Pallava art, architecture, and maritime culture.',
    coreHighlight: 'Inscribed as a UNESCO World Heritage Site in 1984. Famous for rock-cut cave sanctuaries, monolithic rathas sculpted from single boulders, open-air bas-reliefs, and the seaside Shore Temple.',
    architecturalSignificance: 'Renowned for its Dravidian-style architecture and intricate stone sculptures. Highlights include the Five Rathas, Shore Temple, cave temples, and the monumental relief "Descent of the Ganges", demonstrating exceptional craftsmanship.',
    architecturalWonders: [
      'Descent of the Ganges: the world\'s largest open-air rock relief carved across two massive granite boulders',
      'Five Rathas: monolithic shrines sculpted to resemble ceremonial processional wooden chariots',
      'The Shore Temple: an 8th-century structural granite temple withstanding coastal winds and waves for 1,300 years'
    ],
    audioNarration: 'Welcome to Mahabalipuram on the Coromandel coast of Tamil Nadu. Sculpted by the Pallava kings in the seventh and eighth centuries, this seaside sanctuary features monolithic chariot temples carved from boulders and the dramatic Shore Temple braving the ocean waves for over thirteen centuries.',
    modelPreset: 'vimana-temple',
    coordinates: { lat: 12.6269, lng: 80.1927 },
    unescoCriteria: '(i), (ii), (iii), (vi)'
  },

  // 12. Churches and Convents of Goa - PDF Page 12
  {
    id: 'churches-of-goa',
    name: 'Churches and Convents of Goa',
    hindiName: 'गोवा के गिरजाघर व कॉन्वेंट',
    location: 'Velha Goa (Old Goa), Goa',
    stateId: 'goa',
    stateName: 'Goa',
    region: 'West',
    yearInscribed: 1986,
    category: 'cultural',
    image: 'https://images.unsplash.com/photo-1768728678060-598c3b983b3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8QmFzaWxpY2ElMjBCb20lMjBKZXN1cyUyMEdvYXxlbnwwfHx8fDE3ODkwNjgxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Built mainly during the 16th to 18th centuries under Portuguese rule following the establishment of Portuguese Goa in the early 16th century. They became important centers for the spread of Christianity and Indo-Portuguese culture across Asia.',
    coreHighlight: 'Inscribed as a UNESCO World Heritage Site in 1986. Its most famous monument is the Basilica of Bom Jesus, which houses the sacred tomb and incorrupt relics of St. Francis Xavier.',
    architecturalSignificance: 'Showcases Manueline, Mannerist and Baroque architectural styles adapted to Indian monsoon conditions. Richly decorated basalt façades, vaulted interiors, gilded woodcarvings, and religious paintings make them outstanding examples in Asia.',
    architecturalWonders: [
      'Basilica of Bom Jesus: Baroque unplastered laterite stone facade with ornate gilded altars',
      'Se Cathedral: one of the largest church edifices in Asia, famous for its Golden Bell',
      'Intricate fusion of European Renaissance motifs with indigenous Indian basalt craftsmanship'
    ],
    audioNarration: 'Explore the historic Churches and Convents of Old Goa. Constructed between the sixteenth and eighteenth centuries during Portuguese rule, these monumental cathedrals, including the Basilica of Bom Jesus and Se Cathedral, introduced Manueline and Baroque architecture to Asia.',
    modelPreset: 'taj-mausoleum',
    coordinates: { lat: 15.5009, lng: 73.9116 },
    unescoCriteria: '(ii), (iv), (vi)'
  },

  // 13. Khajuraho Group of Monuments (Madhya Pradesh) - PDF Page 13
  {
    id: 'khajuraho',
    name: 'Khajuraho Group of Monuments',
    hindiName: 'खजुराहो स्मारक समूह',
    location: 'Chhatarpur, Madhya Pradesh',
    stateId: 'madhya-pradesh',
    stateName: 'Madhya Pradesh',
    region: 'Central',
    yearInscribed: 1986,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1661963629241-52c812d5c7f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8S2hhanVyYWhvJTIwdGVtcGxlfGVufDB8fHx8MTc4OTA2ODEyMHww&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'The Khajuraho temples were built mainly between the 10th and 12th centuries CE under the Chandela Dynasty. Originally, the complex consisted of 85 temples dedicated to Hindu and Jain traditions, reflecting religious diversity and cultural prosperity.',
    coreHighlight: 'Inscribed as a UNESCO World Heritage Site in 1986. The temples are best known for their extraordinary sandstone sculptures portraying deities, celestial apsaras, musicians, dancers, animals, and human relationships with remarkable detail.',
    architecturalSignificance: 'Outstanding examples of Nagara-style temple architecture with tall curvilinear shikharas. The Kandariya Mahadeva Temple is one of the finest examples, showcasing balanced proportions and exceptional stone carving.',
    architecturalWonders: [
      'Kandariya Mahadeva features over 870 life-sized statues carved into its external and internal walls',
      'Soaring curvilinear Shikhara spires simulating the mountain peaks of sacred Mount Kailash',
      'Intricate mortise-and-tenon stone joinery assembled without mortar'
    ],
    audioNarration: 'Welcome to Khajuraho in Chhatarpur district, Madhya Pradesh. Built under the Chandela Dynasty between 950 and 1050 CE, these Nagara-style sandstone temples feature thousands of expressive sculptures celebrating life, music, martial prowess, and spiritual liberation.',
    modelPreset: 'vimana-temple',
    coordinates: { lat: 24.8318, lng: 79.9199 },
    unescoCriteria: '(i), (iii)'
  },

  // 14. Fatehpur Sikri (Uttar Pradesh) - PDF Page 14
  {
    id: 'fatehpur-sikri',
    name: 'Fatehpur Sikri',
    hindiName: 'फ़तेहपुर सीकरी',
    location: 'Agra, Uttar Pradesh',
    stateId: 'uttar-pradesh',
    stateName: 'Uttar Pradesh',
    region: 'North',
    yearInscribed: 1986,
    category: 'cultural',
    image: 'https://images.unsplash.com/photo-1736959453077-c6bfb10a60cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8RmF0ZWhwdXIlMjBTaWtyaSUyMEJ1bGFuZCUyMERhcndhemF8ZW58MHx8fHwxNzg5MDY4MTIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Founded by Mughal Emperor Akbar in the 16th century and served as the capital of the Mughal Empire for a short period between 1571 and 1585, developed around the settlement of the revered Sufi saint Sheikh Salim Chishti.',
    coreHighlight: 'Inscribed as a UNESCO World Heritage Site in 1986. Famous for its remarkable collection of palaces, courtyards, mosques, and public buildings reflecting the architectural grandeur of Akbar\'s reign.',
    architecturalSignificance: 'Combines Mughal, Persian, Hindu, and Jain architectural influences. Important structures include the 54-meter Buland Darwaza, Jama Masjid, Panch Mahal, Diwan-i-Khas, and white marble Tomb of Sheikh Salim Chishti.',
    architecturalWonders: [
      'Buland Darwaza (Gate of Magnificence) soaring 54 meters, the highest gateway in the world',
      'Diwan-i-Khas central stone pillar with 36 carved serpentine brackets supporting Akbar\'s platform',
      'Panch Mahal: a five-storey stepped palace supported on 176 intricately carved sandstone pillars'
    ],
    audioNarration: 'You are stepping into Fatehpur Sikri near Agra, built by Emperor Akbar as his imperial capital in 1571. Here, Akbar blended Persian, Rajput, and Gujarati architectural traditions, crowned by the colossal 54-meter Buland Darwaza and the serene white marble shrine of Sheikh Salim Chishti.',
    modelPreset: 'taj-mausoleum',
    coordinates: { lat: 27.0945, lng: 77.6679 },
    unescoCriteria: '(ii), (iii), (iv)'
  },

  // 15. Elephanta Caves (Maharashtra) - PDF Page 15
  {
    id: 'elephanta-caves',
    name: 'Elephanta Caves',
    hindiName: 'एलिफेंटा गुफाएं',
    location: 'Mumbai Harbour, Maharashtra',
    stateId: 'maharashtra',
    stateName: 'Maharashtra',
    region: 'West',
    yearInscribed: 1987,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1697730348607-38bab9f149bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8RWxlcGhhbnRhJTIwQ2F2ZXMlMjBUcmltdXJ0aXxlbnwwfHx8fDE3ODkwNjgxMjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'The Elephanta Caves were primarily developed during the 5th–6th centuries CE, associated with the Kalachuri period. Carved into basalt rock on Elephanta Island (Gharapuri), the caves became an important centre of Shaivite worship.',
    coreHighlight: 'The main highlight is the magnificent Trimurti (Maheshmurti), a monumental three-faced 7-meter representation of Lord Shiva depicting Creator, Preserver, and Destroyer. Declared a UNESCO World Heritage Site in 1987.',
    architecturalSignificance: 'An exceptional example of rock-cut Indian architecture and sculpture. Grand pillars, inner sanctum with Linga, mandapas and richly carved relief panels depict the cosmic dance of Nataraja and Shiva-Parvati wedding.',
    architecturalWonders: [
      'Colossal 7-meter high three-faced Trimurti bust carved out of solid basalt rock',
      'Grand pillared hall carved into the mountain with fluted cushion-capital columns',
      'Massive Dvarapala (guardian deity) sculptures guarding the central Shiva sanctum'
    ],
    audioNarration: 'Arrive at the mystic island of Gharapuri in Mumbai Harbour, home to the Elephanta Caves. Carved into basalt rock in the sixth century, the Great Cave enshrines the monumental three-faced Trimurti of Lord Shiva, illustrating divine creation, preservation, and dissolution.',
    modelPreset: 'rock-cut-caves',
    coordinates: { lat: 18.9633, lng: 72.9315 },
    unescoCriteria: '(i), (iii)'
  },

  // 16. Group of Monuments at Pattadakal (Karnataka) - PDF Page 16
  {
    id: 'pattadakal',
    name: 'Group of Monuments at Pattadakal',
    hindiName: 'पट्टदकल स्मारक समूह',
    location: 'Bagalkot, Karnataka',
    stateId: 'karnataka',
    stateName: 'Karnataka',
    region: 'South',
    yearInscribed: 1987,
    category: 'cultural',
    image: 'https://images.unsplash.com/photo-1569571665379-f952b753ccc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8UGF0dGFkYWthbCUyMEthcm5hdGFrYSUyMHRlbXBsZXN8ZW58MHx8fHwxNzg5MDY4MTIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Constructed under the Badami Chalukya Dynasty during the 7th and 8th centuries CE along the banks of the Malaprabha River. Pattadakal served as the ceremonial royal coronation city (Kisuvolal) of the Chalukyan emperors.',
    coreHighlight: 'Inscribed as a UNESCO World Heritage Site in 1987. Demonstrates a harmonious blend of architectural forms from northern Nagara and southern Dravidian traditions side by side.',
    architecturalSignificance: 'The site features nine Hindu temples and a Jain sanctuary. The Virupaksha Temple, built around 740 CE by Queen Lokamahadevi to commemorate victory over the Pallavas, is the grandest jewel of Chalukyan art.',
    architecturalWonders: [
      'Coexistence of Northern Rekha-Nagara spires and Southern Dravidian vimanas in a single complex',
      'Virupaksha Temple adorned with intricately carved episodes from the Ramayana and Mahabharata',
      'Monolithic sculpted pillars and perforated stone jali windows'
    ],
    audioNarration: 'Welcome to Pattadakal on the banks of the Malaprabha River in Bagalkot, Karnataka. As the royal coronation site of the Badami Chalukyas in the eighth century, Pattadakal achieved a miraculous synthesis of northern Nagara and southern Dravidian temple architecture, headlined by the grand Virupaksha Temple.',
    modelPreset: 'vimana-temple',
    coordinates: { lat: 15.9489, lng: 75.8160 },
    unescoCriteria: '(iii), (iv)'
  },

  // 17. Buddhist Monuments at Sanchi (Madhya Pradesh) - PDF Page 17
  {
    id: 'sanchi-stupa',
    name: 'Buddhist Monuments at Sanchi',
    hindiName: 'सांची के बौद्ध स्तूप',
    location: 'Raisen, Madhya Pradesh',
    stateId: 'madhya-pradesh',
    stateName: 'Madhya Pradesh',
    region: 'Central',
    yearInscribed: 1989,
    category: 'cultural',
    image: 'https://images.unsplash.com/photo-1699988194923-50f944f92d9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8U2FuY2hpJTIwU3R1cGElMjBNYWRoeWElMjBQcmFkZXNofGVufDB8fHx8MTc4OTA2ODEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Established mainly during the Mauryan Dynasty in the 3rd century BCE, when Emperor Ashoka commissioned the first stupa. The complex was later expanded during the Shunga, Satavahana, and Gupta periods.',
    coreHighlight: 'The core highlight is the Great Stupa (Stupa No. 1), one of the oldest and most significant stone stupas in India. Inscribed as a UNESCO World Heritage Site in 1989.',
    architecturalSignificance: 'Renowned for its stupas, monasteries, temples, and four intricately carved gateways (Toranas) depicting scenes from the life of Buddha and Jataka tales, illustrating the evolution of Buddhist art.',
    architecturalWonders: [
      'Massive hemispherical stone dome (anda) crowned by harmika railing and triple parasols (chhatra)',
      'Four monumental Torana stone gateways carved like ivory wood with bracket Yakshinis',
      'Continuous circular stone balustrade walking terrace (Pradakshinapatha)'
    ],
    audioNarration: 'Stand before the Great Stupa of Sanchi in Madhya Pradesh. Commissioned in the third century BCE by Emperor Ashoka over the relics of Gautama Buddha, this hemispherical stone sanctuary is the oldest stone building in India, famous for its four elaborately sculpted ceremonial gateways.',
    modelPreset: 'buddhist-stupa',
    coordinates: { lat: 23.4793, lng: 77.7397 },
    unescoCriteria: '(i), (ii), (iii), (iv), (vi)'
  },

  // 18. Humayun's Tomb (New Delhi) - PDF Page 18
  {
    id: 'humayuns-tomb',
    name: "Humayun's Tomb",
    hindiName: 'हुमायूँ का मक़बरा',
    location: 'Nizamuddin East, New Delhi',
    stateId: 'delhi',
    stateName: 'Delhi',
    region: 'North',
    yearInscribed: 1993,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1697729555861-e406b4989ee1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8SHVtYXl1bnMlMjBUb21iJTIwRGVsaGl8ZW58MHx8fHwxNzg5MDY4MTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Commissioned in 1565 CE by Hamida Banu Begum (Bega Begum), widow of Mughal Emperor Humayun, and completed around 1572 CE during Akbar\'s reign. Designed by Persian architect Mirak Mirza Ghiyas.',
    coreHighlight: 'Magnificent double-domed mausoleum set within a formal Charbagh garden with water channels. Inscribed as a UNESCO World Heritage Site in 1993 for its architectural innovation.',
    architecturalSignificance: 'Celebrated for its harmonious synthesis of Persian and Indian architectural traditions, featuring red sandstone, white marble, arched iwans, and geometric gardens. Its design directly inspired the Taj Mahal.',
    architecturalWonders: [
      'First grand garden-tomb on the Indian subcontinent, introducing the Charbagh quadrilateral layout',
      'Double dome construction: an outer marble bulbous dome and an inner vaulted acoustic ceiling',
      'Extensive use of red sandstone trimmed with inlaid white marble borders'
    ],
    audioNarration: 'Welcome to Humayun\'s Tomb in New Delhi. Completed in 1572 by Persian architect Mirak Mirza Ghiyas for Queen Hamida Banu Begum, this was the first grand dynastic garden-tomb of the Mughals, whose harmonious geometry and double dome served as the direct prototype for the Taj Mahal.',
    modelPreset: 'taj-mausoleum',
    coordinates: { lat: 28.5933, lng: 77.2507 },
    unescoCriteria: '(ii), (iv)'
  },

  // 19. Mahabodhi Temple Complex at Bodh Gaya (Bihar) - PDF Page 19
  {
    id: 'mahabodhi-temple',
    name: 'Mahabodhi Temple Complex at Bodh Gaya',
    hindiName: 'महाबोधि मंदिर, बोधगया',
    location: 'Bodh Gaya, Bihar',
    stateId: 'bihar',
    stateName: 'Bihar',
    region: 'East',
    yearInscribed: 2002,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1691031428291-1db669413fa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8TWFoYWJvZGhpJTIwVGVtcGxlJTIwQm9kaCUyMEdheWF8ZW58MHx8fHwxNzg5MDY4MTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Has origins in the Mauryan period when Emperor Ashoka established a shrine in the 3rd century BCE. The present grand brick temple developed through several phases from the 5th-6th century Gupta period.',
    coreHighlight: 'The holiest shrine in Buddhism, marking the sacred Bodhi Tree under which Prince Siddhartha attained supreme enlightenment. Inscribed as a UNESCO World Heritage Site in 2002.',
    architecturalSignificance: 'A remarkable example of ancient Indian brick architecture, distinguished by its 55-meter tall pyramidal central tower, ornate stone railings, carved niches, and influenced Buddhist temples across Asia.',
    architecturalWonders: [
      '55-meter tall pyramidal grand brick shikhara tower crowned by an amalaka and stupa finial',
      'The sacred Vajrasana (Diamond Throne) established by Emperor Ashoka around 250 BCE',
      'Direct descendant of the original sacred Bodhi Tree (Ficus religiosa) in the courtyard'
    ],
    audioNarration: 'You are visiting the Mahabodhi Temple in Bodh Gaya, Bihar. Marking the exact spot where Siddhartha Gautama attained enlightenment in 531 BCE, this sacred complex features a fifty-five meter pyramidal brick tower and the sacred descendant of the original Bodhi Tree.',
    modelPreset: 'buddhist-stupa',
    coordinates: { lat: 24.6959, lng: 84.9914 },
    unescoCriteria: '(i), (ii), (iii), (iv), (vi)'
  },

  // 20. Champaner-Pavagadh Archaeological Park (Gujarat) - PDF Page 20
  {
    id: 'champaner-pavagadh',
    name: 'Champaner-Pavagadh Archaeological Park',
    hindiName: 'चांपानेर-पावागढ़ पुरातत्व पार्क',
    location: 'Panchmahal district, Gujarat',
    stateId: 'gujarat',
    stateName: 'Gujarat',
    region: 'West',
    yearInscribed: 2004,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1697730332011-11f027c6aa60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Q2hhbXBhbmVyJTIwSmFtaSUyME1hc2ppZHxlbnwwfHx8fDE3ODkwNjgxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Developed over several centuries under the Chaulukya (Solanki) and later Sultanate rulers. In 1484, Sultan Mahmud Begada captured Champaner and developed it as an important fortified capital combining Hindu, Jain, and Islamic traditions.',
    coreHighlight: 'A remarkable unexcavated prehistoric and medieval city spanning Pavagadh hill and Champaner plains with fortifications, palaces, mosques, and stepwells. Inscribed as a UNESCO World Heritage Site in 2004.',
    architecturalSignificance: 'Showcases a unique blend of Hindu, Jain, and Islamic architectural traditions, particularly visible in the Jami Masjid with its intricate stone carvings, minarets, and subterranean water structures.',
    architecturalWonders: [
      'The majestic Jami Masjid with 172 carved stone pillars and delicate floral stonework',
      'Pavagadh Hill fort bastions and ancient Kalika Mata Temple dating to the 10th century',
      'Intricate network of stepped stepwells (Helical Vav) and medieval hydraulic channels'
    ],
    audioNarration: 'Discover Champaner-Pavagadh in Gujarat, inscribed by UNESCO in 2004. Rising from the plains to the volcanic peak of Pavagadh, this site preserves an untouched pre-Mughal Islamic capital, featuring the exquisite Jami Masjid and ancient stepwells showcasing Hindu-Islamic synthesis.',
    modelPreset: 'subterranean-stepwell',
    coordinates: { lat: 22.4833, lng: 73.5333 },
    unescoCriteria: '(iii), (iv), (v), (vi)'
  },

  // 21. Jantar Mantar (Jaipur, Rajasthan) - PDF Page 21
  {
    id: 'jantar-mantar',
    name: 'Jantar Mantar, Jaipur',
    hindiName: 'जंतर मंतर, जयपुर',
    location: 'Jaipur, Rajasthan',
    stateId: 'rajasthan',
    stateName: 'Rajasthan',
    region: 'North',
    yearInscribed: 2010,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1661963054563-ce928e477ff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8SmFudGFyJTIwTWFudGFyJTIwSmFpcHVyfGVufDB8fHx8MTc4OTA2ODEyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Built by astronomer-king Maharaja Sawai Jai Singh II between 1727 and 1734 CE. It was constructed as an open-air astronomical observatory to improve celestial calculations and astronomical tables.',
    coreHighlight: 'Features 19 large-scale architectural astronomical instruments, including the Samrat Yantra, the world\'s largest stone sundial. Inscribed as a UNESCO World Heritage Site in 2010.',
    architecturalSignificance: 'Combines scientific geometry, mathematics, and monumental architecture. The instruments observe celestial coordinates, planetary movements, and measure local solar time to an accuracy of two seconds.',
    architecturalWonders: [
      'Vrihat Samrat Yantra: the 27-meter tall stone gnomon sundial accurate to within two seconds',
      'Jai Prakash Yantra: twin hemispherical subterranean bowl instruments mapping inverted celestial skies',
      'Ram Yantra: dual cylindrical masonry structures used to measure azimuth and altitude of stars'
    ],
    audioNarration: 'Welcome to Jantar Mantar in Jaipur, built in 1734 by Maharaja Sawai Jai Singh II. This open-air stone observatory features nineteen colossal masonry instruments, including the world\'s largest sundial, calculating solar time with an astonishing precision of two seconds.',
    modelPreset: 'konark-wheel',
    coordinates: { lat: 26.9248, lng: 75.8246 },
    unescoCriteria: '(iii), (iv)'
  },

  // 22. Rani-ki-Vav (Gujarat) - PDF Page 22
  {
    id: 'rani-ki-vav',
    name: "Rani-ki-Vav (The Queen's Stepwell)",
    hindiName: 'रानी की वाव',
    location: 'Patan, Gujarat',
    stateId: 'gujarat',
    stateName: 'Gujarat',
    region: 'West',
    yearInscribed: 2014,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1691030924806-85cfca6c80c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8UmFuaSUyMGtpJTIwVmF2JTIwUGF0YW4lMjBzdGVwd2VsbHxlbnwwfHx8fDE3ODkwNjgxMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Built in the 11th century CE (c. 1063 CE) during the Solanki (Chaulukya) Dynasty by Queen Udayamati in memory of her deceased husband King Bhima I. Designed as a grand stepped well for water conservation and spiritual sanctity.',
    coreHighlight: 'A magnificent seven-level subterranean stepped temple structure descending 28 meters below the earth, decorated with more than a thousand intricate sculptures. Inscribed as a UNESCO World Heritage Site in 2014.',
    architecturalSignificance: 'An extraordinary example of Maru-Gurjara architectural style, featuring elaborately carved pillars, subterranean galleries, and panels depicting the ten avatars of Vishnu (Dashavatara).',
    architecturalWonders: [
      'Inverted underground temple concept highlighting the spiritual sanctity of water in arid lands',
      'Over 500 major stone sculptures and 1,000 minor carvings miraculously preserved under silt for 800 years',
      'Seven stepped pavilion levels with geometric cantilevered pillars and subterranean water tank'
    ],
    audioNarration: 'Descend into Rani Ki Vav in Patan, Gujarat. Built in 1063 CE by Queen Udayamati, this is not merely a well, but an inverted temple descending seven storeys into the earth. Silt from the Saraswati River preserved its thousand masterfully carved sculptures of Lord Vishnu for nearly eight centuries.',
    modelPreset: 'subterranean-stepwell',
    coordinates: { lat: 23.8589, lng: 72.1017 },
    unescoCriteria: '(i), (iv)'
  },

  // 23. Nalanda Mahavihara (Bihar) - PDF Page 23
  {
    id: 'nalanda-mahavihara',
    name: 'Archaeological Site of Nalanda Mahavihara',
    hindiName: 'नालंदा महाविहार',
    location: 'Nalanda, Bihar',
    stateId: 'bihar',
    stateName: 'Bihar',
    region: 'East',
    yearInscribed: 2016,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1661962350092-b8c57c9974bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8TmFsYW5kYSUyMFVuaXZlcnNpdHklMjBydWluc3xlbnwwfHx8fDE3ODkwNjgxMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Flourished as one of ancient India\'s greatest centres of Buddhist learning and higher education, beginning in the 5th century CE under Kumaragupta I of the Gupta Dynasty, continuing until the 12th century under the Palas.',
    coreHighlight: 'A vast monastic university complex that attracted over 10,000 students and 2,000 teachers from across China, Korea, Japan, Tibet, and Central Asia. Inscribed as a UNESCO World Heritage Site in 2016.',
    architecturalSignificance: 'Notable for its distinctive brick architecture, carefully planned residential monasteries, monumental stupas, and lecture halls demonstrating ancient academic campus planning.',
    architecturalWonders: [
      'Sariputta Stupa No. 3 with seven successive concentric brick rebuildings',
      'Modular student residential cells (viharas) with individual meditation beds and lecture courtyards',
      'Advanced drainage, wells, and communal dining halls functioning 1,500 years ago'
    ],
    audioNarration: 'Walk the sacred brick ruins of Nalanda Mahavihara in Bihar. Founded in the fifth century CE, Nalanda was the ancient world\'s greatest residential university, where ten thousand scholars from across Asia gathered to study philosophy, mathematics, logic, and medicine.',
    modelPreset: 'buddhist-stupa',
    coordinates: { lat: 25.1367, lng: 85.4439 },
    unescoCriteria: '(iv), (vi)'
  },

  // 24. Historic City of Ahmedabad (Gujarat) - PDF Page 24
  {
    id: 'ahmedabad-city',
    name: 'Historic City of Ahmadabad',
    hindiName: 'अहमदाबाद का ऐतिहासिक शहर',
    location: 'Ahmadabad, Gujarat',
    stateId: 'gujarat',
    stateName: 'Gujarat',
    region: 'West',
    yearInscribed: 2017,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1676285069077-65a39ed9acf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8U2lkaSUyMFNhaXl5ZWQlMjBNb3NxdWUlMjBBaG1lZGFiYWR8ZW58MHx8fHwxNzg5MDY4MTI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Founded in 1411 CE by Sultan Ahmad Shah I of the Muzaffarid (Gujarat Sultanate) Dynasty on the banks of the Sabarmati River. The city grew into a premier trade and textile manufacturing hub.',
    coreHighlight: 'The core highlight is its historic walled city and traditional community pols, featuring densely packed houses, gateways, mosques, and carved wooden architecture. India\'s first UNESCO World Heritage City, inscribed in 2017.',
    architecturalSignificance: 'Showcases a remarkable fusion of Hindu, Jain, and Islamic architectural traditions, visible in its carved wooden havelis, Bhadra Fort, and the intricate marble jali of Sidi Saiyyed Mosque.',
    architecturalWonders: [
      'The intricate stone lattice "Tree of Life" window of the Sidi Saiyyed Mosque',
      'Over 600 traditional gated residential neighborhoods (Pols) with self-cooling micro-climates',
      'Bhadra Fort, Teen Darwaza, and Jama Masjid demonstrating Gujarat Sultanate architecture'
    ],
    audioNarration: 'Welcome to Ahmedabad, India\'s first UNESCO World Heritage City, founded in 1411 by Sultan Ahmad Shah. Walk through the historic walled city\'s labyrinthine pols, admiring five-hundred-year-old carved wooden havelis and the breathtaking Tree of Life stone screen of Sidi Saiyyed Mosque.',
    modelPreset: 'fort-bastions',
    coordinates: { lat: 23.0225, lng: 72.5714 },
    unescoCriteria: '(ii), (v)'
  },

  // 25. Victorian Gothic and Art Deco Ensembles of Mumbai (Maharashtra) - PDF Page 25
  {
    id: 'mumbai-ensembles',
    name: 'Victorian Gothic and Art Deco Ensembles of Mumbai',
    hindiName: 'मुंबई के विक्टोरियन गोथिक व आर्ट डेको समूह',
    location: 'Fort & Marine Drive, Mumbai, Maharashtra',
    stateId: 'maharashtra',
    stateName: 'Maharashtra',
    region: 'West',
    yearInscribed: 2018,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1680328655580-6429f1107deb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8UmFqYWJhaSUyMENsb2NrJTIwVG93ZXIlMjBNdW1iYWl8ZW58MHx8fHwxNzg5MDY4MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Developed during the 19th and 20th centuries, reflecting Mumbai\'s transformation into a major global port. Victorian Gothic structures were built during the late 19th century, while Art Deco buildings emerged along the Arabian Sea in the 1930s.',
    coreHighlight: 'A unique urban ensemble where Victorian Gothic public monuments face the second largest collection of Art Deco residential buildings in the world across the Oval Maidan. Inscribed in 2018.',
    architecturalSignificance: 'Blends Victorian Gothic Revival (pointed arches, gargoyles, stained glass) adapted with Indian verandas, alongside streamlined Art Deco geometry, nautical motifs, and ziggurats on Marine Drive.',
    architecturalWonders: [
      'Bombay High Court, University Rajabai Clock Tower, and Secretariat facing Oval Maidan',
      'World\'s second-largest concentration of 1930s Art Deco apartment blocks along Marine Drive promenade',
      'Unique Indo-Gothic syncretism featuring Indian fauna, monsoon eaves, and local Kurla stone'
    ],
    audioNarration: 'Explore Mumbai\'s Victorian Gothic and Art Deco Ensembles, inscribed by UNESCO in 2018. Across the lush Oval Maidan, nineteenth-century Victorian spires and the Rajabai clock tower face the world\'s second-largest collection of sun-drenched 1930s Art Deco oceanfront architecture.',
    modelPreset: 'taj-mausoleum',
    coordinates: { lat: 18.9298, lng: 72.8301 },
    unescoCriteria: '(ii), (iv)'
  },

  // 26. Jaipur City (Rajasthan) - PDF Page 26
  {
    id: 'jaipur-city',
    name: 'Jaipur City, Rajasthan',
    hindiName: 'जयपुर शहर (गुलाबी नगरी)',
    location: 'Jaipur, Rajasthan',
    stateId: 'rajasthan',
    stateName: 'Rajasthan',
    region: 'North',
    yearInscribed: 2019,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1661901647310-4deafc6f29a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8SGF3YSUyME1haGFsJTIwSmFpcHVyfGVufDB8fHx8MTc4OTA2ODEzMXww&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'The Walled City of Jaipur was founded in 1727 CE by astronomer-king Maharaja Sawai Jai Singh II. Designed as the new capital of Amber, it was planned according to principles of Vastu Shastra and ancient Indian town planning by architect Vidyadhar Bhattacharya.',
    coreHighlight: 'Famous for its grid-based streets, organized bazaars, historic city gates, and distinctive terracotta-pink facades. The entire Walled City was inscribed as a UNESCO World Heritage Site in 2019.',
    architecturalSignificance: 'Combines Rajput, Mughal, and ancient Hindu architectural traditions. Its symmetrical nine-square grid plan, City Palace, Hawa Mahal (Palace of Winds), and continuous colonnaded bazaars demonstrate 18th-century planned urbanism.',
    architecturalWonders: [
      'Hawa Mahal: five-storey honeycomb pyramid facade with 953 jharokha casement windows',
      'Prastara nine-block urban grid layout based on the cosmic mandala and Vastu Shastra',
      'Uniform terracotta pink wash ordered in 1876 by Maharaja Sawai Ram Singh to welcome the Prince of Wales'
    ],
    audioNarration: 'Welcome to the Pink City of Jaipur, inscribed as a UNESCO World Heritage City in 2019. Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur was planned with strict Vedic grid geometry, featuring the iconic honeycomb facade of Hawa Mahal and vibrant bazaars.',
    modelPreset: 'fort-bastions',
    coordinates: { lat: 26.9124, lng: 75.7873 },
    unescoCriteria: '(ii), (iv), (vi)'
  },

  // 27. Dholavira: a Harappan City (Gujarat) - PDF Page 27
  {
    id: 'dholavira',
    name: 'Dholavira: A Harappan City',
    hindiName: 'धोलावीरा: हड़प्पा कालीन नगर',
    location: "Khadir Bet, Rann of Kutch, Gujarat",
    stateId: 'gujarat',
    stateName: 'Gujarat',
    region: 'West',
    yearInscribed: 2021,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1718570264909-cb7e7322106d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8RGhvbGF2aXJhJTIwS3V0Y2glMjBIYXJhcHBhbnxlbnwwfHx8fDE3ODkwNjgxMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Dholavira was one of the major commercial metropolises of the Harappan (Indus Valley) Civilization, flourishing mainly between 3000 and 1500 BCE, with its peak around 2600–1900 BCE on the island of Khadir Bet.',
    coreHighlight: 'The core highlight is its remarkably advanced hydraulic water management and urban planning system with cascading reservoirs, drainage channels, and fortified stone citadel. Inscribed in 2021.',
    architecturalSignificance: 'Demonstrates sophisticated Bronze Age civil engineering. Tripartite city planning (Citadel, Middle Town, Lower Town) built of dressed sandstone and mud-brick with underground inspection drains.',
    architecturalWonders: [
      '16 massive rock-cut water reservoirs with capacity exceeding 300,000 cubic meters of rainwater',
      'Famous 10-character Indus script wooden signboard found near the northern citadel gateway',
      'Tripartite urban layout with ceremonial stadium, stone ramparts, and sophisticated storm sewers'
    ],
    audioNarration: 'Travel 4,500 years back in time at Dholavira in the Rann of Kutch, Gujarat. Inscribed by UNESCO in 2021, this Indus Valley metropolis reveals ancient urban engineering at its peak, featuring gigantic stone-cut water reservoirs and underground drainage that enabled life in the desert.',
    modelPreset: 'subterranean-stepwell',
    coordinates: { lat: 23.8864, lng: 70.2131 },
    unescoCriteria: '(iii), (iv)'
  },

  // 28. Kakatiya Rudreshwara (Ramappa) Temple (Telangana) - PDF Page 28
  {
    id: 'ramappa-temple',
    name: 'Kakatiya Rudreshwara (Ramappa) Temple',
    hindiName: 'रामप्पा मंदिर, तेलंगाना',
    location: 'Palampet, Mulugu / Warangal, Telangana',
    stateId: 'telangana',
    stateName: 'Telangana',
    region: 'South',
    yearInscribed: 2021,
    category: 'cultural',
    image: 'https://images.unsplash.com/photo-1707832902491-42b6d033075b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8UmFtYXBwYSUyMFRlbXBsZSUyMFRlbGFuZ2FuYXxlbnwwfHx8fDE3ODkwNjgxMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Built in 1213 CE during the reign of Kakatiya King Ganapati Deva under the master craftsmanship of the royal architect Ramappa, after whom the temple is uniquely named. Dedicated to Lord Shiva (Rudreshwara).',
    coreHighlight: 'Renowned for its beautifully carved black basalt sculptures, star-shaped plinth, and distinctive lightweight floating brick superstructure. Inscribed as a UNESCO World Heritage Site in 2021.',
    architecturalSignificance: 'An outstanding masterpiece of Kakatiya architecture with intricately sculpted pillars, dancers, and musicians. Its spongy floating bricks and sandbox foundation technology shielded the temple from major earthquakes.',
    architecturalWonders: [
      'Spongy lightweight porous bricks that literally float on water used for the temple shikhara spire',
      'Sandbox earthquake-resistant foundation engineering that absorbs seismic shockwaves',
      'Twelve lustrous carved black basalt bracket figures (Madanikas) with jewel-like polish'
    ],
    audioNarration: 'Welcome to the Kakatiya Rudreshwara Temple in Palampet, Telangana, popularly known by the name of its chief architect, Ramappa. Inscribed in 2021, this 800-year-old sanctuary is famous for its earthquake-absorbing sandbox foundation, dancing bracket sculptures, and floating brick roof.',
    modelPreset: 'vimana-temple',
    coordinates: { lat: 18.2604, lng: 79.9431 },
    unescoCriteria: '(i), (iii)'
  },

  // 29. Santiniketan (West Bengal) - PDF Page 29
  {
    id: 'santiniketan',
    name: 'Santiniketan',
    hindiName: 'शांतिनिकेतन, पश्चिम बंगाल',
    location: 'Birbhum district, West Bengal',
    stateId: 'west-bengal',
    stateName: 'West Bengal',
    region: 'East',
    yearInscribed: 2023,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1697729435209-97772693b7da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8U2FudGluaWtldGFuJTIwUmFiaW5kcmFuYXRofGVufDB8fHx8MTc4OTA2ODEzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Established in 1863 by Maharshi Debendranath Tagore as an ashram, and later transformed into a global educational and cultural university by his Nobel laureate son, Rabindranath Tagore, who established Visva-Bharati in 1921.',
    coreHighlight: 'A unique open-air learning environment inspired by Tagore’s vision of education in harmony with nature and intercultural dialogue. Inscribed as a UNESCO World Heritage Site in 2023.',
    architecturalSignificance: 'Represents a distinctive blend of Indian architectural traditions, modern educational philosophy, and Asian art. Features open-air mango grove classrooms, mud and terracotta pavilions, and murals by Nandalal Bose.',
    architecturalWonders: [
      'Upasana Griha (Prayer Hall): an exquisite glass house constructed with Belgian stained-glass panels',
      'Uttarayan Complex: five residences of Tagore showcasing mud, wood, and Bengal rural architecture',
      'Open-air learning spaces under banyan and mango groves rejecting colonial educational barriers'
    ],
    audioNarration: 'Step into the tranquil groves of Santiniketan in West Bengal. Inscribed as a UNESCO World Heritage Site in 2023, this was the utopian vision of Nobel laureate Rabindranath Tagore, where education flourishes in the open air, uniting Indian heritage with universal humanism.',
    modelPreset: 'taj-mausoleum',
    coordinates: { lat: 23.6800, lng: 87.6900 },
    unescoCriteria: '(iv), (vi)'
  },

  // 30. Sacred Ensembles of the Hoysalas (Karnataka) - PDF Page 30
  {
    id: 'hoysala-temples',
    name: 'Sacred Ensembles of the Hoysalas',
    hindiName: 'होयसल पवित्र समूह',
    location: 'Belur, Halebidu and Somanathapura, Karnataka',
    stateId: 'karnataka',
    stateName: 'Karnataka',
    region: 'South',
    yearInscribed: 2023,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1697729536647-4e23a32dd324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8QmVsdXIlMjBDaGVubmFrZXNoYXZhJTIwVGVtcGxlfGVufDB8fHx8MTc4OTA2ODEzNHww&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Built during the Hoysala Dynasty between the 11th and 14th centuries CE, reaching their artistic peak in the 12th–13th centuries. The temples at Belur, Halebidu, and Somanathapura were commissioned by Hoysala monarchs and commanders.',
    coreHighlight: 'Celebrated for their exceptionally detailed soapstone chloritic schist carvings depicting deities, celestial dancers, animals, and epics with jewel-like precision. Inscribed by UNESCO in 2023.',
    architecturalSignificance: 'Famous for stellate (star-shaped) raised platforms, lathe-turned polished stone pillars, and horizontal carved friezes containing thousands of unique elephants, lions, and scrollwork.',
    architecturalWonders: [
      'Stellate (star-shaped) plinths with rows of continuous sculpted friezes without a single duplicate motif',
      'Lathe-turned mirror-finish granite and soapstone columns inside the Chennakeshava Temple',
      'Madanika bracket figures with perforated stone lace, rotating bangles, and microscopic beadwork'
    ],
    audioNarration: 'Discover the Sacred Ensembles of the Hoysalas at Belur, Halebidu, and Somanathapura in Karnataka. Inscribed in 2023, these twelfth-century star-shaped shrines are carved from soft green soapstone with astronomical detail, representing the absolute pinnacle of medieval Indian sculptured art.',
    modelPreset: 'vimana-temple',
    coordinates: { lat: 13.1625, lng: 75.8596 },
    unescoCriteria: '(i), (ii), (iv)'
  },

  // 31. Charaideo Maidam (Assam) - PDF Page 31
  {
    id: 'charaideo-maidam',
    name: 'Moidams – the Mound-Burial System of the Ahom Dynasty',
    hindiName: 'चराइदेव मैदाम, असम',
    location: 'Bokopukhuri Habi, Charaideo district, Assam',
    stateId: 'assam',
    stateName: 'Assam',
    region: 'Northeast',
    yearInscribed: 2024,
    category: 'cultural',
    image: 'https://images.unsplash.com/photo-1704803269187-d6eb334ea5fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8QXNzYW0lMjBncmVlbiUyMGhpbGxzfGVufDB8fHx8MTc4OTA2ODEzNXww&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Created by the Ahom Dynasty from the 13th to 18th centuries CE as royal burial tumuli for Ahom kings and queens. Charaideo, established in 1253 CE by Chaolung Sukaphaa, was the sacred first capital and spiritual heart of the Ahom rulers.',
    coreHighlight: 'The collection of royal vaulted burial mounds reflecting the unique funerary traditions and Tai-Ahom spiritual cosmological beliefs. Inscribed as a UNESCO World Heritage Site in 2024 ("The Pyramids of Assam").',
    architecturalSignificance: 'Earthen hemispherical mounds constructed over brick and stone subterranean burial chambers (Garva), surrounded by octagonal boundary walls and pavilion shrines, showcasing 600 years of indigenous Assamese civil engineering.',
    architecturalWonders: [
      'Subterranean vaulted burial vaults covered with enormous hemispherical earth mounds covered in turf',
      'Octagonal boundary walls and Chow Chali ceremonial pavilions atop the mound summits',
      'Preserves the unbroken Tai-Ahom ancestral soul-worship rituals spanning six centuries'
    ],
    audioNarration: 'Welcome to Charaideo Maidam in Assam, inscribed by UNESCO in 2024. Founded in 1253 by Chaolung Sukaphaa, Charaideo was the spiritual capital of the Ahom Dynasty. Often called the Pyramids of Assam, these ninety royal burial tumuli house underground vaulted chambers beneath lush green earth mounds.',
    modelPreset: 'buddhist-stupa',
    coordinates: { lat: 26.9400, lng: 94.8700 },
    unescoCriteria: '(iii), (iv)'
  },

  // 32. Maratha Military Landscapes of India (Maharashtra) - PDF Page 32
  {
    id: 'maratha-military-landscapes',
    name: 'Maratha Military Landscapes of India',
    hindiName: 'मराठा सैन्य परिदृश्य, महाराष्ट्र',
    location: 'Western Ghats, Konkan Coast & Deccan Plateau, Maharashtra',
    stateId: 'maharashtra',
    stateName: 'Maharashtra',
    region: 'West',
    yearInscribed: 2025,
    category: 'cultural',
    image: 'https://plus.unsplash.com/premium_photo-1697729790981-cdf4d9b7a6cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8UmFpZ2FkJTIwRm9ydCUyME1haGFyYXNodHJhfGVufDB8fHx8MTc4OTA2ODEzNnww&ixlib=rb-4.1.0&q=80&w=1080',
    history: 'Developed between the 17th and 19th centuries CE under the Maratha Empire, visionary founder Chhatrapati Shivaji Maharaj and his successors strategically constructed and adapted hill, plateau, and island sea forts across the rugged Sahyadri mountains.',
    coreHighlight: 'Network of 12 strategically formidable forts—including Raigad (royal capital), Pratapgad, Panhala, Shivneri (birthplace), and Sindhudurg (island sea fortress)—illustrating brilliant terrain integration and guerrilla defensive strategy.',
    architecturalSignificance: 'Showcases sophisticated military architecture adapted to mountain precipices, plateaus, and ocean waves. Massive stone curtain walls, bastions, rock-cut cisterns, and hidden sally ports integrate seamlessly with natural cliffs.',
    architecturalWonders: [
      'Raigad Fort: the hilltop Gibraltar of the East rising 820 meters with the majestic Maha Darwaza',
      'Sindhudurg Sea Fort: constructed directly upon coastal ocean rocks with molten lead foundation joinery',
      'Advanced rainwater harvesting systems supporting thousands of soldiers during prolonged mountain sieges'
    ],
    audioNarration: 'Ascend the rugged Sahyadri peaks of Maharashtra to explore the Maratha Military Landscapes of India. Established in the seventeenth century by Chhatrapati Shivaji Maharaj, this network of twelve forts—from the capital at Raigad to the sea fortress of Sindhudurg—represents one of the most brilliant examples of terrain-adapted defensive architecture in military history.',
    modelPreset: 'fort-bastions',
    coordinates: { lat: 18.2346, lng: 73.4418 },
    unescoCriteria: '(iv), (vi)'
  }
];
