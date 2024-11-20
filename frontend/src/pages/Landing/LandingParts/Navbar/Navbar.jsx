// Navbar.jsx
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h1>influmes</h1>
        </div>
        <div className="nav-links">
          <select className="language-select">
            <option value="hr">HR</option>
            <option value="en">EN</option>
          </select>
          <a href="#" className="nav-link">Pomoć</a>
          <a href="mailto:hrvatska@influmes.com" className="nav-link email">
            hrvatska@influmes.com
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;