export function RubleSign({ withSpace = false }) {
  return (
    <span className="currency-symbol">
      {withSpace ? "\u00a0" : ""}₽
    </span>
  );
}

export function Price({ value }) {
  return (
    <span className="price">
      {Number(value).toLocaleString("ru-RU")}
      <RubleSign withSpace />
    </span>
  );
}
