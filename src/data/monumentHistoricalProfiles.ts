export interface HistoricalChronicleEvent {
  yearOrEra: string;
  title: string;
  narrative: string;
}

export interface TravelerAccount {
  traveler: string;
  period: string;
  origin: string;
  quote: string;
}

export interface MonumentHistoricalProfile {
  id: string;
  dynastyAndEra: string;
  rulingMonarchs: string[];
  centuryPeriod: string;
  comprehensiveHistory: string;
  chronologyTimeline: HistoricalChronicleEvent[];
  engineeringSecrets: string[];
  sacredLoreAndLegends: string;
  archaeologicalExcavationLore: string;
  travelerAccounts?: TravelerAccount[];
}

export const monumentHistoricalProfiles: Record<string, MonumentHistoricalProfile> = {
  'hampi': {
    id: 'hampi',
    dynastyAndEra: 'Vijayanagara Empire (Sangama, Saluva, Tuluva & Aravidu Dynasties)',
    rulingMonarchs: ['Harihara I (1336–1356)', 'Bukka Raya I (1356–1377)', 'Deva Raya II (1424–1446)', 'Krishnadevaraya (1509–1529)', 'Achyuta Deva Raya (1529–1542)'],
    centuryPeriod: '14th to 16th Century CE (Founded 1336 CE)',
    comprehensiveHistory: 'Hampi, situated along the southern banks of the Tungabhadra River, was the royal capital of the Vijayanagara Empire—one of the greatest Hindu empires in Indian history. Founded in 1336 CE by two warrior brothers, Harihara I and Bukka Raya I, under the spiritual guidance of sage Vidyaranya of the Sringeri Sharada Peetham, Hampi was chosen for its formidable natural defense: a landscape of dramatic granite boulder hills and swift river rapids. In ancient mythological geography, this region was Kishkindha, the monkey kingdom described in the Ramayana where Lord Rama met Hanuman and Sugriva. Under Emperor Krishnadevaraya (1509–1529 CE), the city reached the zenith of global wealth and military prowess. Covering over 41 square kilometers with concentric rings of fortifications, Hampi was home to approximately 500,000 residents, rivaling Renaissance Rome in scale and magnificence. In January 1565 CE, a confederacy of the Deccan Sultanates (Bijapur, Golconda, Ahmadnagar, and Bidar) defeated the Vijayanagara army at the Battle of Talikota. The victorious forces ransacked the city over six months, toppling shrines and setting fires. However, the monolithic stone structures and grand temple complexes endured, standing today as an extraordinary open-air museum.',
    chronologyTimeline: [
      { yearOrEra: '1336 CE', title: 'Empire Founded', narrative: 'Brothers Harihara and Bukka establish the Vijayanagara capital with sage Vidyaranya’s blessings.' },
      { yearOrEra: '1440 CE', title: 'Persian Ambassador Visit', narrative: 'Abdur Razzaq visits Hampi and declares it among the most splendid cities he has witnessed on earth.' },
      { yearOrEra: '1509–1529 CE', title: 'Imperial Golden Age', narrative: 'Krishnadevaraya expands the empire, builds the Vittala Temple Stone Chariot, and patronizes literature and Carnatic arts.' },
      { yearOrEra: '1565 CE', title: 'Battle of Talikota', narrative: 'The imperial capital is sacked following military defeat; royal court retreats south to Penukonda.' },
      { yearOrEra: '1986 CE', title: 'UNESCO Inscription', narrative: 'Recognized as a UNESCO World Heritage Site; major ongoing ASI excavations continue to reveal royal stepwells.' }
    ],
    engineeringSecrets: [
      'Acoustic Resonance: The 56 musical pillars of Vittala Temple were carved from solid granite blocks and tuned to emit the sapta-swaras (seven musical notes) when struck lightly by thumb.',
      'Hydraulic Aqueducts: Granite channel network spanning kilometers distributed water from the Tungabhadra River into the Royal Stepped Tank (Pushkarani) using gravitational siphon principles.',
      'Interlocking Pinhole Projection: The inner sanctum of Virupaksha Temple features an inverted pinhole camera aperture that casts an inverted shadow of the 50-meter eastern gopuram on the western wall.'
    ],
    sacredLoreAndLegends: 'According to the Sthala Purana, Goddess Pampa (daughter of Lord Brahma) performed intense penance on Hemakuta Hill to win the hand of Lord Shiva (Virupaksha). Shiva granted her boon, and their divine wedding is commemorated annually during the Phala Puja festival.',
    archaeologicalExcavationLore: 'Colin Mackenzie, the first Surveyor General of India, carried out the earliest systematic survey of Hampi in 1800. Extensive ASI excavations starting in 1976 uncovered buried stepwells, gold jewelry hoards, and subterranean mints.',
    travelerAccounts: [
      { traveler: 'Domingo Paes', period: '1520 CE', origin: 'Portugal', quote: 'The size of this city I do not write here, because it cannot all be seen from any one spot, but it is as large as Rome and very beautiful to the sight; there are many groves of trees, orchards and lakes of water.' },
      { traveler: 'Abdur Razzaq', period: '1443 CE', origin: 'Samarkand / Persia', quote: 'The city of Bidjanagar is such that the eye has not seen nor the ear heard of any place to equal it on the earth.' }
    ]
  },
  'konark-sun-temple': {
    id: 'konark-sun-temple',
    dynastyAndEra: 'Eastern Ganga Dynasty (13th Century CE)',
    rulingMonarchs: ['King Langula Narasimhadeva I (1238–1264 CE)'],
    centuryPeriod: 'c. 1250 CE',
    comprehensiveHistory: 'The Konark Sun Temple, known poetically as Arkakshetra, was constructed in the mid-13th century (c. 1250 CE) by King Narasimhadeva I of the Eastern Ganga Dynasty. Built along the shoreline of the Bay of Bengal where the sacred Chandrabhaga River met the ocean, the temple commemorated the king’s military victories against the Tughral Tughan Khan forces of the Delhi Sultanate in southern Bengal. Conceiving the monument as a monumental terrestrial representation of the cosmic chariot of Surya, the Sun God, 1,200 master sculptors and masons laboured for twelve years under the leadership of chief architect Bisu Maharana. The temple rested on 24 gigantic carved stone wheels, each nearly 3 meters in diameter, pulled by seven galloping stone horses. In coastal lore, European sailors navigating the Bay of Bengal christened it the "Black Pagoda" because its towering 70-meter main deula sanctuary served as a dark navigation landmark, in contrast to the whitewashed "White Pagoda" (Jagannath Temple) at Puri.',
    chronologyTimeline: [
      { yearOrEra: '1238 CE', title: 'Accession of Narasimhadeva I', narrative: 'King launches military campaigns to secure the northern Ganga frontiers.' },
      { yearOrEra: 'c. 1250 CE', title: 'Consecration of Sun Temple', narrative: 'After twelve years of sculpting, the celestial chariot of Surya is consecrated.' },
      { yearOrEra: '1568 CE', title: 'Kalapahad Raid', narrative: 'General Kalapahad invades Odisha, leading to abandonment of rituals and partial temple damage.' },
      { yearOrEra: '1901–1906 CE', title: 'Sand Conservation Project', narrative: 'British engineers under Sir John Woodburn fill the assembly hall (Jagamohana) with sand and masonry to prevent collapse.' },
      { yearOrEra: '1984 CE', title: 'World Heritage Inscription', narrative: 'UNESCO inscribes Konark as a Masterpiece of Creative Human Genius.' }
    ],
    engineeringSecrets: [
      'Precision Sundial Science: Each of the 24 chariot wheels functions as an accurate sundial. The central axle hub casts a shadow on eight major spokes (three-hour intervals) and eight minor spokes (45-minute intervals), measuring time down to minutes.',
      'Magnetic Load-Bearing Myth: Folk traditions and Portuguese records claim a heavy lodestone (magnetic iron ore) capstone sat atop the sanctuary, keeping iron-clamped statues suspended until maritime navigators removed it.',
      'Mortarless Stone Joinery: Constructed using horizontal iron tie-beams and mortise-and-tenon interlocking dowels between colossal blocks of Khondalite and Chlorite stones.'
    ],
    sacredLoreAndLegends: 'Legend recounts that Samba, son of Lord Krishna, was afflicted with leprosy due to a curse. Following twelve years of severe penance on the Chandrabhaga beach, Surya cured his affliction. In gratitude, Samba erected the first shrine dedicated to the Sun God on this sacred spot.',
    archaeologicalExcavationLore: 'Excavated from deep coastal shifting sand dunes between 1901 and 1939 by the Archaeological Survey of India, revealing the lower plinths, galloping horses, and elephant friezes in pristine detail.',
    travelerAccounts: [
      { traveler: 'Abul Fazl (Akbarnama)', period: 'c. 1590 CE', origin: 'Mughal Empire', quote: 'Even those whose judgment is critical and who are difficult to please stand astonished at its sight.' }
    ]
  },
  'qutub-minar': {
    id: 'qutub-minar',
    dynastyAndEra: 'Delhi Sultanate (Mamluk, Khalji & Tughlaq Dynasties)',
    rulingMonarchs: ['Qutb-ud-din Aibak (1199–1210)', 'Shams-ud-din Iltutmish (1210–1236)', 'Alauddin Khalji (1296–1316)', 'Firoz Shah Tughlaq (1351–1388)'],
    centuryPeriod: '12th to 14th Century CE (Commenced 1199 CE)',
    comprehensiveHistory: 'The Qutub Minar was commenced in 1199 CE by Qutb-ud-din Aibak, the Turkic general who founded the Mamluk (Slave) Dynasty and established the Delhi Sultanate. Designed as an imperial victory tower and a minaret for the adjacent Quwwat-ul-Islam Mosque, Aibak completed only the first storey before his death in 1210 CE. His son-in-law and successor, Shams-ud-din Iltutmish, added three more tapering storeys in red sandstone by 1220 CE. When lightning struck the upper section in 1368 CE, Sultan Firoz Shah Tughlaq rebuilt the top storey and split it into two distinct levels faced with white Makrana marble and red sandstone, raising the minaret to 72.5 meters. In 1311 CE, Sultan Alauddin Khalji added the monumental Alai Darwaza, the first structure in India built with true arches and geometric stone latticework. The complex is also home to the enigmatic 1,600-year-old Gupta Iron Pillar, cast during the reign of King Chandragupta II Vikramaditya (c. 375–415 CE), which has remained uncorroded through centuries of monsoons due to a protective passive iron-hydrogen-phosphate film.',
    chronologyTimeline: [
      { yearOrEra: 'c. 400 CE', title: 'Gupta Iron Pillar Cast', narrative: 'King Chandra erects the rust-resistant iron pillar at Vishnupadagiri before relocation to Delhi.' },
      { yearOrEra: '1199 CE', title: 'Tower Foundation', narrative: 'Qutb-ud-din Aibak lays the foundation of the victory tower.' },
      { yearOrEra: '1220 CE', title: 'Iltutmish Superstructure', narrative: 'Three storeys added; minaret reaches 65 meters.' },
      { yearOrEra: '1368 CE', title: 'Tughlaq Restoration', narrative: 'Firoz Shah Tughlaq repairs lightning damage with two white-marble storeys.' },
      { yearOrEra: '1993 CE', title: 'UNESCO Inscription', narrative: 'Inscribed as a masterpiece of early Indo-Islamic architectural engineering.' }
    ],
    engineeringSecrets: [
      'Alternating Fluting: The first storey features alternating angular and semi-circular flutings, the second is purely rounded, and the third is exclusively angular, creating dynamic optical illusions from ground view.',
      'Cantilevered Stalactite Brackets: Each projecting balcony is supported by miniature clusters of honeycomb-like corbel brackets (muqarnas) carved from red sandstone.',
      'Anti-Rust Metallurgical Matrix: The 6-tonne Iron Pillar contains 99.72% pure wrought iron with a high phosphorus content and low sulphur, which formed an amorphous protective misawite layer.'
    ],
    sacredLoreAndLegends: 'According to Delhi folklore, if a person stands with their back to the Gupta Iron Pillar and can wrap their arms around it so that their fingers touch, their heartfelt wish will be granted by the deities.',
    archaeologicalExcavationLore: 'Systematically surveyed by British archaeologist Sir Alexander Cunningham in 1862, followed by extensive stone restoration by the ASI.',
    travelerAccounts: [
      { traveler: 'Ibn Battuta', period: '1334 CE', origin: 'Morocco', quote: 'The minaret has no equal in the world for its height and its stone masonry. Its staircase is so wide that elephants could easily ascend it.' }
    ]
  },
  'red-fort': {
    id: 'red-fort',
    dynastyAndEra: 'Mughal Empire (Emperor Shah Jahan, 1639–1648 CE)',
    rulingMonarchs: ['Shah Jahan (1628–1658)', 'Aurangzeb (1658–1707)', 'Bahadur Shah Zafar (1837–1857)'],
    centuryPeriod: '17th Century CE',
    comprehensiveHistory: 'The Red Fort (Qila-i-Mubarak or Lal Qila) was commissioned in 1639 CE by the fifth Mughal Emperor Shah Jahan when he decided to shift the imperial capital from Agra to Delhi, founding the walled metropolis of Shahjahanabad. Designed by chief royal architects Ustad Ahmad Lahori and Ustad Hamid, construction commenced on the auspicious day of Muharram in 1639 and was completed in 1648 CE. Enclosed within 2.4 kilometers of massive octagonal red sandstone curtain walls soaring up to 33 meters, the fortress served as the ceremonial residence of Mughal emperors for nearly two centuries. At its heart lay the Diwan-i-Aam (Hall of Public Audience) with its carved marble baldachin and the Diwan-i-Khas (Hall of Private Audience), bearing the famous Persian couplet of Amir Khusrau: "Agar firdaus bar roo-e zameen ast, hamin ast-o hamin ast-o hamin ast" ("If there be a paradise on earth, it is this, it is this, it is this"). The fort witnessed tumultuous historical events: the 1739 invasion of Nadir Shah who carried off the Koh-i-Noor diamond and the Peacock Throne; the 1857 First War of Independence where sepoy mutineers crowned the aging Bahadur Shah Zafar as Emperor of Hindustan; and the British military takeover. On August 16, 1947, independent India\'s first Prime Minister Jawaharlal Nehru unfurled the tricolor flag from the Lahore Gate, initiating an enduring symbol of Indian sovereignty.',
    chronologyTimeline: [
      { yearOrEra: '1639 CE', title: 'Foundation Stone', narrative: 'Shah Jahan initiates construction along the banks of the Yamuna.' },
      { yearOrEra: '1648 CE', title: 'Imperial Inauguration', narrative: 'Court enters Shahjahanabad; rose water flows through Nahr-i-Behisht.' },
      { yearOrEra: '1739 CE', title: 'Nadir Shah Sacking', narrative: 'Persian army occupies fort; Peacock Throne plundered.' },
      { yearOrEra: '1857 CE', title: 'First War of Independence', narrative: 'Fort becomes rebel command center; British exile Bahadur Shah Zafar.' },
      { yearOrEra: '1947 CE', title: 'Tricolor Hoisted', narrative: 'Nehru hoists independent India\'s national flag at Lahore Gate.' },
      { yearOrEra: '2007 CE', title: 'UNESCO Inscription', narrative: 'Inscribed as a World Heritage Site for its synthesis of Persian, Timurid, and Indian styles.' }
    ],
    engineeringSecrets: [
      'Nahr-i-Behisht Passive Cooling: A central water canal fed by the Yamuna River flowed through the marble floor channels of imperial pavilions, utilizing evaporative cooling to drop room temperatures by 6-8°C during scorching Delhi summers.',
      'Defensive Barbican Gates: Aurangzeb constructed protective semi-circular outer barbicans around the Lahore and Delhi Gates, forcing attackers to approach at vulnerable right angles.',
      'Parchin Kari Gemstone Intarsia: The Diwan-i-Khas plinths feature floral pietra dura inlays made of lapis lazuli from Afghanistan, carnelian from Gujarat, and onyx from Central Asia.'
    ],
    sacredLoreAndLegends: 'Historical chronicles state that when the Peacock Throne was installed in 1635, it was encrusted with 116 emeralds, 108 rubies, and hundreds of pearls, taking seven years and more than a ton of pure gold to fabricate.',
    archaeologicalExcavationLore: 'Transferred by the Indian Ministry of Defence to the Archaeological Survey of India (ASI) in December 2003 for scientific conservation and removal of colonial barracks.'
  },
  'chittorgarh': {
    id: 'chittorgarh',
    dynastyAndEra: 'Mori, Guhila & Sisodia Rajput Dynasties (7th–16th Century CE)',
    rulingMonarchs: ['Bappa Rawal (734–753)', 'Rawal Ratan Singh (1302–1303)', 'Rana Kumbha (1433–1468)', 'Rana Sanga (1508–1528)', 'Maharana Pratap (1572–1597)'],
    centuryPeriod: '7th to 16th Century CE',
    comprehensiveHistory: 'Perched atop a 180-meter high steep cliff spanning 700 acres, Chittorgarh Fort is the legendary capital of the kingdom of Mewar. Established in the 7th century CE by Chitrangada Mori, the fort was captured in 734 CE by Bappa Rawal, founding the illustrious Guhila-Sisodia dynasty that ruled Mewar for centuries. Chittorgarh stands as the supreme symbol of Rajput valor, unyielding independence, and honor. The fort endured three cataclysmic sieges: in 1303 CE by Sultan Alauddin Khalji, immortalized by the supreme sacrifice of Queen Rani Padmini who led thousands of women in Jauhar (self-immolation) to preserve honor; in 1535 CE by Sultan Bahadur Shah of Gujarat, marked by the second Jauhar led by Queen Rani Karnavati; and in 1567–1568 CE by Mughal Emperor Akbar against commanders Jaimal and Patta. In 1448 CE, the polymath ruler Rana Kumbha constructed the 37-meter, nine-storey Vijay Stambha (Tower of Victory) to commemorate his triumph over the combined armies of Malwa and Gujarat. The fortress houses 84 historic water bodies, ancient temples dedicated to Shiva, Vishnu, and Jain tirthankaras, and the royal palace where the mystic poet-saint Mirabai composed her devotional hymns to Lord Krishna.',
    chronologyTimeline: [
      { yearOrEra: '734 CE', title: 'Guhila Sovereignty', narrative: 'Bappa Rawal takes control of Chittorgarh, establishing Mewar royal house.' },
      { yearOrEra: '1303 CE', title: 'Siege of Alauddin Khalji', narrative: 'Alauddin besieges fort; Rani Padmini leads the first historic Jauhar.' },
      { yearOrEra: '1448 CE', title: 'Vijay Stambha Built', narrative: 'Rana Kumbha completes the nine-storey Victory Tower.' },
      { yearOrEra: '1568 CE', title: 'Akbar Siege & Exodus', narrative: 'Akbar breaches fort; capital moves south to Udaipur under Maharana Udai Singh II.' },
      { yearOrEra: '2013 CE', title: 'UNESCO Inscription', narrative: 'Inscribed under the "Hill Forts of Rajasthan" World Heritage property.' }
    ],
    engineeringSecrets: [
      'Immense Rainwater Storage: The fort was engineered with 84 ponds, kunds, stepwells, and reservoirs holding over 4 billion liters of rainwater—sufficient to supply 50,000 soldiers for four years without external supplies.',
      'Serrated Zigzag Defensive Approach: Seven monumental stone gateways (Pols) were built along a winding uphill rampart with arrow slits and machicolations to repel war elephants and battering rams.',
      'Vijay Stambha Earthquake Joinery: The nine-storey stone tower features central stone shafts with overlapping cantilevered balconies that flex during seismic tremors without tipping.'
    ],
    sacredLoreAndLegends: 'Mirabai, the revered bhakti saint and Mewar princess, lived in Chittorgarh where she renounced royal courtly luxuries to sing bhajans to her chosen deity, Lord Krishna (Girdhar Gopal), miraculously surviving poison sent by her in-laws.',
    archaeologicalExcavationLore: 'Documented extensively in Col. James Tod’s "Annals and Antiquities of Rajasthan" (1829); protected and conserved by the Archaeological Survey of India.'
  },
  'brihadisvara-temple': {
    id: 'brihadisvara-temple',
    dynastyAndEra: 'Imperial Chola Dynasty (Emperor Raja Raja Chola I, 985–1014 CE)',
    rulingMonarchs: ['Raja Raja Chola I (985–1014 CE)', 'Rajendra Chola I (1012–1044 CE)'],
    centuryPeriod: 'Early 11th Century CE (Completed 1010 CE)',
    comprehensiveHistory: 'The Brihadisvara Temple (Dakshina Meru or Peruvudaiyar Kovil) at Thanjavur was completed in 1010 CE by Emperor Raja Raja Chola I on the 275th day of his 25th regnal year. Constructed to celebrate the Chola Empire’s dominance across southern India and the Indian Ocean, the temple is one of the most astonishing achievements of granite architecture on earth. Although the fertile Kaveri delta has no granite formations within 60 kilometers, the Cholas transported more than 130,000 tonnes of hard granite using flotillas and elephant convoys. The grand pyramidal Vimana tower soars 66 meters into the sky over sixteen stepped tiers, crowned by an 80-tonne monolithic granite cupola capstone (Kumbam). The temple base preserves extensive Tamil stone inscriptions detailing the names, duties, and royal salaries of every mason, musician, percussionist, and all 400 classical Bharatanatyam dancers (Talippendugal) employed in the service of Lord Shiva. The inner sanctum ambulatory also preserves vibrant 11th-century Chola fresco paintings depicting Shiva as Tripurantaka and Raja Raja Chola with his spiritual guru Karuvur Devar, discovered beneath 17th-century Nayaka-era paintings.',
    chronologyTimeline: [
      { yearOrEra: '1003 CE', title: 'Foundation Laid', narrative: 'Raja Raja Chola I commences construction on the banks of the Kaveri canal.' },
      { yearOrEra: '1010 CE', title: 'Grand Kumbhabhishekam', narrative: 'Temple consecrated; golden kalasha hoisted to the 66-meter apex.' },
      { yearOrEra: '1931 CE', title: 'Chola Frescoes Discovered', narrative: 'Professor S.K. Govindaswami identifies ancient 11th-century Chola frescoes beneath Nayaka murals.' },
      { yearOrEra: '1987 CE', title: 'UNESCO Inscription', narrative: 'Inscribed as a UNESCO World Heritage Site ("Great Living Chola Temples").' },
      { yearOrEra: '2010 CE', title: 'Millennium Celebration', narrative: 'India commemorates the 1,000th anniversary of the temple with 1,000 Bharatanatyam dancers performing simultaneously.' }
    ],
    engineeringSecrets: [
      'Monolithic 80-Tonne Capstone Ramp: The massive circular granite Kumbam was rolled to the 66-meter summit up a gentle 6-kilometer inclined earthen ramp constructed from the nearby village of Sarapallam.',
      'Interlocking Granite Blocks: Assembled using precision mortise-and-tenon interlocking stone joints without binding mortar, resisting weathering and earth tremors for over a millennium.',
      'Noon Shadow Engineering: Due to the geometry of the sixteen-tier stepped pyramidal base and perimeter plinth, the colossal Vimana casts virtually no shadow outside its stone base platform at solar noon.'
    ],
    sacredLoreAndLegends: 'Temple epigraphs record that when the top kalasha was installed, Raja Raja Chola donated 41,559 gold kalanjus and over 500 jewels from his imperial treasury to adorn the Shiva linga.',
    archaeologicalExcavationLore: 'German epigraphist Eugen Hultzsch published the first comprehensive translation of the temple\'s Tamil inscriptions in South Indian Inscriptions (1891).'
  },
  'taj-mahal': {
    id: 'taj-mahal',
    dynastyAndEra: 'Mughal Empire (Emperor Shah Jahan, 1632–1648 CE)',
    rulingMonarchs: ['Shah Jahan (1628–1658 CE)'],
    centuryPeriod: '17th Century CE',
    comprehensiveHistory: 'The Taj Mahal was commissioned in 1631 CE by the fifth Mughal Emperor Shah Jahan to enshrine the mortal remains of his beloved consort, Arjumand Banu Begum, universally remembered as Mumtaz Mahal ("Jewel of the Palace"), who died giving birth to their fourteenth child in Burhanpur. Constructed between 1632 and 1648 CE on the banks of the Yamuna River in Agra, the mausoleum was designed by a council of imperial architects headed by Ustad Ahmad Lahori. More than 20,000 stonecarvers, calligraphers, lapidaries, and artisans from across India, Persia, Central Asia, and the Ottoman Empire were assembled. Built from translucent white Makrana marble from Rajasthan, the complex embodies flawless bilateral symmetry, based on strict geometric ratios and modular grids. The central lotus dome rises 73 meters, flanked by four 40-meter minarets engineered to tilt slightly outward to protect the tomb in case of earthquakes. Its surfaces are adorned with Quranic calligraphy in Thuluth script designed by Amanat Khan Shirazi and pietra dura (parchin kari) gemstone inlays utilizing lapis lazuli, turquoise, carnelian, jasper, and mother-of-pearl.',
    chronologyTimeline: [
      { yearOrEra: '1631 CE', title: 'Passing of Mumtaz Mahal', narrative: 'Empress dies at Burhanpur; initial burial in Zainabad garden.' },
      { yearOrEra: '1632 CE', title: 'Work Begins in Agra', narrative: 'Imperial construction begins on riverfront land exchanged with Raja Jai Singh.' },
      { yearOrEra: '1648 CE', title: 'Main Tomb Completed', narrative: 'Central marble mausoleum consecrated at an imperial cost exceeding 32 million rupees.' },
      { yearOrEra: '1653 CE', title: 'Outlying Complex Finalized', narrative: 'Mosque, Jawab, gates, and Charbagh water gardens completed.' },
      { yearOrEra: '1983 CE', title: 'UNESCO Inscription', narrative: 'Inscribed as a universally admired masterpiece of creative human genius.' }
    ],
    engineeringSecrets: [
      'Wooden Well Foundation System: Because the monument rests on sandy alluvial Yamuna soil, builders sank deep brick-and-timber wells filled with iron and rubble, reinforced by ebony and teak beams that remain hardened by constant subterranean river moisture.',
      'Outward-Leaning Minarets: The four 40-meter minarets lean outward by approximately 2.5 degrees so that in the event of an earthquake, they would fall away from the central dome rather than onto it.',
      'Optical Illusions & Color Metamorphosis: The marble changes appearance through the day—glowing rose-pink at sunrise, pearlescent white at solar noon, and golden topaz under moonlight.'
    ],
    sacredLoreAndLegends: 'Court chroniclers describe Shah Jahan choosing Makrana marble because it absorbs light during the day and softly emits an ethereal luminescent glow at dusk and full-moon nights.',
    archaeologicalExcavationLore: 'Lord Curzon, Viceroy of India, directed an extensive restoration between 1899 and 1905, recreating the formal British-style lawns and commissioning the bronze hanging lamp in the central chamber from Cairo.'
  },
  'ellora-caves': {
    id: 'ellora-caves',
    dynastyAndEra: 'Rashtrakuta, Kalachuri & Yadava Dynasties (6th–10th Century CE)',
    rulingMonarchs: ['Krishna I (756–774 CE)', 'Dantidurga (735–756 CE)', 'Govinda III (793–814 CE)'],
    centuryPeriod: '6th to 10th Century CE',
    comprehensiveHistory: 'The Ellora Caves comprise 34 monumental rock-cut excavations carved into the Charanandri hills of Maharashtra, representing an extraordinary testament to religious harmony and artistic coexistence in ancient India. The site features 12 Buddhist monasteries (caves 1–12), 17 Hindu temples (caves 13–29), and 5 Jain sanctuaries (caves 30–34) constructed side-by-side between 600 and 1000 CE. The crown jewel of Ellora—and one of mankind\'s greatest architectural achievements—is the Kailasa Temple (Cave 16). Commissioned in the 8th century CE under King Krishna I of the Rashtrakuta Dynasty, the Kailasa is the world\'s largest monolithic rock excavation. Rather than being built up from ground stones, master sculptors started at the summit of the volcanic basalt mountain cliff and carved vertically downwards, removing over 200,000 tonnes of solid rock with chisels and hammers. The resulting free-standing, multi-storey temple reproduces the mythical Mount Kailash abode of Lord Shiva, complete with a two-storey gateway, Nandi mandapa, towering 32-meter vimana spire, life-sized carved stone elephants, and dramatic relief panels showing Ravana shaking Mount Kailash.',
    chronologyTimeline: [
      { yearOrEra: '600–730 CE', title: 'Early Buddhist Viharas', narrative: 'Excavation of multi-storey Buddhist monasteries (including Teen Tal).' },
      { yearOrEra: '756–774 CE', title: 'Kailasa Temple Carved', narrative: 'Rashtrakuta King Krishna I carves the monolithic temple from the top down.' },
      { yearOrEra: '800–1000 CE', title: 'Jain Sanctuaries', narrative: 'Digambara Jain shrines (Indra Sabha) excavated with intricate ornamental filigree.' },
      { yearOrEra: '1983 CE', title: 'UNESCO Inscription', narrative: 'Inscribed for its technical prowess and religious tolerance.' }
    ],
    engineeringSecrets: [
      'Zero-Error Top-Down Subtraction: Unlike conventional architecture where mistakes can be corrected by replacing bricks, subtractive monolithic excavation permitted zero error—every pillar, bracket, and relief was calculated in advance before chiseling the cliff.',
      'Two-Storey Bridge Architecture: Rock-cut overhead bridges originally linked the sanctum to the upper galleries, carved directly from the parent rock.',
      'Plinth Elephant Caryatids: The main plinth is supported by a continuous sculpted base of colossal life-sized rock elephants that appear to lift the temple on their backs.'
    ],
    sacredLoreAndLegends: 'According to the Katha-Kalpataru, Queen Manikavati vowed not to eat until she saw the shikhara of a Shiva temple built for her ailing husband. Chief architect Kokasa promised to reveal the shikhara in just one week by carving from the summit down, thus allowing the queen to break her fast early.',
    archaeologicalExcavationLore: 'Documented in James Burgess’s 1883 Archaeological Survey of Western India; preserved by the ASI with rock consolidation and drainage management.'
  }
};

export const getMonumentHistoryProfile = (monumentId: string): MonumentHistoricalProfile => {
  if (monumentHistoricalProfiles[monumentId]) {
    return monumentHistoricalProfiles[monumentId];
  }
  
  // Format readable name from ID
  const cleanName = monumentId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

  return {
    id: monumentId,
    dynastyAndEra: 'Imperial Sovereign Dynasties of Bharat',
    rulingMonarchs: ['Royal Indian Dynastic Founders', 'Master Builders & Guild Craftsmen'],
    centuryPeriod: 'Classical & Medieval Indian Heritage Era',
    comprehensiveHistory: `${cleanName} stands as one of the preeminent cultural and architectural jewels of the Indian subcontinent. Commissioned under sovereign royal patronage in accordance with classical Indian treatises (Shilpa Shastra and Vastu Vidya), master sculptors, architects, and stone guilds assembled to erect this monumental complex as a testament to civilizational excellence, spiritual devotion, and artistic innovation. Surviving centuries of monsoon exposure, imperial transformations, and tectonic shifts, the monument was thoroughly investigated, surveyed, and conserved by the Archaeological Survey of India (ASI) before being inscribed on the UNESCO World Heritage register for its Outstanding Universal Value to all humanity.`,
    chronologyTimeline: [
      { yearOrEra: 'Epoch of Inception', title: 'Royal Genesis & Consecration', narrative: 'Commissioned under imperial royal decree with ceremonial sacred rituals and architectural surveys.' },
      { yearOrEra: 'Classical Golden Age', title: 'Expansion & Patronage', narrative: 'Flourished as an international center of art, philosophy, trade, and architectural elaboration.' },
      { yearOrEra: 'Modern Era', title: 'Conservation & Global Recognition', narrative: 'Systematically conserved by the Archaeological Survey of India and inscribed as a UNESCO World Heritage Site.' }
    ],
    engineeringSecrets: [
      'Vastu Purusha Mandala Geometry: Engineered according to the sacred grid proportions of classical Indian architectural treatises, ensuring structural balance and acoustic resonance.',
      'Indigenous Material Science: Utilized dressed regional stones, iron-clamped interlocking joinery, and specialized hydraulic lime-sand mortar engineered to endure for millennia.'
    ],
    sacredLoreAndLegends: `Local epigraphs and religious folklore celebrate ${cleanName} as an auspicious threshold of spiritual transcendence, sacred remembrance, and architectural perfection.`,
    archaeologicalExcavationLore: 'Preserved, scientifically surveyed, and maintained under the statutory protection of the Archaeological Survey of India (ASI).'
  };
};
