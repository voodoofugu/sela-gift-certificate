import { useEffect, useState } from "react";

const actions = [
  { icon: "/assets/search.svg", label: "Поиск" },
  { icon: "/assets/account.svg", label: "Профиль" },
  { icon: "/assets/heart.svg", label: "Избранное" },
  { icon: "/assets/bag.svg", label: "Корзина" },
];

export function Header({ onLogoClick }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 0);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="site-header__inner">
        <div className="site-header__identity">
          <button className="site-header__menu" type="button" aria-label="Открыть меню">
            <span />
            <span />
          </button>
          <button className="site-header__brand" type="button" onClick={onLogoClick}>
            <img src="/assets/sela-mark.svg" alt="SELA" />
          </button>
        </div>
        <nav className="site-header__actions" aria-label="Основная навигация">
          {actions.map((item) => (
            <button key={item.label} className="icon-button" type="button" aria-label={item.label}>
              <img src={item.icon} alt="" />
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
