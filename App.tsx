import React, { useRef, useState, useEffect } from 'react';
import ChatIcon from './components/icons/ChatIcon';
import CalendarIcon from './components/icons/CalendarIcon';
import SparkleIcon from './components/icons/SparkleIcon';
import LinkIcon from './components/icons/LinkIcon';
import CpuIcon from './components/icons/CpuIcon';
import SyncIcon from './components/icons/SyncIcon';
import CheckCircleIcon from './components/icons/CheckCircleIcon';
import ClockIcon from './components/icons/ClockIcon';
import ZapIcon from './components/icons/ZapIcon';
import ShieldIcon from './components/icons/ShieldIcon';
import { sendMessageToLambda } from './components/MessageHandler';
import LoaderIcon from './components/icons/LoaderIcon';

const benefits = [
  {
    icon: CheckCircleIcon,
    title: 'Stay Organized',
    description: 'Juggling classes, clubs, and social life is tough. Evento.ai ensures no deadline or party is ever forgotten.',
  },
  {
    icon: ClockIcon,
    title: 'Save Time',
    description: 'Stop manually creating calendar events. Our AI does the tedious work so you can focus on what matters.',
  },
  {
    icon: ShieldIcon,
    title: 'Reduce Stress',
    description: 'Less worrying about missing study groups or social events. Automating your schedule frees up mental space.',
  },
  {
    icon: ZapIcon,
    title: 'Seamless Integration',
    description: 'Works in the background without any effort from you after the initial setup. It\'s set-and-forget easy.',
  },
];

// Custom hook to detect when an element is on screen
const useOnScreen = (ref: React.RefObject<HTMLElement>, options?: IntersectionObserverInit) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return isIntersecting;
};


const App: React.FC = () => {
  const worksHeaderRef = useRef<HTMLDivElement>(null);
  const worksGridRef = useRef<HTMLDivElement>(null);
  const helpsHeaderRef = useRef<HTMLDivElement>(null);

  const isWorksHeaderVisible = useOnScreen(worksHeaderRef, { threshold: 0.1 });
  const isWorksGridVisible = useOnScreen(worksGridRef, { threshold: 0.1 });
  const isHelpsHeaderVisible = useOnScreen(helpsHeaderRef, { threshold: 0.1 });

  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const handleSyncGroupMe = async () => {
    setIsSyncing('groupme');
    const message = "This is a test message to confirm the GroupMe sync is working!";
    try {
      console.log('Sending message to sync GroupMe...');
      const data = await sendMessageToLambda(message);
      console.log('Response from lambda:', data);
      
      const responseMessage = data.message || 'Check console for full response.';
      alert(`✅ Sync complete! AI response: ${responseMessage}`);

    } catch (error) {
      console.error('Error syncing with GroupMe:', error);
      alert(`⚠️ Error syncing with GroupMe: ${(error as Error).message}`);
    } finally {
      setIsSyncing(null);
    }
  };

  const syncGoogleCalendar = async () => {
    setIsSyncing('calendar');
    const message = "Team meeting tomorrow at 6pm in Rauch 101";
    try {
      console.log('Sending message to sync Google Calendar...');
      const data = await sendMessageToLambda(message);
      console.log('Response from lambda:', data);

      const responseMessage = data.message || JSON.stringify(data);

      if (responseMessage.toLowerCase().includes('event added')) {
          alert(`✅ Event added to calendar!`);
      } else if (responseMessage.toLowerCase().includes('no event found')) {
          alert(`⚠️ No event found in the message.`);
      } else {
          alert(`✅ Sync complete! AI Response: ${responseMessage}`);
      }

    } catch (error) {
      console.error('Error syncing Google Calendar:', error);
      alert(`⚠️ Error syncing Google Calendar: ${(error as Error).message}`);
    } finally {
      setIsSyncing(null);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0B1D35] text-white overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
         <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500 rounded-full opacity-30 blur-3xl"></div>
         <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-800 rounded-full opacity-30 blur-3xl"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#004d60] rounded-full opacity-40 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="py-8 px-6 md:px-8">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold tracking-wider">
              evento<span className="text-cyan-400">.ai</span>
            </h1>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center">
          <div className="container mx-auto text-center py-12 px-6 md:px-8">
            <h2 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6 animate-fade-in-down">
              Never Miss an Event Again.
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-in-up">
              AI-powered integration that reads your GroupMe messages and automatically adds detected events to your Google Calendar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button 
                onClick={handleSyncGroupMe}
                disabled={!!isSyncing}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-cyan-400 text-black font-bold rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:bg-cyan-300 hover:scale-105 transform focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:bg-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100"
              >
                {isSyncing === 'groupme' ? (
                  <>
                    <LoaderIcon className="w-6 h-6" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <ChatIcon className="w-6 h-6" strokeWidth={2}/>
                    <span>Sync GroupMe</span>
                  </>
                )}
              </button>
              <button 
                onClick={syncGoogleCalendar}
                disabled={!!isSyncing}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#1E3A8A] text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all duration-300 hover:bg-blue-800 hover:scale-105 transform focus:outline-none focus:ring-4 focus:ring-blue-500 disabled:bg-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100"
              >
                 {isSyncing === 'calendar' ? (
                  <>
                    <LoaderIcon className="w-6 h-6" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <CalendarIcon className="w-6 h-6" strokeWidth={2}/>
                    <span>Sync Google Calendar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>

      <div className="relative z-10">
        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 sm:py-24 px-6 md:px-8">
          <div className="container mx-auto text-center" ref={worksHeaderRef}>
            <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 transition-all duration-700 ${isWorksHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>How It Works</h2>
            <p className={`text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-16 transition-all duration-700 delay-200 ${isWorksHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              Three simple steps to automate your student life schedule.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" ref={worksGridRef}>
              <div className={`bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-500 ${isWorksGridVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-400/10 mb-6 mx-auto">
                  <LinkIcon className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">1. Connect Accounts</h3>
                <p className="text-gray-400">
                  Securely link your GroupMe and Google Calendar. Your privacy is our priority.
                </p>
              </div>
              <div className={`bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-500 delay-200 ${isWorksGridVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
                 <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-400/10 mb-6 mx-auto">
                  <CpuIcon className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">2. AI Scans Chats</h3>
                <p className="text-gray-400">
                  Our smart AI monitors your chats, identifying event details like dates, times, and locations.
                </p>
              </div>
              <div className={`bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-500 delay-400 ${isWorksGridVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
                 <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-400/10 mb-6 mx-auto">
                  <SyncIcon className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">3. Events Auto-Synced</h3>
                <p className="text-gray-400">
                  Detected events are automatically added to your Google Calendar. Never miss a thing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Helps Section */}
        <section id="features" className="py-20 sm:py-24 bg-black/10">
           <div className="container mx-auto text-center" ref={helpsHeaderRef}>
              <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 transition-all duration-700 ${isHelpsHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>How It Helps</h2>
              <p className={`text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-16 transition-all duration-700 delay-200 ${isHelpsHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                Designed to make student life easier, one event at a time.
              </p>
           </div>
           <div className="relative w-full overflow-hidden mask-image-gradient">
              <div className="flex animate-marquee hover-pause">
                 {[...benefits, ...benefits].map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                       <div key={index} className="flex-shrink-0 w-[80vw] md:w-[40vw] lg:w-[30vw] p-6 mx-4">
                          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm h-full flex flex-col">
                             <Icon className="w-10 h-10 text-cyan-400 mb-6" />
                             <h3 className="text-3xl font-bold mb-4">{benefit.title}</h3>
                             <p className="text-gray-400 text-lg">
                                {benefit.description}
                             </p>
                          </div>
                       </div>
                    );
                 })}
              </div>
           </div>
        </section>

        <footer className="py-8 text-center text-gray-400 text-sm bg-[#0B1D35]">
          <p>© {new Date().getFullYear()} Evento.ai. All rights reserved.</p>
        </footer>
      </div>
      
      <div className="absolute top-1/2 -translate-y-1/2 right-0 hidden lg:block z-20">
        <div className="bg-[#1a1a1a] p-3 rounded-l-lg shadow-lg">
           <SparkleIcon className="w-6 h-6 text-yellow-400" />
        </div>
      </div>
       <style>{`
          @keyframes fade-in-down {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
          .animate-fade-in-up { animation: fade-in-up 0.8s ease-out 0.2s forwards; }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          .hover-pause:hover {
            animation-play-state: paused;
          }
          .mask-image-gradient {
            -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
            mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          }
        `}</style>
    </div>
  );
};

export default App;