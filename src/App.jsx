import { useState } from "react";
import Calendar from "./components/Calendar.jsx";
import EditTaskModal from "./components/EditTaskModal.jsx";
import GroupTabs from "./components/GroupTabs.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import ViewSwitch from "./components/ViewSwitch.jsx";
import { useTasks } from "./hooks/useTasks.js";
import {
  formatDayTitle,
  formatStamp,
  isEndBeforeStart,
  shiftMonth,
  taskFallsOnDay,
  withDate,
} from "./utils/date.js";
import { countByTab, filterByTab, sortTasks } from "./utils/tasks.js";

const RANGE_MESSAGE = "Окончание не может быть раньше начала";

export default function App() {
  const {
    tasks,
    tab,
    setTab,
    addTask,
    toggleTask,
    updateTask,
    archiveTask,
    restoreTask,
    deleteTask,
    archiveCompleted,
  } = useTasks();
  const [view, setView] = useState("list");
  const [draft, setDraft] = useState({ text: "", group: "personal", start: "", end: "" });
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState(null);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState(null);

  const visible = sortTasks(filterByTab(tasks, tab));
  const remaining = visible.filter((task) => !task.done).length;
  const completedLeft = tasks.some((task) => task.done && !task.archived);
  const dayTasks = selectedDay
    ? sortTasks(visible.filter((task) => taskFallsOnDay(task, selectedDay)))
    : [];

  function updateDraft(next) {
    setDraft(next);
    if (!isEndBeforeStart(next.start, next.end)) {
      setFormError("");
    }
  }

  function handleAdd() {
    const result = addTask(draft);
    if (!result.ok) {
      setFormError(result.reason === "range" ? RANGE_MESSAGE : "");
      return;
    }

    setFormError("");
    setDraft((current) => ({ ...current, text: "", start: "", end: "" }));
  }

  function handlePickDay(day) {
    const next = { ...draft, start: withDate(draft.start, day) };
    setSelectedDay(day);
    setDraft(next);
    if (!isEndBeforeStart(next.start, next.end)) {
      setFormError("");
    }
  }

  function handleSave(nextDraft) {
    const result = updateTask(editing.id, nextDraft);
    if (result.ok) {
      setEditing(null);
    }
    return result;
  }

  const handlers = {
    onToggle: toggleTask,
    onEdit: setEditing,
    onArchive: archiveTask,
    onRestore: restoreTask,
    onDelete: deleteTask,
  };

  return (
    <main className="app">
      <header className="hero">
        <div>
          <h1>Список задач</h1>
          <p className="counter" aria-live="polite">
            Осталось {remaining} из {visible.length}
          </p>
        </div>
        <div className="hero-side">
          <p className="stamp">{formatStamp(new Date())}</p>
          <ViewSwitch view={view} onChange={setView} />
        </div>
      </header>

      <GroupTabs active={tab} counts={countByTab(tasks)} onChange={setTab} />

      <div className="toolbar">
        <button
          className="button"
          type="button"
          disabled={!completedLeft}
          onClick={archiveCompleted}
        >
          Архивировать выполненные
        </button>
      </div>

      <TaskForm
        draft={draft}
        error={formError}
        onChange={updateDraft}
        onSubmit={handleAdd}
      />

      {view === "list" ? (
        <TaskList tasks={visible} {...handlers} />
      ) : (
        <div className="calendar-wrap">
          <Calendar
            month={month}
            tasks={visible}
            selectedDay={selectedDay}
            onShift={(delta) => setMonth((current) => shiftMonth(current, delta))}
            onToday={() => {
              const now = new Date();
              setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
            }}
            onSelect={handlePickDay}
          />
          {selectedDay ? (
            <section className="day-tasks" aria-label={formatDayTitle(selectedDay)}>
              <h2>{formatDayTitle(selectedDay)}</h2>
              <TaskList tasks={dayTasks} {...handlers} />
            </section>
          ) : (
            <p className="empty">Выберите день</p>
          )}
        </div>
      )}

      {editing ? (
        <EditTaskModal task={editing} onClose={() => setEditing(null)} onSave={handleSave} />
      ) : null}
    </main>
  );
}
