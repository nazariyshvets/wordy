import "../css/HamburgerMenu.css";

function HamburgerMenu({ isActive, onClick }) {
  return (
    <div
      className={`hamburger-menu ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

export default HamburgerMenu;
