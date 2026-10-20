import { useEffect, useState } from "react";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function PaymentStatus() {
  const [seconds, setSeconds] = useState(29 * 60 + 6);
  const [copied, setCopied] = useState(false);
  const orderNumber = "SL2002979778";

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const copyOrder = async () => {
    await navigator.clipboard?.writeText(orderNumber);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <section className="payment-status">
      <article className="status-card status-card--payment">
        <h2>Заказ ждёт оплаты</h2>
        <span className="status-card__eyebrow">Номер заказа:</span>
        <button className="order-copy" type="button" onClick={copyOrder}>
          {copied ? "Скопировано" : orderNumber}
          <img src="/assets/copy.svg" alt="" />
        </button>
        <div className="payment-status__content">
          <div className="qr-code"><img src="/assets/qr-code.png" alt="QR-код для оплаты" /></div>
          <div className="payment-status__timer">
            <span>QR-код действует:</span>
            <strong>{formatTime(seconds)}</strong>
            <p>После оплаты мы начнём его собирать ❤︎</p>
          </div>
        </div>
        <img className="status-card__boxes" src="/assets/boxes.png" alt="" />
      </article>

      <article className="status-card status-card--tracking">
        <h2>Как отследить заказ</h2>
        <p>
          Информация о статусе заказа будет доступна в личном кабинете, а также по email:
          мы пришлём письмо, когда статус заказа изменится.
        </p>
        <p>
          Если хотите проверить статус вручную, перейдите на страницу с трекером и
          введите номер заказа.
        </p>
        <a className="tracker-link" href="https://www.sela.ru/personal/" target="_blank" rel="noreferrer">
          Трекер заказа <img src="/assets/arrow-right.svg" alt="" />
        </a>
        <img className="status-card__tracking-image" src="/assets/tracking.png" alt="" />
      </article>
    </section>
  );
}
