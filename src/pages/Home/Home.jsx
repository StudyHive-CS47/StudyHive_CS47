
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import"./Home.css";

import image1 from './assets-Home/image1.jpg';
import image2 from './assets-Home/image2.jpg';
import image3 from './assets-Home/image3.jpg';
import image4 from './assets-Home/image4.jpg';
import image5 from './assets-Home/image5.jpg';
import image6 from './assets-Home/image6.jpg';
import image7 from './assets-Home/image71.jpg';
import image8 from './assets-Home/image8.jpg';
import member1 from './assets-Home/member1.png';
import member2 from './assets-Home/member2.png';
import member3 from './assets-Home/member3.png';
import member4 from './assets-Home/member4.png';
import member5 from './assets-Home/member5.png';
import mission from './assets-Home/mission.png';
import testimonial from './assets-Home/testimonial.png';
import member6 from './assets-Home/member6.png';
import featureNoteSharing from './assets-Home/feature1.png';
import featureNoteSummarize from './assets-Home/feature2.png';
import featureChatbot from './assets-Home/feature3.png';
import featureQA from './assets-Home/feature4.png';
import featureGroupChat from './assets-Home/feature5.png';
import featureQuiz from './assets-Home/feature6.png';
import linkedinIcon from './assets-Home/linkedin-icon.png'; // Import LinkedIn icon

const Homepage = () => {
    return (
            <main className="Home_content1">
                <section className="Home_middleSection">

                    <div className="Home_introFeaturesContainer">
                        <div className="Home_introText">

                        <h2 className="Home_sectionHeading Home_largeheading2">StudyHive!</h2>
                        <h2 className="Home_sectionHeading Home_largeheading3">Connect, collaborate, conquer</h2>

                            <p>
                                Hey there, future achievers! Study Hive is here to make your academic life easier, more organized, and a whole lot more fun. Whether you're prepping for exams, finishing assignments, or just trying to stay on top of your coursework, we’ve got your back. With Study Hive, you can share notes with classmates, summarize lengthy lectures in seconds, and get instant help from our AI-powered chatbot whenever you’re stuck. Need answers to tricky questions? Our Q&A forum lets you connect with peers and experts to get the clarity you need. Plus, with group chats, you can form study groups, brainstorm ideas, and stay connected with your classmates in real-time. Test your knowledge with our Quizzer feature, and never miss a deadline again with our Deadline Tracker. Everything you need – notes, resources, and tasks – stays neatly organized in one place, so you can focus on what really matters: learning and growing. Study Hive isn’t just an app; it’s your personal study assistant, here to make studying something you actually look forward to. Let’s ace this together – dive into Study Hive today and join the hive of achievers!
                            </p>
                        </div>
                        <div className="Home_featuresSection">
                            <div className="Home_featuresGrid">
                                <div className="Home_featureItem">
                                    <img src={featureNoteSharing} alt="Note Sharing" className="Home_featureIcon"/>
                                    Note Sharing
                                </div>
                                <div className="Home_featureItem">
                                    <img src={featureNoteSummarize} alt="Note Summarize" className="Home_featureIcon"/>
                                    Note Summarize
                                </div>
                                <div className="Home_featureItem">
                                    <img src={featureChatbot} alt="Chatbot" className="Home_featureIcon"/>
                                    Chatbot
                                </div>
                                <div className="Home_featureItem">
                                    <img src={featureQA} alt="Q & A" className="Home_featureIcon"/>
                                    Q & A
                                </div>
                                <div className="Home_featureItem">
                                    <img src={featureGroupChat} alt="Group Chat" className="Home_featureIcon"/>
                                    Group Chat
                                </div>
                                <div className="Home_featureItem">
                                    <img src={featureQuiz} alt="Quiz" className="Home_featureIcon"/>
                                    Quizzer
                                </div>
                            </div>
                            <div className="Home_featuresButtonContainer">
                                <button className="Home_featureButton">Explore All Features</button>
                            </div>
                        </div>
                    </div>

                    {/* Image Gallery Section */}
                    <div className="Home_curvedBox">
                        <div className="Home_boxImageContainer">
                            <img src={image1} alt="Imag 1" className="Home_boxImage"/>
                        </div>
                        <div className="Home_boxImageContainer">
                            <img src={image2} alt="Imag 2" className="Home_boxImage"/>
                        </div>
                        <div className="Home_boxImageContainer">
                            <img src={image3} alt="Imag 3" className="Home_boxImage"/>
                        </div>
                        <div className="Home_boxImageContainer">
                            <img src={image4} alt="Imag 4" className="Home_boxImage"/>
                        </div>
                    </div>

                    {/* Mission Section */}
                    <section className="Home_missionSection">
                        <div className="Home_missionContent">
                            <h2 className="Home_sectionHeading">Our Mission</h2>
                            <p>
                                At StudyHive, we are on a mission to transform the future of education by revolutionizing the way students learn, collaborate, and achieve their fullest potential. We believe that every student deserves the tools, resources, and support to thrive in their academic journey and beyond.

                                Our vision is to create a global learning ecosystem that breaks down barriers to education, making it more accessible, engaging, and effective for students everywhere. By integrating cutting-edge technology, AI-powered learning tools, and innovative collaboration features, we empower students to take control of their education, turning challenges into opportunities and dreams into reality.

                                We are committed to:

                                Simplifying Studying: From note-sharing and summarization to AI-driven assistance, we make learning intuitive and stress-free.

                                Fostering Collaboration: Building a vibrant academic community where students can connect, share knowledge, and grow together.

                                Empowering Success: Providing the tools and resources students need to excel in their studies, careers, and personal growth.

                                StudyHive is more than just a platform – it’s a movement to redefine education for the modern world. We are dedicated to empowering students across Sri Lanka and beyond, helping them unlock their potential and achieve greatness. Together, let’s build a future where learning knows no limits.
                            </p>
                        </div>
                        <img src={mission} alt="Imag 4" className="Home_mission"/>
                    </section>


                    <div className="Home_curvedBox">
                        <div className="Home_boxImageContainer">
                            <img src={image5} alt="Imag 1" className="Home_boxImage"/>
                        </div>
                        <div className="Home_boxImageContainer">
                            <img src={image6} alt="Imag 2" className="Home_boxImage"/>
                        </div>
                        <div className="Home_boxImageContainer">
                            <img src={image7} alt="Imag 3" className="Home_boxImage"/>
                        </div>
                        <div className="Home_boxImageContainer">
                            <img src={image8} alt="Imag 4" className="Home_boxImage"/>
                        </div>
                    </div>

                    {/* Testimonial Section */}
                    <section className="Home_testimonialSection">
                        <h2 className="Home_sectionHeading">Voices of the Hive</h2>
                        <div className="Home_testimonialContaine">
                            <div className="Home_testimonialBox">
                                <div className="Home_boxContainer">
                                    <h3 className="Home_boxHeading">"Study Hive is an exceptional platform for students! Its
                                        features like advanced keyword search, automated note summaries, and
                                        personalized resource suggestions make studying so much easier. The chatbot is
                                        incredibly helpful, and the integration with LMS keeps everything organized.
                                        This app has transformed the way I approach my studies. Highly
                                        recommended!"</h3>
                                    <p className="Home_boxText">Senuri Hansamini</p>
                                </div>
                            </div>
                            <img src={testimonial} alt="Image 4" className="Home_testimonialImage"/>
                        </div>
                    </section>

                    {/* Team Section */}
                    <section className="Home_teamSection">
                        <h2 className="Home_teamsectionHeading">About Us</h2>
                        <div className="Home_teamGrid">
                            <div className="Home_teamMember">
                                <img src={member1} alt="Imag 1" className="Home_teamPhoto"/>
                                <p className="Home_teamName">Yasara Madana</p>
                                <p className="Home_teamPosition">Fullstack Developer</p>
                                <a href="https://www.linkedin.com/in/yasara-madana-93263b269?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                                   target="_blank" rel="noopener noreferrer">
                                    <img src={linkedinIcon} alt="LinkedIn" className="Home_linkedinIcon"/>
                                </a>
                            </div>
                            <div className="Home_teamMember">
                                <img src={member2} alt="Imag 2" className="Home_teamPhoto"/>
                                <p className="Home_teamName">Rashmina Fernando</p>
                                <p className="Home_teamPosition">Fullstack Developer</p>
                                <a href="https://www.linkedin.com/in/rashminafernando" target="_blank"
                                   rel="noopener noreferrer">
                                    <img src={linkedinIcon} alt="LinkedIn" className="Home_linkedinIcon"/>
                                </a>
                            </div>
                            <div className="Home_teamMember">
                                <img src={member3} alt="Imag 3" className="Home_teamPhoto"/>
                                <p className="Home_teamName">Miuni Weerasinghe</p>
                                <p className="Home_teamPosition">Fullstack Developer</p>
                                <a href="https://www.linkedin.com/in/miuni-weerasinghe-1b922b270?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                                   target="_blank" rel="noopener noreferrer">
                                    <img src={linkedinIcon} alt="LinkedIn" className="Home_linkedinIcon"/>
                                </a>
                            </div>
                            <div className="Home_teamMember">
                                <img src={member4} alt="Imag 4" className="Home_teamPhoto"/>
                                <p className="Home_teamName">Thisakya Pathirathne</p>
                                <p className="Home_teamPosition">Fullstack Developer</p>
                                <a href="https://www.linkedin.com/in/thisakya-pathirathne-a61720273" target="_blank"
                                   rel="noopener noreferrer">
                                    <img src={linkedinIcon} alt="LinkedIn" className="Home_linkedinIcon"/>
                                </a>
                            </div>
                            <div className="Home_teamMember">
                                <img src={member5} alt="Imag 5" className="Home_teamPhoto"/>
                                <p className="Home_teamName">Thevindu Jayakody</p>
                                <p className="Home_teamPosition">Fullstack Developer</p>
                                <a href="https://www.linkedin.com/in/thevindu-jayakody-828311334?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                                   target="_blank" rel="noopener noreferrer">
                                    <img src={linkedinIcon} alt="LinkedIn" className="Home_linkedinIcon"/>
                                </a>
                            </div>
                            <div className="Home_teamMember">
                                <img src={member6} alt="Imag 6" className="Home_teamPhoto"/>
                                <p className="Home_teamName">Nirasha Thilakarathne</p>
                                <p className="Home_teamPosition">Fullstack Developer</p>
                                <a href="https://www.linkedin.com/in/nirasha-thilakarathna-8753a2296?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                                   target="_blank" rel="noopener noreferrer">
                                    <img src={linkedinIcon} alt="LinkedIn" className="Home_linkedinIcon"/>
                                </a>
                            </div>
                        </div>
                    </section>
                </section>
            </main>


    );
}

export default Homepage;