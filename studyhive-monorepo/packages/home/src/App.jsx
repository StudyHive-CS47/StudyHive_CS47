import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Footer, routes } from '@shared';
import './App.css';
import image1 from './assets/image1.jpg';
import image2 from './assets/image2.jpg';
import image3 from './assets/image3.jpg';
import image4 from './assets/image4.jpg';
import image5 from './assets/image5.jpg';
import image6 from './assets/image6.jpg';
import image7 from './assets/image71.jpg';
import image8 from './assets/image8.jpg';
import member1 from './assets/member1.png';
import member2 from './assets/member2.png';
import member3 from './assets/member3.png';
import member4 from './assets/member4.png';
import member5 from './assets/member5.png';
import mission from './assets/mission.png';
import testimonial from './assets/testimonial.png';
import member6 from './assets/member6.png';
import featureNoteSharing from './assets/feature1.png';
import featureNoteSummarize from './assets/feature2.png';
import featureChatbot from './assets/feature3.png';
import featureQA from './assets/feature4.png';
import featureGroupChat from './assets/feature5.png';
import featureQuiz from './assets/feature6.png';
import linkedinIcon from './assets/linkedin-icon.png';
import senuri from './assets/senuri.jpg';

// Styled Feature Card Component
const StyledFeatureCard = styled.div`
  .card {
    position: relative;
    width: 100%;
    min-height: 260px;
    border-radius: 16px;
    z-index: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    transition: all 0.3s ease;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    cursor: pointer;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      transition: all 0.3s ease;
    }

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);

      &::before {
        background: rgba(0, 0, 0, 0.45);
      }

      .content {
        transform: translateY(-3px);
      }

      h3 {
        color: #ffffff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      p {
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }

  .content {
    position: relative;
    z-index: 3;
    text-align: center;
    transition: all 0.3s ease;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 0.75rem;
  }

  .blob {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background-color: ${props => props.$blobColor || '#000000'};
    opacity: 0.15;
    filter: blur(20px);
    animation: blob-float 8s infinite ease-in-out;
  }

  h3 {
    transition: all 0.3s ease;
  }

  p {
    transition: all 0.3s ease;
  }

  @keyframes blob-float {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.1);
    }
  }
`;

const TestimonialCard = styled.div`
  .card {
    background-color: rgba(243, 244, 246, 1);
    padding: 2rem;
    max-width: 420px;
    border-radius: 10px;
    box-shadow: 0 20px 30px -20px rgba(5, 5, 5, 0.24);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 25px 35px -20px rgba(5, 5, 5, 0.28);
    }
  }

  .header {
    display: flex;
    align-items: center;
    grid-gap: 1rem;
    gap: 1rem;
  }

  .header .image {
    height: 4rem;
    width: 4rem;
    border-radius: 9999px;
    object-fit: cover;
    background-image: url(${props => props.$reviewerImage || 'none'});
    background-size: cover;
    background-position: center;
  }

  .stars {
    display: flex;
    justify-content: center;
    grid-gap: 0.125rem;
    gap: 0.125rem;
    color: rgba(34, 197, 94, 1);
  }

  .stars svg {
    height: 1rem;
    width: 1rem;
  }

  .name {
    margin-top: 0.25rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 600;
    color: rgba(55, 65, 81, 1);
  }

  .role {
    font-size: 0.875rem;
    color: #3B82F6;
  }

  .message {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    margin-top: 1rem;
    color: rgba(107, 114, 128, 1);
    line-height: 1.6;
  }
`;

// Feature Card Component
function FeatureCard({ icon, title, description, blobColor, path }) {
    return (
        <Link to={path} className="block">
            <StyledFeatureCard $blobColor={blobColor}>
                <div className="card" style={{ backgroundImage: `url(${icon})` }}>
                    <div className="blob" />
                    <div className="content">
                        <h3 className="text-xl font-semibold text-white mb-3 w-full">{title}</h3>
                        <p className="text-gray-200 text-base leading-relaxed w-full">{description}</p>
                    </div>
                </div>
            </StyledFeatureCard>
        </Link>
    );
}

function App() {
    return (
        <div className="relative min-h-screen bg-[#EEF4FE]">
            {/* Hero Section */}
            <section className="w-full bg-transparent py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8">
                            Welcome to <span className="text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                                StudyHive</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                            Connect, collaborate, and conquer your academic goals with StudyHive's comprehensive learning platform.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="w-full py-20 bg-gradient-to-b from-white/50 to-white/30 backdrop-blur-lg">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Features</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                        <FeatureCard 
                            icon={featureNoteSharing} 
                            title="Note Sharing" 
                            description="Share and access study materials easily"
                            blobColor="#4F46E5"
                            path={routes.protected.notesharing}
                        />
                        <FeatureCard 
                            icon={featureNoteSummarize} 
                            title="Note Summarize" 
                            description="Get AI-powered note summaries"
                            blobColor="#EC4899"
                            path={routes.protected.summarizer}
                        />
                        <FeatureCard 
                            icon={featureChatbot} 
                            title="ChatBot" 
                            description="24/7 study assistance"
                            blobColor="#10B981"
                            path={routes.protected.chatbot}
                        />
                        <FeatureCard 
                            icon={featureQA} 
                            title="Q & A" 
                            description="Get answers to your questions"
                            blobColor="#F59E0B"
                            path={routes.protected.qna}
                        />
                        <FeatureCard 
                            icon={featureGroupChat} 
                            title="Group Chat" 
                            description="Collaborate with peers"
                            blobColor="#6366F1"
                            path={routes.protected.groupchat}
                        />
                        <FeatureCard 
                            icon={featureQuiz} 
                            title="Quizzer" 
                            description="Test your knowledge"
                            blobColor="#EF4444"
                            path={routes.protected.quiz}
                        />
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="w-full py-20 bg-transparent">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:flex lg:items-center lg:gap-12 max-w-6xl mx-auto">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                At StudyHive, our mission is to revolutionize the way students learn,
                                collaborate, and achieve academic success. We strive to provide an
                                intuitive and engaging platform that simplifies studying, encourages
                                knowledge sharing, and fosters a strong sense of academic community.
                            </p>
                        </div>
                        <div className="mt-8 lg:mt-0 lg:w-1/2">
                            <div className="relative rounded-xl overflow-hidden shadow-lg">
                                <img 
                                    src={mission} 
                                    alt="Our Mission" 
                                    className="w-full h-auto transform transition-transform duration-500 hover:scale-103 object-cover"
                                    style={{ maxHeight: '400px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="w-full py-20 bg-gradient-to-b from-white/30 to-white/50 backdrop-blur-lg">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-3">Meet Our Team</h2>
                    <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                        Dedicated professionals working together to create the best learning experience for you.
                    </p>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                        <TeamMember 
                            image={member1} 
                            name="Yasara Madana" 
                            role="Fullstack Developer"
                            linkedin="https://www.linkedin.com/in/yasara-madana-93263b269"
                        />
                        <TeamMember 
                            image={member2} 
                            name="Rashmina Fernando" 
                            role="Fullstack Developer"
                            linkedin="https://www.linkedin.com/in/rashminafernando"
                        />
                        <TeamMember 
                            image={member3} 
                            name="Miuni Weerasinghe" 
                            role="Fullstack Developer"
                            linkedin="https://www.linkedin.com/in/miuni-weerasinghe-1b922b270"
                        />
                        <TeamMember 
                            image={member4} 
                            name="Thisakya Pathirathne" 
                            role="Fullstack Developer"
                            linkedin="https://www.linkedin.com/in/thisakya-pathirathne-a61720273"
                        />
                        <TeamMember 
                            image={member5} 
                            name="Thevindu Jayakody" 
                            role="Fullstack Developer"
                            linkedin="https://www.linkedin.com/in/thevindu-jayakody-828311334"
                        />
                        <TeamMember 
                            image={member6} 
                            name="Nirasha Thilakarathne" 
                            role="Fullstack Developer"
                            linkedin="https://www.linkedin.com/in/nirasha-thilakarathna-8753a2296"
                        />
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="w-full py-20 bg-gradient-to-b from-white/50 to-white/30 backdrop-blur-lg">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">Voices of the Hive</h2>
                    <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                        Hear what our community has to say about their experience with StudyHive.
                    </p>
                    <div className="lg:flex lg:items-center lg:gap-12 max-w-6xl mx-auto">
                        <div className="lg:w-1/2">
                            <TestimonialCard $reviewerImage={senuri}>
                                <div className="card">
                                    <div className="header">
                                        <div className="image" />
                                        <div>
                                            <div className="stars">
                                                <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </div>
                                            <p className="name">Senuri Hansamini</p>
                                            <p className="role">Student</p>
                                        </div>
                                    </div>
                                    <p className="message">
                                        "Study Hive is an exceptional platform for students! Its features like advanced keyword search,
                                        automated note summaries, and personalized resource suggestions make studying so much easier.
                                        The chatbot is incredibly helpful, and the integration with LMS keeps everything organized.
                                        This app has transformed the way I approach my studies. Highly recommended!"
                                    </p>
                                </div>
                            </TestimonialCard>
                        </div>
                        <div className="mt-8 lg:mt-0 lg:w-1/2">
                            <div className="relative rounded-xl overflow-hidden shadow-lg flex justify-center items-center">
                                <img 
                                    src={testimonial} 
                                    alt="Testimonial" 
                                    className="w-full h-auto transform transition-transform duration-500 hover:scale-103 object-cover"
                                    style={{ maxHeight: '350px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

// Team Member Component
function TeamMember({ image, name, role, linkedin }) {
    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 transform transition-all duration-300 hover:scale-102 hover:shadow-lg flex flex-col items-center justify-center text-center">
            <div className="relative mb-4 flex justify-center">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-blue-50">
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                </div>
            </div>
            <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
                <p className="text-blue-600 text-sm font-medium mb-4">{role}</p>
                <a 
                    href={linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors duration-300"
                >
                    <img src={linkedinIcon} alt="LinkedIn" className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
}

export default App;

