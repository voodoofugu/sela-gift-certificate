import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Header } from "./components/Header";
import { Stepper } from "./components/Stepper";
import { Checkbox, Field, PrimaryButton } from "./components/Fields";
import { DesignSlider } from "./components/DesignSlider";
import { GiftCard } from "./components/GiftCard";
import { PaymentStatus } from "./components/PaymentStatus";
import { Price, RubleSign } from "./components/Currency";

const designs = [
  { id: "green", image: "/assets/card-green.jpg" },
  { id: "forest", image: "/assets/card-forest.jpg" },
  { id: "confetti", image: "/assets/card-confetti.jpg" },
  { id: "home", image: "/assets/card-home.jpg" },
];

const amountOptions = [1000, 3000, 5000, 10000, 30000, 50000];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialForm = {
  amount: 5000,
  customAmount: "5000",
  sender: "От Анны",
  greeting: "Пусть каждый день будет немного уютнее. Обнимаю!",
  anonymous: false,
  recipientName: "Мария",
  recipientPhone: "+7 (900) 000-00-00",
  recipientEmail: "recipient@example.com",
  buyerName: "Анна Иванова",
  buyerPhone: "+7 (900) 000-00-00",
  buyerEmail: "buyer@example.com",
  delivery: "now",
  deliveryDate: "",
  deliveryTime: "",
};

export default function App() {
  // useState
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [designIndex, setDesignIndex] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [errors, setErrors] = useState({});
  const [isReturningToDesign, setIsReturningToDesign] = useState(false);
  const [isDesignEntering, setIsDesignEntering] = useState(false);

  // useRef
  const sliderPositionRef = useRef(null);

  // vars
  const selectedDesign = designs[designIndex];
  const sender = form.anonymous ? "" : form.sender;
  const screenTitle = [
    "Выберите дизайн",
    "Создайте свой сертификат",
    "Кому и когда отправить?",
    "Проверьте подарок",
  ][step - 1];

  useEffect(() => {
    if (!isDesignEntering) return undefined;

    const revealTimer = window.setTimeout(() => {
      setIsDesignEntering(false);
    }, 700);

    return () => window.clearTimeout(revealTimer);
  }, [isDesignEntering]);

  const update = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: false }));
  };

  const changeStep = (nextStep, animateCardOwner = false) => {
    const updateStep = () => {
      flushSync(() => {
        setStep(nextStep);
        setIsReturningToDesign(false);
        setIsDesignEntering(nextStep === 1 && animateCardOwner);
        setMaxStep((current) => Math.max(current, Math.min(nextStep, 4)));
      });
    };

    if (document.startViewTransition && animateCardOwner) {
      const transitionDirection = nextStep === 1 ? "to-design" : "from-design";
      const root = document.documentElement;
      root.dataset.cardTransition = transitionDirection;

      const transition = document.startViewTransition(updateStep);
      transition.finished
        .finally(() => {
          if (root.dataset.cardTransition === transitionDirection) {
            delete root.dataset.cardTransition;
          }
        })
        .catch(() => {});
    } else {
      updateStep();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goTo = (nextStep) => {
    if (nextStep === 1 && step > 1) {
      if (step === 2) {
        if (isReturningToDesign) return;
        setIsReturningToDesign(true);
      } else {
        changeStep(1, true);
      }
      return;
    }

    changeStep(nextStep, step === 1 && nextStep > 1);
  };

  const reset = () => {
    sliderPositionRef.current = null;
    setStep(1);
    setMaxStep(1);
    setDesignIndex(0);
    setForm(initialForm);
    setIsCustomAmount(false);
    setErrors({});
    setIsReturningToDesign(false);
    setIsDesignEntering(false);
  };

  const nextFromPostcard = () => {
    const custom = Number(form.customAmount);
    if (!Number.isFinite(custom) || custom < 500 || custom > 50000) {
      setErrors({ customAmount: true });
      return;
    }
    setForm((current) => ({ ...current, amount: custom }));
    goTo(3);
  };

  const nextFromDelivery = () => {
    const nextErrors = {
      recipientEmail: !emailPattern.test(form.recipientEmail),
      buyerEmail: !emailPattern.test(form.buyerEmail),
      deliveryDate: form.delivery === "schedule" && !form.deliveryDate,
      deliveryTime: form.delivery === "schedule" && !form.deliveryTime,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    goTo(4);
  };

  return (
    <div className="app-shell">
      <Header onLogoClick={reset} />
      <main>
        <section
          className={`page-intro ${step === 5 ? "page-intro--status" : ""}`}
        >
          <h1>ПОДАРОЧНЫЙ СЕРТИФИКАТ</h1>
          <p>
            {step === 5
              ? "После оплаты сертификат отправится автоматически."
              : "Идеальный подарок по поводу и без для близких, друзей или коллег!"}
          </p>
          {step <= 4 && (
            <Stepper activeStep={step} maxStep={maxStep} onStepChange={goTo} />
          )}
        </section>

        {step <= 4 && <h2 className="screen-title">{screenTitle}</h2>}

        {step <= 4 && (
          <section className={`purchase-flow flow-step-${step}`}>
            <aside className="gift-preview">
              {step > 1 && (
                <button
                  className="back-link"
                  type="button"
                  onClick={() => goTo(step - 1)}
                >
                  <span aria-hidden="true">←</span> Вернуться
                </button>
              )}
              {step === 1 ? (
                <DesignSlider
                  designs={designs}
                  activeIndex={designIndex}
                  onChange={setDesignIndex}
                  amount={form.amount}
                  sender={sender}
                  initialPosition={sliderPositionRef.current}
                  onScrollPosition={(left) => {
                    sliderPositionRef.current = left;
                  }}
                  isEntering={isDesignEntering}
                />
              ) : (
                <div className="static-card-stage">
                  <GiftCard
                    image={selectedDesign.image}
                    side={step === 2 && !isReturningToDesign ? "back" : "front"}
                    initialSide="front"
                    flipDelay={300}
                    amount={form.amount}
                    sender={sender}
                    selected
                    onFlipComplete={(visibleSide) => {
                      if (isReturningToDesign && visibleSide === "front") {
                        changeStep(1, true);
                      }
                    }}
                  />
                </div>
              )}
              <div className="card-notes">
                <p>
                  можно использовать полностью или частично вместе с баллами
                  лояльности
                </p>
                <p>
                  действует <b>3 года</b>, чтобы точно успеть всё купить
                </p>
              </div>
              {step > 1 && (
                <div className="card-actions">
                  <button type="button">Проверить баланс</button>
                  <button type="button">Проверить пин-код</button>
                </div>
              )}
              {step === 1 && (
                <PrimaryButton onClick={() => goTo(2)}>
                  Далее — открытка
                </PrimaryButton>
              )}
            </aside>

            <div className="flow-panel" key={step}>
              {step === 2 && (
                <div className="form-panel">
                  <h3>Номинал</h3>
                  <div className="amount-options">
                    {amountOptions.map((amount) => (
                      <button
                        type="button"
                        key={amount}
                        className={
                          !isCustomAmount && form.amount === amount
                            ? "is-selected"
                            : ""
                        }
                        onClick={() => {
                          setIsCustomAmount(false);
                          setForm((current) => ({
                            ...current,
                            amount,
                            customAmount: String(amount),
                          }));
                          setErrors((current) => ({
                            ...current,
                            customAmount: false,
                          }));
                        }}
                      >
                        <Price value={amount} />
                      </button>
                    ))}
                  </div>
                  <Field
                    label={
                      <>
                        Своя сумма, <RubleSign />
                      </>
                    }
                    inputMode="numeric"
                    maxLength={5}
                    value={form.customAmount}
                    error={errors.customAmount}
                    onChange={(event) => {
                      const customAmount = event.target.value.replace(
                        /\D/g,
                        "",
                      );
                      const amount = Number(customAmount);

                      setIsCustomAmount(true);
                      setForm((current) => ({
                        ...current,
                        customAmount,
                        ...(customAmount ? { amount } : {}),
                      }));
                      setErrors((current) => ({
                        ...current,
                        customAmount: false,
                      }));
                    }}
                    onBlur={() => {
                      const value = Number(form.customAmount);
                      setErrors((current) => ({
                        ...current,
                        customAmount:
                          !Number.isFinite(value) ||
                          value < 500 ||
                          value > 50000,
                      }));
                    }}
                  />
                  <Field
                    label="Подпись на открытке"
                    value={form.anonymous ? "—" : form.sender}
                    disabled={form.anonymous}
                    onChange={update("sender")}
                  />
                  <Checkbox
                    checked={form.anonymous}
                    onChange={update("anonymous")}
                  >
                    Отправить сертификат анонимно
                  </Checkbox>
                  <label className="textarea-field">
                    <span>Поздравление · необязательно</span>
                    <textarea
                      maxLength={300}
                      value={form.greeting}
                      onChange={update("greeting")}
                    />
                    <small>{form.greeting.length} / 300</small>
                  </label>
                  <PrimaryButton
                    onClick={nextFromPostcard}
                    disabled={Boolean(errors.customAmount)}
                  >
                    Далее — отправка
                  </PrimaryButton>
                </div>
              )}

              {step === 3 && (
                <div className="form-panel form-panel--delivery">
                  <h3>Данные получателя</h3>
                  <Field
                    label="Имя"
                    value={form.recipientName}
                    onChange={update("recipientName")}
                  />
                  <Field
                    label="Телефон"
                    value={form.recipientPhone}
                    onChange={update("recipientPhone")}
                  />
                  <Field
                    label="Email"
                    value={form.recipientEmail}
                    error={errors.recipientEmail}
                    onChange={update("recipientEmail")}
                  />
                  <h3>Данные покупателя</h3>
                  <p className="form-hint">
                    Для оформления заказа и чека. Не показываются на открытке.
                  </p>
                  <Field
                    label="Имя и фамилия"
                    value={form.buyerName}
                    onChange={update("buyerName")}
                  />
                  <Field
                    label="Телефон"
                    value={form.buyerPhone}
                    onChange={update("buyerPhone")}
                  />
                  <Field
                    label="Email"
                    value={form.buyerEmail}
                    error={errors.buyerEmail}
                    onChange={update("buyerEmail")}
                  />
                  <h3>Когда отправить?</h3>
                  <div className="delivery-options">
                    <button
                      type="button"
                      className={form.delivery === "now" ? "is-selected" : ""}
                      onClick={() =>
                        setForm((current) => ({ ...current, delivery: "now" }))
                      }
                    >
                      <span /> Сразу после оплаты
                    </button>
                    <button
                      type="button"
                      className={
                        form.delivery === "schedule" ? "is-selected" : ""
                      }
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          delivery: "schedule",
                        }))
                      }
                    >
                      <span /> Выбрать дату и время
                    </button>
                  </div>
                  {form.delivery === "schedule" && (
                    <div className="schedule-fields">
                      <Field
                        label="Дата"
                        type="date"
                        value={form.deliveryDate}
                        error={errors.deliveryDate}
                        onChange={update("deliveryDate")}
                      />
                      <Field
                        label="Время"
                        type="time"
                        value={form.deliveryTime}
                        error={errors.deliveryTime}
                        onChange={update("deliveryTime")}
                      />
                    </div>
                  )}
                  <PrimaryButton onClick={nextFromDelivery}>
                    Далее — оплата
                  </PrimaryButton>
                </div>
              )}

              {step === 4 && (
                <div className="form-panel checkout-panel">
                  <article className="receipt">
                    <div className="receipt__surface">
                      <div className="receipt__header">
                        <h3>Детали заказа</h3>
                        <img src="/assets/sela-mark.svg" alt="SELA" />
                      </div>
                      <div className="receipt__columns">
                        <div>
                          <b>Покупатель</b>
                          <span>{form.buyerName}</span>
                          <span>{form.buyerPhone}</span>
                          <span>{form.buyerEmail}</span>
                        </div>
                        <div>
                          <b>Получатель</b>
                          <span>{form.recipientName}</span>
                          <span>{form.recipientPhone}</span>
                          <span>{form.recipientEmail}</span>
                        </div>
                      </div>
                      <div className="receipt__total">
                        <b>Сумма</b>
                        <strong>
                          <Price value={form.amount} />
                        </strong>
                      </div>
                    </div>
                  </article>
                  <h3>Способ оплаты</h3>
                  <div className="payment-option">
                    <span /> Система быстрых платежей (СБП)
                  </div>
                  <PrimaryButton onClick={() => goTo(5)}>
                    Оформить заказ · <Price value={form.amount} />
                  </PrimaryButton>
                  <p className="legal">
                    Нажимая на кнопку «Оформить заказ», Вы принимаете{" "}
                    <u>условия правил продаж</u> и подтверждаете, что
                    ознакомлены с <u>Политикой конфиденциальности</u>.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {step === 5 && <PaymentStatus />}
      </main>
    </div>
  );
}
