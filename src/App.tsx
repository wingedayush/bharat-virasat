import { useState } from 'react';
import { useRouter } from '@/hooks/useRouter';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { UnescoPage } from '@/pages/UnescoPage';
import { ExplorePage } from '@/pages/ExplorePage';
import { StateDetailPage } from '@/pages/StateDetailPage';
import { CraftDetailPage } from '@/pages/CraftDetailPage';
import { ArtisansPage, ArtisanDetailPage } from '@/pages/ArtisansPage';
import { QuizPage } from '@/pages/QuizPage';
import { JourneyPage } from '@/pages/JourneyPage';
import { ComparePage } from '@/pages/ComparePage';
import { ReelsPage } from '@/pages/ReelsPage';
import { IdentifyPage } from '@/pages/IdentifyPage';
import { AskBharatPage } from '@/pages/AskBharatPage';
import { NearMePage } from '@/pages/NearMePage';
import { LoginPage } from '@/pages/LoginPage';
import { AsiPortalPage } from '@/pages/AsiPortalPage';
import { Monument3DPage } from '@/pages/Monument3DPage';
import { HeritageAudioPlayer } from '@/components/HeritageAudioPlayer';
import { GlobalAIChatWidget } from '@/components/GlobalAIChatWidget';

function App() {
  const route = useRouter();
  const [currentNarration, setCurrentNarration] = useState<{ title: string; text: string; location?: string } | null>(null);

  const handlePlayAudioGuide = (title: string, text: string, location?: string) => {
    setCurrentNarration({ title, text, location });
  };

  let page;
  switch (route.name) {
    case 'home':
      page = <HomePage onPlayAudioGuide={handlePlayAudioGuide} />;
      break;
    case 'unesco':
      page = <UnescoPage onPlayAudioGuide={handlePlayAudioGuide} />;
      break;
    case 'asi':
      page = <AsiPortalPage />;
      break;
    case '3d-view':
      page = <Monument3DPage onPlayAudioGuide={handlePlayAudioGuide} />;
      break;
    case 'explore':
      page = <ExplorePage />;
      break;
    case 'state-detail':
      page = <StateDetailPage stateId={route.stateId} />;
      break;
    case 'craft-detail':
      page = <CraftDetailPage craftId={route.craftId} />;
      break;
    case 'artisans':
      page = <ArtisansPage />;
      break;
    case 'artisan-detail':
      page = <ArtisanDetailPage artisanId={route.artisanId} />;
      break;
    case 'quiz':
      page = <QuizPage />;
      break;
    case 'journey':
      page = <JourneyPage />;
      break;
    case 'compare':
      page = <ComparePage />;
      break;
    case 'reels':
      page = <ReelsPage />;
      break;
    case 'identify':
      page = <IdentifyPage />;
      break;
    case 'ask-bharat':
      page = <AskBharatPage />;
      break;
    case 'near-me':
      page = <NearMePage />;
      break;
    case 'login':
      page = <LoginPage />;
      break;
    default:
      page = <HomePage onPlayAudioGuide={handlePlayAudioGuide} />;
  }

  return (
    <div className="min-h-screen bg-stone-950">
      <Navbar />
      {page}
      <Footer />
      {/* Global Floating Heritage AI (ChatGPT / Gemini) Widget */}
      {route.name !== 'ask-bharat' && <GlobalAIChatWidget />}

      {/* Persistent Global Heritage Audio Player & Voice Guide */}
      <HeritageAudioPlayer
        currentNarration={currentNarration}
        onClearNarration={() => setCurrentNarration(null)}
      />
    </div>
  );
}

export default App;
