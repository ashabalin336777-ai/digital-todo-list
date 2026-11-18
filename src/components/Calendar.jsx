import {
  WEEKDAYS,
  buildMonthGrid,
  dayKey,
  formatDayTitle,
  formatMonthTitle,
  isSameDay,
  taskFallsOnDay,
} from "../utils/date.js";

export default function Calendar({ month, tasks, selectedDay, onShift, onToday, onSelect }) {
  const today = new Date();
  const cells = buildMonthGrid(month);

  return (
    <section className="calendar" aria-label="Календарь задач">
      <div className="calendar-bar">
        <button className="button small" type="button" aria-label="Предыдущий месяц" onClick={() => onShift(-1)}>
          ←
        </button>
        <h2>{formatMonthTitle(month)}</h2>
        <button className="button small" type="button" aria-label="Следующий месяц" onClick={() => onShift(1)}>
          →
        </button>
        <button className="button small" type="button" onClick={onToday}>
          Сегодня
        </button>
      </div>

      <div className="weekdays" aria-hidden="true">
        {WEEKDAYS.map((name) => (
          <span key={name}>{name}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {cells.map((date) => {
          const count = tasks.filter((task) => taskFallsOnDay(task, date)).length;
          const outside = date.getMonth() !== month.getMonth();
          const className = [
            "day",
            outside ? "is-outside" : "",
            isSameDay(date, today) ? "is-today" : "",
            selectedDay && isSameDay(date, selectedDay) ? "is-selected" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={dayKey(date)}
              className={className}
              type="button"
              aria-label={`${formatDayTitle(date)}, задач: ${count}`}
              aria-pressed={Boolean(selectedDay && isSameDay(date, selectedDay))}
              onClick={() => onSelect(date)}
            >
              <span>{date.getDate()}</span>
              {count > 0 ? <span className="day-count">{count}</span> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
