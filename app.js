const STORAGE_KEY = "todo-tasks";

const form = document.querySelector("#form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#list");
const counter = document.querySelector("#counter");
const empty = document.querySelector("#empty");

let tasks = loadTasks();

input.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  event.preventDefault();
  form.requestSubmit();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    return;
  }

  tasks.push({
    id: createId(),
    text,
    done: false,
    createdAt: new Date().toISOString(),
  });
  input.value = "";
  persist();
  render();
  input.focus();
});

list.addEventListener("change", (event) => {
  const checkbox = event.target;
  if (!(checkbox instanceof HTMLInputElement) || checkbox.type !== "checkbox") {
    return;
  }

  const item = checkbox.closest("[data-id]");
  const task = tasks.find((entry) => entry.id === item?.dataset.id);
  if (!task) {
    return;
  }

  task.done = checkbox.checked;
  persist();
  render();
});

list.addEventListener("click", (event) => {
  const button = event.target.closest(".delete");
  if (!button) {
    return;
  }

  const item = button.closest("[data-id]");
  tasks = tasks.filter((entry) => entry.id !== item?.dataset.id);
  persist();
  render();
});

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isTask);
  } catch {
    return [];
  }
}

function isTask(value) {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (
    typeof value.id === "string" &&
    value.id !== "" &&
    typeof value.text === "string" &&
    typeof value.done === "boolean" &&
    (typeof value.createdAt === "string" || typeof value.createdAt === "number")
  );
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Страница продолжает работать, даже если хранилище недоступно.
  }
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function render() {
  const remaining = tasks.reduce((count, task) => count + (task.done ? 0 : 1), 0);
  counter.textContent = `осталось ${remaining} из ${tasks.length}`;
  empty.hidden = tasks.length > 0;

  const fragment = document.createDocumentFragment();

  for (const task of tasks) {
    const item = document.createElement("li");
    item.className = task.done ? "item is-done" : "item";
    item.dataset.id = task.id;

    const label = document.createElement("label");
    label.className = "check";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", `Выполнено: ${task.text}`);

    const text = document.createElement("span");
    text.className = "text";
    text.textContent = task.text;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete";
    remove.textContent = "Удалить";
    remove.setAttribute("aria-label", `Удалить задачу: ${task.text}`);

    label.append(checkbox, text);
    item.append(label, remove);
    fragment.append(item);
  }

  list.replaceChildren(fragment);
}

render();
