import PropTypes from 'prop-types';
import styled from 'styled-components';

const TeamCard = ({ name, image, linkedinUrl }) => {
  return (
    <StyledWrapper>
      <div className="card-client">
        <div className="user-picture">
          <img src={image} alt={name} className="profile-img" />
        </div>
        <p className="name-client">
          {name}
          <span>Role Coming Soon</span>
        </p>
        <div className="social-media">
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="linkedin-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
            </svg>
            <span className="tooltip-social">LinkedIn</span>
          </a>
        </div>
      </div>
    </StyledWrapper>
  );
}

TeamCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  linkedinUrl: PropTypes.string.isRequired
};

const StyledWrapper = styled.div`
  .card-client {
    background: #EEF4FE;
    width: 13rem;
    padding: 25px 20px;
    border: 4px solid #1A237E;
    box-shadow: 0 6px 10px rgba(26, 35, 126, 0.15);
    border-radius: 10px;
    text-align: center;
    color: #1A237E;
    font-family: "Poppins", sans-serif;
    transition: all 0.3s ease;
  }

  .card-client:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 20px rgba(26, 35, 126, 0.2);
  }

  .user-picture {
    overflow: hidden;
    width: 7rem;
    height: 7rem;
    border: 4px solid #1A237E;
    border-radius: 999px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
  }

  .profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .name-client {
    margin: 0;
    margin-top: 20px;
    font-weight: 600;
    font-size: 18px;
  }

  .name-client span {
    display: block;
    font-weight: 200;
    font-size: 16px;
    margin-top: 8px;
    color: #4051B5;
  }

  .social-media {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .social-media:before {
    content: " ";
    display: block;
    width: 100%;
    height: 2px;
    margin: 20px 0;
    background: #1A237E;
    position: absolute;
    top: -20px;
  }

  .social-media a {
    position: relative;
    text-decoration: none;
    color: #1A237E;
    display: flex;
    justify-content: center;
  }

  .social-media a svg {
    width: 1.5rem;
    fill: currentColor;
  }

  .tooltip-social {
    background: #1A237E;
    display: block;
    position: absolute;
    bottom: 0;
    left: 50%;
    padding: 0.5rem 0.4rem;
    border-radius: 5px;
    font-size: 0.8rem;
    font-weight: 600;
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -90%);
    transition: all 0.2s ease;
    z-index: 1;
    color: white;
  }

  .tooltip-social:after {
    content: " ";
    position: absolute;
    bottom: 1px;
    left: 50%;
    border: solid;
    border-width: 10px 10px 0 10px;
    border-color: transparent;
    transform: translate(-50%, 100%);
  }

  .social-media a .tooltip-social:after {
    border-top-color: #1A237E;
  }

  .social-media a:hover .tooltip-social {
    opacity: 1;
    transform: translate(-50%, -130%);
  }

  .linkedin-btn {
    padding: 8px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .linkedin-btn:hover {
    background: rgba(26, 35, 126, 0.1);
  }
`;

export default TeamCard; 