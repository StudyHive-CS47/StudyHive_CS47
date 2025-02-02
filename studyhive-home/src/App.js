import React from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';
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
import linkedinIcon from './assets/linkedin-icon.png'; // Import LinkedIn icon

function App() {
    return (
        <div className="App">
            <Header />
            <main className="content">
                <section className="middle-section">
                    {/* Introduction and Features Section */}
                    <div className="intro-features-container">
                        <div className="intro-text">
                            <h2 className="section-heading large-heading">Welcome to </h2>
                            <h2 className="section-heading large-heading2">StudyHive!</h2>
                            <h2 className="section-heading large-heading3">Connect, collaborate, conquer</h2>
                            <p>
                                Welcome to Study Hive – your go-to space for easy, organized, and stress-free studying!
                                We’re here to make learning simple and enjoyable. With Study Hive, you can share notes,
                                track
                                deadlines effortlessly, and connect with classmates who are on the same journey as you.
                                Need help staying on top of everything? We’ve got tools to keep you organized and
                                motivated, so
                                you can focus on what really matters – learning and growing. Whether it’s acing your
                                exams,
                                finishing assignments, or just staying ahead, we’re here to support you every step of
                                the way.
                                Let’s make studying something you actually look forward to!
                            </p>
                        </div>
                        <div className="features-section">
                        <div className="features-grid">
                                <div className="feature-item">
                                    <img src={featureNoteSharing} alt="Note Sharing" className="feature-icon" />
                                    Note Sharing
                                </div>
                                <div className="feature-item">
                                    <img src={featureNoteSummarize} alt="Note Summarize" className="feature-icon" />
                                    Note Summarize
                                </div>
                                <div className="feature-item">
                                    <img src={featureChatbot} alt="Chatbot" className="feature-icon" />
                                    Chatbot
                                </div>
                                <div className="feature-item">
                                    <img src={featureQA} alt="Q & A" className="feature-icon" />
                                    Q & A
                                </div>
                                <div className="feature-item">
                                    <img src={featureGroupChat} alt="Group Chat" className="feature-icon" />
                                    Group Chat
                                </div>
                                <div className="feature-item">
                                    <img src={featureQuiz} alt="Quiz" className="feature-icon" />
                                    Quizzer
                                </div>
                            </div>
                            <div className="features-button-container">
                                <button className="feature-button">Explore All Features</button>
                            </div>
                        </div>
                    </div>

                    {/* Image Gallery Section */}
                    <div className="curved-box">
                        <div className="box-image-container">
                            <img src={image1} alt="Imag 1" className="box-image" />
                        </div>
                        <div className="box-image-container">
                            <img src={image2} alt="Imag 2" className="box-image" />
                        </div>
                        <div className="box-image-container">
                            <img src={image3} alt="Imag 3" className="box-image" />
                        </div>
                        <div className="box-image-container">
                            <img src={image4} alt="Imag 4" className="box-image" />
                        </div>
                    </div>

                    {/* Mission Section */}
                    <section className="mission-section">
                        <div className="mission-content">
                            <h2 className="section-heading">Our Mission</h2>
                            <p>
                                At StudyHive, our mission is to revolutionize the way students learn,
                                collaborate, and achieve academic success. We strive to provide an
                                intuitive and engaging platform that simplifies studying, encourages
                                knowledge sharing, and fosters a strong sense of academic community.
                                By integrating cutting-edge technology, AI-powered learning tools,
                                and interactive collaboration features, we aim to make education more
                                accessible, efficient, and enjoyable for students across Sri Lanka
                                and beyond. Our commitment is to empower every student with the
                                resources and support they need to excel in their academic journey
                                and beyond.
                            </p>
                        </div>
                        <img src={mission} alt="Imag 4" className="mission" />
                    </section>

                    {/* Second Image Gallery Section */}
                    <div className="curved-box">
                        <div className="box-image-container">
                            <img src={image5} alt="Imag 1" className="box-image" />
                        </div>
                        <div className="box-image-container">
                            <img src={image6} alt="Imag 2" className="box-image" />
                        </div>
                        <div className="box-image-container">
                            <img src={image7} alt="Imag 3" className="box-image" />
                        </div>
                        <div className="box-image-container">
                            <img src={image8} alt="Imag 4" className="box-image" />
                        </div>
                    </div>

                    {/* Testimonial Section */}
                    <section className="testimonial-section">
                        <h2 className="section-heading">Voices of the Hive</h2>
                        <div className="testimonial-container">
                            <div className="testimonial-box">
                                <div className="box-container">
                                    <h3 className="box-heading">"Study Hive is an exceptional platform for students! Its features like advanced keyword search, automated note summaries, and personalized resource suggestions make studying so much easier. The chatbot is incredibly helpful, and the integration with LMS keeps everything organized. This app has transformed the way I approach my studies. Highly recommended!"</h3>
                                    <p className="box-text">Senuri Hansamini</p>
                                </div>
                            </div>
                            <img src={testimonial} alt="Image 4" className="testimonial-image" />
                        </div>
                    </section>

                    {/* Team Section */}
                    <section className="team-section">
                        <h2 className="section-heading">Who We Are – The Team Behind StudyHive</h2>
                        <div className="team-grid">
                            <div className="team-member">
                                <img src={member1} alt="Imag 1" className="team-photo" />
                                <p className="team-name">Yasara Madana</p>
                                <p className="team-position">Fullstack Developer</p>
                                <a href="https://www.linkedin.com/in/yasara-madana-93263b269?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
                                    <img src={linkedinIcon} alt="LinkedIn" className="linkedin-icon" />
                                </a>
                            </div>
                            <div className="team-member">
                                <img src={member2} alt="Imag 2" className="team-photo" />
                                <p className="team-name">Rashmina Fernando</p>
                                <p className="team-position">Fullstack Developer</p>
                                <a href="" target="_blank" rel="noopener noreferrer">
                                    <img src={linkedinIcon} alt="LinkedIn" className="linkedin-icon" />
                                </a>
                            </div>
                            <div className="team-member">
                                <img src={member3} alt="Imag 3" className="team-photo" />
                                <p className="team-name">Miuni Weerasinghe</p>
                                <p className="team-position">Fullstack Developer</p>
                                <a href="https://www.linkedin.com/in/miuni-weerasinghe-1b922b270?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
                                    <img src={linkedinIcon} alt="LinkedIn" className="linkedin-icon" />
                                </a>
                            </div>
                            <div className="team-member">
                                <img src={member4} alt="Imag 4" className="team-photo" />
                                <p className="team-name">Thisakya Pathirathne</p>
                                <p className="team-position">Fullstack Developer</p>
                                <a href="https://www.linkedin.com/in/thisakya-pathirathne" target="_blank" rel="noopener noreferrer">
                                    <img src={linkedinIcon} alt="LinkedIn" className="linkedin-icon" />
                                </a>
                            </div>
                            <div className="team-member">
                                <img src={member5} alt="Imag 5" className="team-photo" />
                                <p className="team-name">Thevindu Jayakody</p>
                                <p className="team-position">Fullstack Developer</p>
                                <a href="https://www.linkedin.com/in/thevindu-jayakody-828311334?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
                                    <img src={linkedinIcon} alt="LinkedIn" className="linkedin-icon" />
                                </a>
                            </div>
                            <div className="team-member">
                                <img src={member6} alt="Imag 6" className="team-photo" />
                                <p className="team-name">Nirasha Thilakarathne</p>
                                <p className="team-position">Fullstack Developer</p>
                                <a href="https://www.linkedin.com/in/nirasha-thilakarathna-8753a2296?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer">
                                    <img src={linkedinIcon} alt="LinkedIn" className="linkedin-icon" />
                                </a>
                            </div>
                        </div>
                    </section>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default App;

