import { useLocalStorage } from "./useLocalStorage.js";
import { fromDatetimeLocal, isEndBeforeStart } from "../utils/date.js";
import { migrateTasks } from "../utils/migrate.js";
import { normalizeTab } from "../utils/tasks.js";

export const TASKS_KEY = "todo-tasks";
export const TAB_KEY = "todo-active-tab";

const EMPTY_RESULT = { ok: false, reason: "empty" };
const RANGE_RESULT = { ok: false, reason: "range" };

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage(TASKS_KEY, [], migrateTasks);
  const [tab, setTab] = useLocalStorage(TAB_KEY, "all", normalizeTab);

  function addTask(draft) {
    const text = draft.text.trim();
    if (!text) {
      return EMPTY_RESULT;
    }

    if (isEndBeforeStart(draft.start, draft.end)) {
      return RANGE_RESULT;
    }

    const task = {
      id: createId(),
      text,
      done: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      group: draft.group,
      startAt: fromDatetimeLocal(draft.start),
      endAt: fromDatetimeLocal(draft.end),
      archived: false,
    };

    setTasks((current) => [...current, task]);
    return { ok: true };
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) {
          return task;
        }

        const done = !task.done;
        return {
          ...task,
          done,
          completedAt: done ? new Date().toISOString() : null,
        };
      }),
    );
  }

  function updateTask(id, draft) {
    const text = draft.text.trim();
    if (!text) {
      return EMPTY_RESULT;
    }

    if (isEndBeforeStart(draft.start, draft.end)) {
      return RANGE_RESULT;
    }

    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              text,
              group: draft.group,
              startAt: fromDatetimeLocal(draft.start),
              endAt: fromDatetimeLocal(draft.end),
            }
          : task,
      ),
    );
    return { ok: true };
  }

  function archiveTask(id) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, archived: true } : task)),
    );
  }

  function restoreTask(id) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, archived: false } : task)),
    );
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function archiveCompleted() {
    setTasks((current) =>
      current.map((task) => (task.done && !task.archived ? { ...task, archived: true } : task)),
    );
  }

  return {
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
  };
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
