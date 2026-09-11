// BharatVirasat — Comprehensive Cultural Heritage Knowledge Engine
// Powers conversational AI in English, Hindi & Hinglish across 32 UNESCO sites, crafts, arts & astronomy

import { unescoMonumentsList, UnescoMonument } from '@/data/unescoMonuments';
import { states } from '@/data/states';
import { crafts } from '@/data/crafts';
import { artisans } from '@/data/artisans';
import { studentInnovationIdeas, musicalTraditions } from '@/data/innovations';

export interface AIResponsePayload {
  content: string;
  links: { label: string; path: string }[];
  suggestedFollowUps?: string[];
  category?: 'monument' | 'craft' | 'dance' | 'music' | 'student' | 'travel' | 'general';
}

export function queryHeritageKnowledgeEngine(rawQuery: string): AIResponsePayload {
  const q = rawQuery.toLowerCase().trim();
  const links: { label: string; path: string }[] = [];

  // Normalizing common Hindi / Hinglish queries
  const isHindiHinglish =
    q.includes('kya hai') ||
    q.includes('kaha hai') ||
    q.includes('kisne') ||
    q.includes('kaise') ||
    q.includes('batao') ||
    q.includes('mandir') ||
    q.includes('kila') ||
    q.includes('itihas') ||
    q.includes('kahani') ||
    q.includes('kareeb') ||
    q.includes('dekhein') ||
    q.includes('yatra') ||
    q.includes('gharana') ||
    q.includes('shuru');

  // =========================================================================
  // 1. SPECIFIC UNESCO MONUMENTS (32 SITES) MATCHING
  // =========================================================================
  const matchedMonument = unescoMonumentsList.find((m) => {
    const nameLow = m.name.toLowerCase();
    const idLow = m.id.toLowerCase();
    const hindiLow = m.hindiName.toLowerCase();
    const locLow = m.location.toLowerCase();

    // Direct token checks
    if (q.includes(idLow) || q.includes(nameLow) || q.includes(hindiLow)) return true;
    if (idLow.includes('taj') && (q.includes('taj') || q.includes('agra') || q.includes('mumtaz'))) return true;
    if (idLow.includes('konark') && (q.includes('konark') || q.includes('sun temple') || q.includes('surya mandir'))) return true;
    if (idLow.includes('hampi') && (q.includes('hampi') || q.includes('vijayanagara') || q.includes('vittala'))) return true;
    if (idLow.includes('ellora') && (q.includes('ellora') || q.includes('kailasa') || q.includes('kailash'))) return true;
    if (idLow.includes('ajanta') && (q.includes('ajanta') || q.includes('cave painting'))) return true;
    if (idLow.includes('khajuraho') && (q.includes('khajuraho') || q.includes('chandela') || q.includes('kandariya'))) return true;
    if (idLow.includes('chola') && (q.includes('chola') || q.includes('brihad') || q.includes('thanjavur') || q.includes('tanjore'))) return true;
    if (idLow.includes('qutub') && (q.includes('qutub') || q.includes('qutab') || q.includes('iron pillar') || q.includes('lauh stambh'))) return true;
    if (idLow.includes('red-fort') && (q.includes('red fort') || q.includes('lal qila') || q.includes('laal kila'))) return true;
    if (idLow.includes('sanchi') && (q.includes('sanchi') || q.includes('stupa') || q.includes('ashoka'))) return true;
    if (idLow.includes('kaziranga') && (q.includes('kaziranga') || q.includes('rhino') || q.includes('rhinos'))) return true;
    if (idLow.includes('rani-ki-vav') && (q.includes('rani') || q.includes('vav') || q.includes('stepwell') || q.includes('baoli'))) return true;
    if (idLow.includes('nalanda') && (q.includes('nalanda') || q.includes('ancient university'))) return true;
    if (idLow.includes('mahabalipuram') && (q.includes('mahabalipuram') || q.includes('mamallapuram') || q.includes('shore temple') || q.includes('ratha'))) return true;
    if (idLow.includes('fatehpur') && (q.includes('fatehpur') || q.includes('buland darwaza'))) return true;
    if (idLow.includes('elephanta') && (q.includes('elephanta') || q.includes('trimurti') || q.includes('gharapuri'))) return true;
    if (idLow.includes('pattadakal') && (q.includes('pattadakal') || q.includes('badami'))) return true;
    if (idLow.includes('bodh-gaya') && (q.includes('bodh') || q.includes('mahabodhi') || q.includes('bodhi tree'))) return true;
    if (idLow.includes('sunderbans') && (q.includes('sunderban') || q.includes('sundarbans') || q.includes('mangrove') || q.includes('royal bengal'))) return true;
    if (idLow.includes('jantar-mantar') && (q.includes('jantar') || q.includes('mantar') || q.includes('astronomy observatory') || q.includes('samrat yantra'))) return true;
    if (idLow.includes('western-ghats') && (q.includes('western ghats') || q.includes('sahyadri'))) return true;
    if (idLow.includes('hill-forts') && (q.includes('hill fort') || q.includes('chittorgarh') || q.includes('kumbhalgarh') || q.includes('amber'))) return true;
    if (idLow.includes('chandigarh') && (q.includes('le corbusier') || q.includes('chandigarh capitol'))) return true;
    if (idLow.includes('ahmedabad') && (q.includes('ahmedabad') || q.includes('walled city') || q.includes('pol houses'))) return true;
    if (idLow.includes('jaipur') && (q.includes('jaipur city') || q.includes('pink city'))) return true;
    if (idLow.includes('kakatiya') && (q.includes('kakatiya') || q.includes('ramappa') || q.includes('floating brick'))) return true;
    if (idLow.includes('dholavira') && (q.includes('dholavira') || q.includes('harappa') || q.includes('indus valley'))) return true;
    if (idLow.includes('hoysala') && (q.includes('hoysala') || q.includes('belur') || q.includes('halebidu') || q.includes('somnathpur'))) return true;
    if (idLow.includes('shantiniketan') && (q.includes('shantiniketan') || q.includes('santiniketan') || q.includes('tagore'))) return true;

    return false;
  });

  if (matchedMonument) {
    links.push({ label: 'Explore on UNESCO 32 Showcase', path: '/unesco' });
    links.push({ label: 'Launch 3D Archaeo-Astronomy Sanctum', path: '/#sanctum-3d' });
    links.push({ label: `Monuments Near ${matchedMonument.stateName}`, path: '/near-me' });

    const wondersList = matchedMonument.architecturalWonders
      ? matchedMonument.architecturalWonders.map((w) => `  • ${w}`).join('\n')
      : '';

    return {
      category: 'monument',
      content:
        `### 🏛️ ${matchedMonument.name} (${matchedMonument.hindiName})\n\n` +
        `📍 **Location & State:** ${matchedMonument.location} (${matchedMonument.stateName})\n` +
        `🏆 **UNESCO World Heritage Status:** Inscribed in ${matchedMonument.yearInscribed} (${matchedMonument.category.toUpperCase()})\n` +
        `📜 **Criteria:** ${matchedMonument.unescoCriteria}\n\n` +
        `#### 👑 Historical Context & Origins\n${matchedMonument.history}\n\n` +
        `#### 📐 Architectural & Engineering Wonder\n${matchedMonument.architecturalSignificance}\n\n` +
        (wondersList ? `#### 🌟 Key Architectural Marvels:\n${wondersList}\n\n` : '') +
        `#### 🎧 Cultural Legacy & Spoken Guide Insights\n${matchedMonument.audioNarration}\n\n` +
        `> 💡 **Visitor & Conservation Note:** ${matchedMonument.coreHighlight}`,
      links,
      suggestedFollowUps: [
        `How does the 3D model of ${matchedMonument.name} work?`,
        `What is the best season to visit ${matchedMonument.name}?`,
        `Tell me about the engineering science behind this monument`,
      ],
    };
  }

  // =========================================================================
  // 2. ARCHAEO-ASTRONOMY & ANCIENT ENGINEERING MARVELS
  // =========================================================================
  if (
    q.includes('astronomy') ||
    q.includes('sundial') ||
    q.includes('science') ||
    q.includes('engineering') ||
    q.includes('iron pillar') ||
    q.includes('rust') ||
    q.includes('kailasa') ||
    q.includes('shadow') ||
    q.includes('acoustic') ||
    q.includes('musical pillar') ||
    q.includes('solstice') ||
    q.includes('equinox')
  ) {
    links.push({ label: 'Interactive 3D Sanctum', path: '/#sanctum-3d' });
    links.push({ label: '32 UNESCO Monuments', path: '/unesco' });

    return {
      category: 'monument',
      content:
        `### 🌌 Archaeo-Astronomy & Ancient Civilizational Engineering of Bharat\n\n` +
        `Ancient Indian temples were not merely places of worship; they served as **cosmic calculators, architectural laboratories, and precision solar observatories**:\n\n` +
        `1. **Konark Sun Temple's 24 Sundial Wheels (Odisha)**:\n` +
        `   - The 24 stone wheels represent the 24 hours of the day and 24 fortnights (Pakshas) of the Hindu solar calendar.\n` +
        `   - Each wheel has 8 major spokes (representing 8 Prahars of 3 hours each) and 8 minor spokes. By reading where the axle's shadow falls on the perimeter beads, one can calculate time down to the precise **minute**!\n\n` +
        `2. **The Kailasa Monolithic Excavation (Ellora Cave 16, Maharashtra)**:\n` +
        `   - Carved **vertically top-to-bottom** out of a single basalt mountain cliff.\n` +
        `   - Over **200,000 tonnes** of solid volcanic rock were removed by Rashtrakuta artisans using only chisels and hammers without scaffolding or modern cranes.\n` +
        `   - Zero tolerance for error: A single incorrect strike would ruin the monolithic symmetry forever.\n\n` +
        `3. **The Rustless Delhi Iron Pillar (Mehrauli, 4th Century CE)**:\n` +
        `   - Weighing over 6 tonnes and standing for over **1,600 years** through monsoon humidity, it exhibits virtually zero corrosion.\n` +
        `   - IIT Kanpur metallurgists confirmed ancient Gupta smiths used high-phosphorus iron with forge-welding, forming a protective **misawite** crystalline layer on the surface.\n\n` +
        `4. **Musical Acoustic Pillars of Vittala Temple (Hampi, Karnataka)**:\n` +
        `   - 56 monolithic granite pillars resonate at precise musical frequencies when tapped, tuned to the 7 notes (Sa-Re-Ga-Ma-Pa-Dha-Ni) of Indian classical scales.\n\n` +
        `5. **Brihadeeswarar Temple Kumbam Capstone (Thanjavur, Tamil Nadu)**:\n` +
        `   - The single granite block crowning the vimana weighs **80 tonnes** and was hoisted 66 meters high in 1010 CE via a 6-kilometer earthen ramp!\n`,
      links,
      suggestedFollowUps: [
        'How does Konark wheel calculate time in minutes?',
        'Tell me about Kailasa Temple Ellora construction',
        'Explore 3D Sanctum view',
      ],
    };
  }

  // =========================================================================
  // 3. STUDENT INNOVATION & HACKATHON BLUEPRINTS
  // =========================================================================
  if (
    q.includes('student') ||
    q.includes('innovation') ||
    q.includes('idea') ||
    q.includes('hackathon') ||
    q.includes('project') ||
    q.includes('technology') ||
    q.includes('solution') ||
    q.includes('pass')
  ) {
    links.push({ label: 'Student Innovation Pass Login', path: '/login' });
    links.push({ label: 'Scan Crafts with BharatLens', path: '/identify' });
    links.push({ label: 'Heritage Journey Map', path: '/journey' });

    let ideasList = studentInnovationIdeas
      .map(
        (idea, idx) =>
          `**${idx + 1}. ${idea.title}**\n*Domain:* \`${idea.domain}\`\n*Problem Addressed:* ${idea.problemSolved}\n*Innovative Solution:* ${idea.solutionOverview}\n*Real Impact Metric:* ${idea.impactMetric}\n`
      )
      .join('\n');

    return {
      category: 'student',
      content:
        `### 🚀 BharatVirasat Student Innovation Framework\n\n` +
        `Our platform is built to inspire engineering students, designers, and innovators to solve critical challenges facing India's cultural heritage:\n\n` +
        ideasList +
        `\n#### 💡 Hackathon Evaluation Advice:\n` +
        `• **Artisan Upliftment:** Show tangible ways to increase the income of rural GI-certified craftspeople.\n` +
        `• **Offline-First Resilience:** Ensure your application works in remote monuments with poor network connectivity.\n` +
        `• **Preservation Integrity:** Use WebGL/Three.js or AI Vision that respects cultural sacredness while delivering educational immersion.`,
      links,
      suggestedFollowUps: [
        'How can I get the Student Innovation Pass?',
        'Tell me more about BharatLens AI vision scanner',
        'How does VirasatChain blockchain authentication work?',
      ],
    };
  }

  // =========================================================================
  // 4. CLASSICAL & FOLK DANCES OF INDIA
  // =========================================================================
  if (
    q.includes('dance') ||
    q.includes('nritya') ||
    q.includes('kathak') ||
    q.includes('bharatanatyam') ||
    q.includes('garba') ||
    q.includes('bhangra') ||
    q.includes('ghoomar') ||
    q.includes('odissi') ||
    q.includes('bihu') ||
    q.includes('chhau') ||
    q.includes('kuchipudi') ||
    q.includes('kathakali') ||
    q.includes('mohiniyattam') ||
    q.includes('sattriya')
  ) {
    links.push({ label: 'Cultural Video Reels', path: '/reels' });
    links.push({ label: 'Explore States by Culture', path: '/explore' });

    return {
      category: 'dance',
      content:
        `### 💃 The Sacred Dances of Bharat: Classical & Folk Traditions\n\n` +
        `India's performing arts are grounded in the 2,000-year-old **Natya Shastra** composed by Sage Bharata Muni, uniting drama (Natya), pure rhythm (Nritta), and emotional expression (Nritya):\n\n` +
        `#### 🌟 The 9 Classical Dance Forms (Sangeet Natak Akademi & Ministry of Culture):\n` +
        `1. **Bharatanatyam (Tamil Nadu)**: Ancient temple dance of the Devadasis; famous for the 'Aramandi' (half-sit) posture and crisp geometric Mudras.\n` +
        `2. **Kathak (North India - Lucknow, Jaipur, Banaras)**: Storytelling art characterized by rapid pirouettes (Chakkars), subtle Abhinaya, and complex Tatkar footwork synced to the Ghungroo bells.\n` +
        `3. **Kathakali (Kerala)**: Grand classical dance-drama featuring vibrant facial makeup masks (Paccha green for noble heroes, Kathi for villains) and expressive eye movements.\n` +
        `4. **Odissi (Odisha)**: Sculpturesque dance based on the Natya Shastra and Silpa Prakasa, celebrated for the lyrical **Tribhangi** (three-bend) posture.\n` +
        `5. **Kuchipudi (Andhra Pradesh)**: Originated in Kuchipudi village; features the famous 'Tarangam' where dancers balance gracefully atop the edges of a brass plate.\n` +
        `6. **Manipuri Raas Leela (Manipur)**: Gentle, ethereal Vaishnavite devotional dance featuring cylindrical stiff skirts called Potloi.\n` +
        `7. **Mohiniyattam (Kerala)**: 'Dance of the Enchantress'; graceful, swaying movements evocative of palm fronds and backwater waves, adorned in white and gold Kasavu sarees.\n` +
        `8. **Sattriya (Assam)**: 500-year-old monastic tradition instituted by saint Srimanta Sankardev in the Satras (monasteries) of Majuli.\n` +
        `9. **Chhau (Jharkhand, West Bengal, Odisha - UNESCO)**: Martial mask dance depicting epic battles from the Ramayana and Mahabharata.\n\n` +
        `#### 🪔 UNESCO Recognized Living Folk Traditions:\n` +
        `• **Garba of Gujarat (UNESCO Inscribed 2023)**: Dynamic concentric circular dance celebrating Goddess Shakti during Navratri.\n` +
        `• **Kalbeliya (Rajasthan, UNESCO)**: Mesmerizing serpent-mimicking desert dance performed by women in shimmering black swirl skirts.\n` +
        `• **Bhangra & Giddha (Punjab)**: High-voltage celebratory harvest dances driven by the beat of the Dhol.`,
      links,
      suggestedFollowUps: [
        'What is the Tribhangi posture in Odissi?',
        'Difference between Kathak and Bharatanatyam',
        'Watch cultural dance reels',
      ],
    };
  }

  // =========================================================================
  // 5. TRADITIONAL MUSIC, RAGAS & INSTRUMENTS
  // =========================================================================
  if (
    q.includes('music') ||
    q.includes('instrument') ||
    q.includes('sitar') ||
    q.includes('tabla') ||
    q.includes('shehnai') ||
    q.includes('sarangi') ||
    q.includes('mridangam') ||
    q.includes('veena') ||
    q.includes('ravanahatha') ||
    q.includes('raga') ||
    q.includes('hindustani') ||
    q.includes('carnatic') ||
    q.includes('sangeet')
  ) {
    links.push({ label: 'Explore Cultural Music Heritage', path: '/explore' });
    links.push({ label: 'Listen to Ambient Soundtrack', path: '/#player' });

    let musicList = musicalTraditions
      .slice(0, 4)
      .map((m) => `• **${m.name} (${m.stateName})**: ${m.description}\n  *Key Instruments:* ${m.instrumentsUsed.join(', ')}`)
      .join('\n\n');

    return {
      category: 'music',
      content:
        `### 🎵 Indian Classical Music & Ancient Instruments\n\n` +
        `Indian music is divided into two ancient, microtonal systems that share common civilizational roots in the **Sama Veda**:\n\n` +
        `• **Hindustani Music (North India)**: Centered around Raga (melodic framework), Tala (rhythmic cycle), and Gharana (stylistic lineages like Gwalior, Agra, Kirana, Maihar). Emphasizes slow melodic development (Alaap).\n` +
        `• **Carnatic Music (South India)**: Highly devotional, structured around Kriti compositions by the musical Trinity (Tyagaraja, Muthuswami Dikshitar, and Syama Sastri).\n\n` +
        `#### 🎻 Iconic Heritage Instruments:\n` +
        `• **Ravanahatha (Rajasthan)**: An ancient bowed coconut-shell chordophone believed to date back to Ravana; considered by musicologists as the ancestor of the modern violin.\n` +
        `• **Saraswati Veena (South India)**: 24 brass frets mounted on wax; considered the divine instrument of knowledge and wisdom.\n` +
        `• **Shehnai (Varanasi)**: Auspicious quadruple-reed aerophone immortalized on the world stage by Bharat Ratna Ustad Bismillah Khan.\n` +
        `• **Mridangam (Carnatic)**: Double-sided barrel drum tuned with a mixture of iron filings and boiled rice (Karanai) on the right head to generate harmonic overtones.\n` +
        `• **Sarangi**: 'Sau-rang' (100 colors); bowed hollow wood instrument whose sound closely resembles the nuances of the human singing voice.\n\n` +
        `#### 🏛️ Regional Living Traditions:\n${musicList}`,
      links,
      suggestedFollowUps: [
        'What is Ravanahatha instrument?',
        'Difference between Hindustani and Carnatic music',
        'How are temple bells acoustically tuned?',
      ],
    };
  }

  // =========================================================================
  // 6. GI CRAFTS & AUTHENTICITY TESTS (HOW TO SPOT FAKES)
  // =========================================================================
  const matchedCraft = crafts.find(
    (c) =>
      q.includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase() === q ||
      (c.tags && c.tags.some((t) => q.includes(t))) ||
      q.includes(c.district.toLowerCase())
  );

  if (matchedCraft) {
    links.push({ label: `View ${matchedCraft.name} Craft Profile`, path: `/craft/${matchedCraft.id}` });
    links.push({ label: `Explore ${matchedCraft.stateName}`, path: `/explore/state/${matchedCraft.stateId}` });
    const linkedArtisan = artisans.find((a) => a.craftId === matchedCraft.id);
    if (linkedArtisan) {
      links.push({ label: `Meet Master Artisan ${linkedArtisan.name}`, path: `/artisans/${linkedArtisan.id}` });
    }

    return {
      category: 'craft',
      content:
        `### 🧵 ${matchedCraft.name} (${matchedCraft.category.toUpperCase()})\n\n` +
        `📍 **Geographical Indication (GI):** ${matchedCraft.giStatus ? matchedCraft.giNumber : 'Traditional Heritage Craft'} • **Origin:** ${matchedCraft.district}, ${matchedCraft.stateName}\n\n` +
        `#### 📜 Heritage & Historical Significance\n${matchedCraft.history}\n\n` +
        `#### 🔨 Making Process & Craftsmanship\n${matchedCraft.makingProcess}\n\n` +
        `🧶 **Raw Materials:** ${matchedCraft.materials.join(', ')}\n` +
        `💰 **Authentic Price Range:** ${matchedCraft.priceRange}\n` +
        `📍 **Direct Artisan Purchasing:** ${matchedCraft.whereToBuy.join(' • ')}\n\n` +
        `#### 🛡️ How to Detect Authentic Handcrafted vs Powerloom / Machine Fakes:\n` +
        `${matchedCraft.originalVsImitation}`,
      links,
      suggestedFollowUps: [
        `How long does it take to make one ${matchedCraft.name}?`,
        `Where can I buy authentic ${matchedCraft.name}?`,
        `Scan this craft with BharatLens AI`,
      ],
    };
  }

  // Silk Queries
  if (q.includes('silk') || q.includes('saree') || q.includes('zari') || q.includes('loom')) {
    links.push({ label: 'Explore Silk Crafts', path: '/explore' });
    links.push({ label: 'AI Authenticity Scanner', path: '/identify' });

    return {
      category: 'craft',
      content:
        `### 👑 The Imperial Silk Heritage of India\n\n` +
        `India is the **only country in the world** producing all 4 commercial varieties of silk: **Mulberry, Eri (Peace Silk), Tasar, and Muga (Golden Silk)**:\n\n` +
        `1. **Assam Muga Silk (GI-26)**: The world's rarest natural golden silk. The silkworms feed outdoors on Som and Sualu trees; it requires **zero artificial dyes** and its golden luster intensifies with each wash!\n` +
        `2. **Kanchipuram Silk (GI-1, Tamil Nadu)**: Heavy mulberry silk woven with pure silver Zari electroplated with 22k gold. Recognizable by the interlocking **Korvai** technique uniting body and border.\n` +
        `3. **Patan Patola Double Ikat (GI-232, Gujarat)**: Both the warp and weft threads are individually tie-dyed before mounting on the loom. The resulting fabric is 100% identical on front and back with no reverse side!\n` +
        `4. **Banarasi Brocade (GI-200, Uttar Pradesh)**: Mughal-inspired intricate floral motifs (Kinkhab, Paisley, Bel) woven using gold and silver threads.\n\n` +
        `#### 💡 Authenticity Test:\n` +
        `• **The Burn Test:** Real silk thread burns slowly with a smell like charred hair and leaves a crushable black ash. Synthetic polyester melts rapidly into a hard plastic bead.\n` +
        `• **The Zari Test:** True gold/silver zari has a red silk core; fake imitation zari uses copper wire with synthetic cotton or polyester core.`,
      links,
      suggestedFollowUps: [
        'Tell me about Patan Patola double ikat',
        'How to identify real Banarasi silk vs powerloom',
        'Explore Gujarat and Tamil Nadu crafts',
      ],
    };
  }

  // =========================================================================
  // 7. SPECIFIC STATE CULTURAL DOSSIER
  // =========================================================================
  const matchedState = states.find(
    (s) =>
      q.includes(s.name.toLowerCase()) ||
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase() === q ||
      q.includes(s.capital.toLowerCase())
  );

  if (matchedState) {
    links.push({ label: `Explore ${matchedState.name} Heritage`, path: `/explore/state/${matchedState.id}` });
    links.push({ label: 'View State Cultural Map', path: '/explore' });

    return {
      category: 'travel',
      content:
        `### 🗺️ Cultural Heritage of ${matchedState.name} ("${matchedState.tagline}")\n\n` +
        `${matchedState.description}\n\n` +
        `🎨 **Signature GI Crafts:** ${matchedState.crafts.join(', ')}\n` +
        `💃 **Classical & Folk Dances:** ${matchedState.dances.join(', ')}\n` +
        `🎉 **Major Festivals:** ${matchedState.festivals.join(', ')}\n` +
        `🍛 **Traditional Cuisine:** ${matchedState.foods.join(', ')}\n` +
        `🏛️ **Iconic Heritage Sites:** ${matchedState.heritageSites.join(', ')}\n\n` +
        (matchedState.musicInstruments ? `🎵 **Traditional Musical Instruments:** ${matchedState.musicInstruments.join(', ')}\n\n` : '') +
        `💡 **Did You Know?** ${matchedState.funFact}`,
      links,
      suggestedFollowUps: [
        `What are the top crafts to buy in ${matchedState.name}?`,
        `Tell me about festivals celebrated in ${matchedState.name}`,
        `Explore monuments near ${matchedState.name}`,
      ],
    };
  }

  // =========================================================================
  // 8. TRAVEL ITINERARIES & HERITAGE CIRCUITS
  // =========================================================================
  if (
    q.includes('travel') ||
    q.includes('itinerary') ||
    q.includes('trip') ||
    q.includes('circuit') ||
    q.includes('tour') ||
    q.includes('visit') ||
    q.includes('day 1') ||
    q.includes('route')
  ) {
    links.push({ label: 'Discover Monuments Near Me', path: '/near-me' });
    links.push({ label: '32 UNESCO Sites', path: '/unesco' });

    return {
      category: 'travel',
      content:
        `### 🧭 Curated Indian Heritage Travel Circuits\n\n` +
        `Here are 3 high-impact cultural itineraries designed for heritage travelers and students:\n\n` +
        `#### 1. The Golden Triangle & Mughlai Heritage (5 Days):\n` +
        `• **Day 1 (Delhi):** Qutub Minar, Red Fort, Humayun's Tomb, and Mehrauli Iron Pillar.\n` +
        `• **Day 2 (Delhi to Agra):** Sunrise at Taj Mahal, Agra Fort, and Pietra Dura marble inlay workshops.\n` +
        `• **Day 3 (Fatehpur Sikri to Jaipur):** Buland Darwaza, stepwells of Abhaneri, and arrival in Jaipur.\n` +
        `• **Day 4 (Jaipur):** Amber Fort, Jantar Mantar solar observatory, Hawa Mahal, and Sanganeri block printing.\n` +
        `• **Day 5 (Jaipur):** City Palace and Blue Pottery artisan studio visit.\n\n` +
        `#### 2. The Great Temple Trail of South India (6 Days):\n` +
        `• **Chennai & Mahabalipuram (Days 1-2):** Shore Temple and monolithic Five Rathas.\n` +
        `• **Thanjavur (Days 3-4):** Brihadeeswarar Temple and Tanjore gold leaf painting ateliers.\n` +
        `• **Madurai (Days 5-6):** Meenakshi Amman Temple 1,000-pillar hall and evening Aarti ceremony.\n\n` +
        `#### 3. Archaeo-Astronomy & Cave Art Trail (4 Days):\n` +
        `• **Bhubaneswar & Konark:** Lingaraja Temple & 24 solar wheels of Konark Sun Temple.\n` +
        `• **Aurangabad:** Ajanta Cave Buddhist murals & Kailasa monolithic rock temple at Ellora.\n`,
      links,
      suggestedFollowUps: [
        'What is the best time to visit Konark and Puri?',
        'Tell me about transport between Agra and Jaipur',
        'Find monuments near my current location',
      ],
    };
  }

  // =========================================================================
  // 9. GENERAL CONVERSATION & HINDI WELCOME
  // =========================================================================
  links.push({ label: 'Explore 32 UNESCO Monuments', path: '/unesco' });
  links.push({ label: 'Experience 3D Archaeo-Sanctum', path: '/#sanctum-3d' });
  links.push({ label: 'Student Innovation Pass', path: '/login' });

  if (isHindiHinglish) {
    return {
      category: 'general',
      content:
        `नमस्ते! मैं **भारतविरासत AI हेरिटेज क्यूरेटर** हूँ।\n\n` +
        `आप मुझसे भारत की सांस्कृतिक धरोहर, 32 यूनेस्को स्मारकों, प्राचीन विज्ञान, हस्तशिल्प और संगीत के बारे में कोई भी प्रश्न पूछ सकते हैं:\n\n` +
        `• **यूनेस्को स्मारक और मंदिर:** कोणार्क सूर्य मंदिर का 24 पहियों वाला धूपघड़ी विज्ञान, एलोरा का कैलाश मंदिर, हम्पी, ताजमहल, और चोल मंदिर।\n` +
        `• **पारंपरिक हस्तशिल्प (GI टैग्स):** बनारसी रेशम, कांचीपुरम, पशमीना, चिकनकारी और असली बनाम नकली की पहचान।\n` +
        `• **नृत्य और संगीत:** कथक, भरतनाट्यम, गरबा, बिहू, रावणहत्था, शहनाई और मृदंगम।\n` +
        `• **स्टूडेंट इनोवेशन:** विरासत संरक्षण के लिए AI विज़न, ब्लॉकचेन और 3D मॉडल्स।\n\n` +
        `*कृपया अपना सवाल टाइप करें या ऊपर दिए गए सुझावों पर क्लिक करें!*`,
      links,
      suggestedFollowUps: [
        'कोणार्क सूर्य मंदिर का इतिहास और विज्ञान बताओ',
        'एलोरा का कैलाश मंदिर कैसे बनाया गया?',
        'स्टूडेंट इनोवेशन के 5 बेहतरीन आइडियाज बताओ',
      ],
    };
  }

  return {
    category: 'general',
    content:
      `Namaste! I am your **BharatVirasat AI Heritage Scholar**.\n\n` +
      `I am trained to answer deep scholarly, architectural, and scientific questions regarding Indian Civilizational Heritage and Student Innovation:\n\n` +
      `• **32 UNESCO World Heritage Monuments:** Historical origins, dynastic patronage, stone masonry styles, and archaeo-astronomy secrets.\n` +
      `• **Archaeo-Astronomy & Engineering Wonders:** Solar wheel chronometry at Konark, top-down monolithic excavation at Kailasa, non-rusting Delhi Iron Pillar, and acoustic resonance at Hampi.\n` +
      `• **GI Crafts & Artisan Provenance:** Authentic production techniques, fair price guidelines, and practical tests to detect machine counterfeits.\n` +
      `• **Classical Dances & Music Traditions:** The 9 classical dances, UNESCO folk arts, Hindustani & Carnatic ragas, and traditional instruments.\n` +
      `• **Student Innovation Pass:** AI computer vision, digital acoustics preservation, and rural artisan fair-trade tech.\n\n` +
      `*Ask me anything above in English, Hindi, or Hinglish to begin!*`,
    links,
    suggestedFollowUps: [
      'Tell me about the engineering marvels of Konark and Ellora',
      'What are the best Student Innovation ideas for heritage?',
      'How to identify real vs fake Kashmiri Pashmina?',
    ],
  };
}
