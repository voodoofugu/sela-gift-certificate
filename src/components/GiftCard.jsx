import { useEffect, useRef, useState } from "react";
import { Price } from "./Currency";

const cardTerms = [
  "Подарочный сертификат можно использовать в магазинах sela собственной розничной сети АО «Мэлон Фэшн Груп» и на сайте sela.ru",
  "Подарочным сертификатом можно оплачивать товары. Если стоимость товаров превышает баланс сертификата, разницу можно доплатить наличными или банковской картой.",
  "Срок действия сертификата - три года с момента покупки.",
  "Подарочный сертификат можно использовать неограниченное количество раз в пределах баланса.",
  "Узнать баланс можно в любом магазине собственной розничной сети sela или в личном кабинете на сайте sela.ru после добавления сертификата. Подробности на sela.ru.",
];

export function GiftCard({
  image,
  side = "front",
  initialSide = side,
  flipDelay = 0,
  amount,
  sender,
  selected = false,
  className = "",
  onFlipComplete,
}) {
  const visibleSideRef = useRef(initialSide);
  const hasAnimatedRef = useRef(false);
  const [visibleSide, setVisibleSide] = useState(initialSide);
  const [flipPhase, setFlipPhase] = useState("idle");

  useEffect(() => {
    if (side === visibleSideRef.current) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      visibleSideRef.current = side;
      setVisibleSide(side);
      setFlipPhase("idle");
      onFlipComplete?.(side);
      return undefined;
    }

    let startTimer;
    let swapTimer;
    let enterFrame;
    let settleTimer;
    let settleFrame;

    const startFlip = () => {
      hasAnimatedRef.current = true;
      setFlipPhase("out");

      swapTimer = window.setTimeout(() => {
        visibleSideRef.current = side;
        setVisibleSide(side);
        setFlipPhase("ready");

        enterFrame = requestAnimationFrame(() => {
          setFlipPhase("in");
          settleTimer = window.setTimeout(() => {
            setFlipPhase("idle");
            settleFrame = requestAnimationFrame(() => onFlipComplete?.(side));
          }, 210);
        });
      }, 210);
    };

    const delay = hasAnimatedRef.current ? 0 : flipDelay;
    if (delay) startTimer = window.setTimeout(startFlip, delay);
    else startFlip();

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(swapTimer);
      window.clearTimeout(settleTimer);
      if (enterFrame) cancelAnimationFrame(enterFrame);
      if (settleFrame) cancelAnimationFrame(settleFrame);
    };
  }, [side]);

  const handlePointerMove = (event) => {
    if (event.pointerType === "touch") return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));

    card.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
    card.style.setProperty("--tilt-y", `${(x - 0.5) * 7}deg`);
    card.style.setProperty("--shine-opacity", String(0.08 + (1 - y) * 0.42));
  };

  const resetPointer = (event) => {
    const card = event.currentTarget;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--shine-opacity", "0.16");
  };

  return (
    <div
      className={`gift-card-scene flip-${flipPhase} ${selected ? "is-selected" : ""} ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="gift-card-tilt">
        <div className="gift-card-flipper">
          <article
            className={`gift-card gift-card--front ${visibleSide === "front" ? "is-visible" : ""}`}
            aria-hidden={visibleSide !== "front"}
          >
            <img src={image} alt="Выбранный дизайн сертификата" />
            <span className="gift-card__shine" aria-hidden="true" />
          </article>
          <article
            className={`gift-card gift-card--back ${visibleSide === "back" ? "is-visible" : ""}`}
            aria-hidden={visibleSide !== "back"}
          >
            <div className="gift-card__terms">
              {cardTerms.map((term) => <p key={term}>{term}</p>)}
            </div>
            <img className="gift-card__mark" src="/assets/sela-mark.svg" alt="SELA" />
            <div className="gift-card__value"><Price value={amount} /></div>
            <div className="gift-card__sender">{sender || "—"}</div>
            <span className="gift-card__shine" aria-hidden="true" />
          </article>
        </div>
      </div>
    </div>
  );
}
