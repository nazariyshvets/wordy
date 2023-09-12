import "../css/HamburgerMenu.css";

interface HamburgerMenuProps {
  isActive: boolean;
  onClick: () => void;
}

function HamburgerMenu({ isActive, onClick }: HamburgerMenuProps) {
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
