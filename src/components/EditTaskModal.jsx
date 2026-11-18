import { useEffect, useId, useRef, useState } from "react";
import { isEndBeforeStart, toDatetimeLocal } from "../utils/date.js";
import { GROUPS } from "../utils/tasks.js";

export default function EditTaskModal({ task, onClose, onSave }) {
  const titleId = useId();
  const inputRef = useRef(null);
  const [draft, setDraft] = useState({
    text: task.text,
    group: task.group,
    start: toDatetimeLocal(task.startAt),
    end: toDatetimeLocal(task.endAt),
  });
  const [error, setError] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function update(patch) {
    const next = { ...draft, ...patch };
    setDraft(next);
    if (error === "Окончание не может быть раньше начала" && !isEndBeforeStart(next.start, next.end)) {
      setError("");
    }
  }

  function save(event) {
    event.preventDefault();
    const result = onSave(draft);
    if (!result.ok && result.reason === "range") {
      setError("Окончание не может быть раньше начала");
    }
    if (!result.ok && result.reason === "empty") {
      setError("Введите текст задачи");
    }
  }

  const rangeError = error === "Окончание не может быть раньше начала";

  return (
    <div className="overlay" onMouseDown={onClose}>
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={save}
      >
        <h2 id={titleId}>Редактировать задачу</h2>

        <label className="field">
          <span>Текст</span>
          <input
            ref={inputRef}
            value={draft.text}
            onChange={(event) => update({ text: event.target.value })}
            onKeyDown={(event) => {
              if (event.key !== "Enter") {
                return;
              }
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }}
            maxLength={300}
            autoComplete="off"
          />
        </label>

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
              aria-invalid={rangeError ? true : undefined}
              onChange={(event) => update({ end: event.target.value })}
            />
            {rangeError ? (
              <p className="hint" role="alert">
                {error}
              </p>
            ) : null}
          </label>
        </div>

        {error && !rangeError ? (
          <p className="hint" role="alert">
            {error}
          </p>
        ) : null}

        <div className="actions">
          <button className="button primary" type="submit">
            Сохранить
          </button>
          <button className="button" type="button" onClick={onClose}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
