export default function ViewSwitch({ view, onChange }) {
  return (
    <div className="switch" role="group" aria-label="Вид">
      <button
        className={view === "list" ? "button is-on" : "button"}
        type="button"
        aria-pressed={view === "list"}
        onClick={() => onChange("list")}
      >
        Список
      </button>
      <button
        className={view === "calendar" ? "button is-on" : "button"}
        type="button"
        aria-pressed={view === "calendar"}
        onClick={() => onChange("calendar")}
      >
        Календарь
      </button>
    </div>
  );
}
