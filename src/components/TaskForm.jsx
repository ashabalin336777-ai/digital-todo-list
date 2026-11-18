import { GROUPS } from "../utils/tasks.js";

export default function TaskForm({ draft, error, onChange, onSubmit }) {
  function update(patch) {
    onChange({ ...draft, ...patch });
  }

  return (
    <form
      className="form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="form-row">
        <label className="field grow">
          <span className="visually-hidden">Текст задачи</span>
          <input
            value={draft.text}
            onChange={(event) => update({ text: event.target.value })}
            onKeyDown={(event) => {
              if (event.key !== "Enter") {
                return;
              }
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }}
            placeholder="Новая задача"
            maxLength={300}
            autoComplete="off"
          />
        </label>
        <button className="button primary" type="submit">
          Добавить
        </button>
      </div>

      <label className="field">
        <span>Группа</span>
        <select value={draft.group} onChange={(event) => update({ group: event.target.value })}>
          {GROUPS.map((group) => (
            <option key={group.id} value={group.id}>
              {group.label}
            </option>
          ))}
        </select>
      </label>

      <div className="date-row">
        <label className="field">
          <span>Начало</span>
          <input
            type="datetime-local"
            value={draft.start}
            onChange={(event) => update({ start: event.target.value })}
          />
        </label>
        <label className="field">
          <span>Окончание</span>
          <input
            type="datetime-local"
            value={draft.end}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "date-error" : undefined}
            onChange={(event) => update({ end: event.target.value })}
          />
          {error ? (
            <p id="date-error" className="hint" role="alert">
              {error}
            </p>
          ) : null}
        </label>
      </div>
    </form>
  );
}
