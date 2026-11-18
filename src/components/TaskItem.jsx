import { useState } from "react";
import { formatTaskWhen, isOverdue } from "../utils/date.js";
import { groupById } from "../utils/tasks.js";

export default function TaskItem({ task, onToggle, onEdit, onArchive, onRestore, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const group = groupById(task.group);
  const when = formatTaskWhen(task.startAt, task.endAt);
  const overdue = isOverdue(task);
  const className = ["task", task.done ? "is-done" : "", overdue ? "is-overdue" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={className}>
      <label className="check">
        <input
          type="checkbox"
          checked={task.done}
          aria-label={`Выполнено: ${task.text}`}
          onChange={() => onToggle(task.id)}
        />
        <span className="task-text">{task.text}</span>
      </label>

      <div className="meta">
        <span className="badge" style={{ backgroundColor: group.color }}>
          {group.label}
        </span>
        {when ? <time className="when">{when}</time> : null}
        {overdue ? <span className="overdue-mark">Просрочено</span> : null}
      </div>

      <div className="actions">
        {task.archived ? (
          <button className="button small" type="button" onClick={() => onRestore(task.id)}>
            Восстановить
          </button>
        ) : (
          <>
            <button className="button small" type="button" onClick={() => onEdit(task)}>
              Редактировать
            </button>
            <button className="button small" type="button" onClick={() => onArchive(task.id)}>
              В архив
            </button>
          </>
        )}
        <button
          className="button small danger"
          type="button"
          onClick={() => {
            if (task.archived) {
              setConfirming(true);
              return;
            }
            onDelete(task.id);
          }}
        >
          {task.archived ? "Удалить навсегда" : "Удалить"}
        </button>
      </div>

      {confirming ? (
        <div className="confirm" role="alertdialog" aria-label="Подтверждение удаления">
          <p>Удалить задачу навсегда?</p>
          <div className="actions">
            <button className="button small danger" type="button" onClick={() => onDelete(task.id)}>
              Удалить навсегда
            </button>
            <button className="button small" type="button" onClick={() => setConfirming(false)}>
              Отмена
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}
