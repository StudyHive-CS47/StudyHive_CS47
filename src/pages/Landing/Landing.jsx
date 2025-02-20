
import "./Landing.css";

function LandingPage() {
    return (
        <div>
            {/* Navigation Bar */}
            <nav className="navbar">
                <h1>StudyHive</h1>
                <ul>
                    <li><a href="#about">About</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <h2>Welcome to StudyHive</h2>
                <p>The best platform for collaborative learning and note-sharing.</p>
                <a href="/signup" className="cta-button">Get Started</a>
            </header>
        </div>
    );
}

export default LandingPage;