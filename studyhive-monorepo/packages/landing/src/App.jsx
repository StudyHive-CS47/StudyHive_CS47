import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from './components/LandingHeader';
import './App.css';
// Import all images
import logo from './assets/logo.png';
import noteSharing from './assets/note-sharing.png';
import groupChat from './assets/group-chat.png';
import qaBoard from './assets/qa-board.png';
import shortNotes from './assets/short-notes.png';
import chatbot from './assets/chatbot.png';
import calendar from './assets/calendar.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';
import Pattern from './components/Pattern';
import AnimatedCard from './components/AnimatedCard';
import CreativeCard from './components/CreativeCard';
// Import the profile images at the top of the file
import kavindi from './assets/Kavindi.jpg';
import malith from './assets/Malith.jpg';
import dilini from './assets/Dilini.jpeg';
import AnimatedStartButton from './components/AnimatedStartButton';
import WatchDemoButton from './components/WatchDemoButton';
import TeamCard from './components/TeamCard';
import yasara from './assets/yasara.png';
import rashmina from './assets/rashmina.png';
import miuni from './assets/miuni.png';
import nirasha from './assets/nirasha.png';
import thevindu from './assets/thevindu.png';
import thisakya from './assets/thisakya.png';
import { Footer } from '@shared';

function App() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Seamless Note Sharing",
      description: "Your perfect tool to collaborate together! Share and access notes instantly.",
      image: noteSharing,
      buttonText: "Start sharing notes",
      route: "/note-sharing"
    },
    {
      title: "Group Chat for Study Sessions",
      description: "Connect with your classmates in real-time! Create study groups effortlessly.",
      image: groupChat,
      buttonText: "Create chat",
      route: "/group-chat"
    },
    {
      title: "Interactive Q&A Board",
      description: "Ask questions, get answers, and learn together with your peers.",
      image: qaBoard,
      buttonText: "Start discussing",
      route: "/q-and-a"
    },
    {
      title: "Automated Short Notes",
      description: "Let AI help you create concise and effective study materials.",
      image: shortNotes,
      buttonText: "Summarize",
      route: "/summarize-ai"
    },
    {
      title: "24/7 Smart Chatbot",
      description: "Your personal study assistant, always ready to help.",
      image: chatbot,
      buttonText: "Chat AI",
      route: "/chat-bot"
    },
    {
      title: "Smart Deadline Calendar",
      description: "Stay organized and never miss important deadlines.",
      image: calendar,
      buttonText: "Open Calendar",
      route: "/calendar"
    }
  ];

  // Then update the testimonials data to use the imported images
  const testimonials = [
    {
      name: "Kavindi Rajapakse",
      role: "Computer Science Student",
      image: kavindi,
      message: "StudyHive has completely transformed my learning journey! The collaborative features make group projects so much easier, and the AI assistant is like having a 24/7 tutor.",
      stars: 5
    },
    {
      name: "Malith Perera",
      role: "Medical Student",
      image: malith,
      message: "The automated note summarization feature has saved me countless hours of study time. The deadline calendar helps me stay organized during hectic exam periods.",
      stars: 5
    },
    {
      name: "Dilini Fernando",
      role: "Law Student",
      image: dilini,
      message: "The Q&A board is fantastic for getting quick help from peers. StudyHive has made the remote learning experience much more interactive and engaging.",
      stars: 5
    }
  ];

  // Add team data
  const teamMembers = [
    {
      name: "Yasara Madana",
      image: yasara,
      linkedinUrl: "https://www.linkedin.com/in/yasara-madana-93263b269"
    },
    {
      name: "Rashmina Fernando",
      image: rashmina,
      linkedinUrl: "https://www.linkedin.com/in/rashminafernando"
    },
    {
      name: "Miuni Weerasinghe",
      image: miuni,
      linkedinUrl: "https://www.linkedin.com/in/miuni-weerasinghe-1b922b270"
    },
    {
      name: "Nirasha Thilakarathna",
      image: nirasha,
      linkedinUrl: "https://www.linkedin.com/in/nirasha-thilakarathna-8753a2296"
    },
    {
      name: "Thevindu Jayakody",
      image: thevindu,
      linkedinUrl: "https://www.linkedin.com/in/thevindu-jayakody-828311334"
    },
    {
      name: "Thisakya Pathirathne",
      image: thisakya,
      linkedinUrl: "https://www.linkedin.com/in/thisakya-pathirathne-a61720273"
    }
  ];

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-[#EEF4FE] flex flex-col">
      <Pattern className="fixed inset-0" />
      
      <div className="relative z-10 flex-grow w-full">
        <LandingHeader />

        {/* Hero Section */}
        <section className="relative pt-20 pb-16 w-full">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1A237E] mb-6">
                Your go-to space for<br />
                <span className="relative inline-block">
                  stress-free
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-[#4051B5] opacity-20 -z-10"></span>
                </span>, collaborative<br />
                learning!
              </h1>
              <p className="text-xl text-[#1A237E]/70 max-w-2xl mb-10">
                Study might not be the most exciting word in your vocabulary, but here's the deal: 
                You've got to do it one way or another. Why not make it fun and collaborative?
              </p>
              <div className="flex gap-8">
                <AnimatedStartButton />
                <WatchDemoButton />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-8 w-full">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">
              Everything you need to study <span className="text-[#1A237E]">Smarter</span>
            </h2>
            
            {/* 3x2 Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-[1400px] mx-auto">
              {features.map((feature, index) => (
                <CreativeCard
                  key={index}
                  {...feature}
                  className="transform hover:-translate-y-2 transition-transform duration-300"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 w-full bg-gradient-to-b from-[#EEF4FE] to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[#1A237E] mb-16">
              What our students say
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div key={index} 
                     className="bg-white p-8 rounded-2xl shadow-[0_20px_30px_-20px_rgba(26,35,126,0.15)] 
                                transform hover:-translate-y-2 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-[#1A237E]">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex gap-0.5 text-[#4051B5]">
                        {[...Array(testimonial.stars)].map((_, i) => (
                          <svg key={i} fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="mt-1 text-lg font-semibold text-[#1A237E]">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-[#1A237E]/70">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-[#1A237E]/80 leading-relaxed">
                    {testimonial.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 w-full bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[#1A237E]">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex justify-center">
                  <TeamCard {...member} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default App;