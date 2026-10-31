import { MorphScroll } from "morphing-scroll";
import { GiftCard } from "./GiftCard";

export function DesignSlider({
  designs,
  activeIndex,
  onChange,
  amount,
  sender,
  initialPosition,
  onScrollPosition,
  isEntering = false,
}) {
  return (
    <div
      className={`design-picker ${isEntering ? "design-picker--entering" : ""}`}
    >
      {isEntering && (
        <span className="design-picker__transition-target" aria-hidden="true" />
      )}
      <MorphScroll
        className="design-slider"
        mode="sliderMenu"
        direction="x"
        size="auto"
        duration={460}
        controls={{
          drag: true,
          keys: true,
          arrows: {
            element: (
              <button
                type="button"
                className="design-picker__arrow"
                aria-label="Перейти"
              >
                <img src="/assets/chevron-right.svg" alt="" />
              </button>
            ),
          },
          bar: {
            element: designs.map((design, index) => (
              <div
                key={design.id}
                className="design-picker__thumbnail"
                aria-pressed={index === activeIndex}
              >
                <img src={design.image} alt="" />
              </div>
            )),
            maxItems: 3,
          },
        }}
        trackVisibility
        // loop={true}
        render="virtual"
        initialPosition={initialPosition}
        onScrollPosition={onScrollPosition}
        onNavigate={({ to }) => onChange(to)}
      >
        {designs.map((design, index) => (
          <div className="design-slide" key={design.id}>
            <GiftCard
              image={design.image}
              amount={amount}
              sender={sender}
              selected={index === activeIndex}
            />
          </div>
        ))}
      </MorphScroll>
    </div>
  );
}
