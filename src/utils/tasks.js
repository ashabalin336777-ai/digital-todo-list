import { parseDate } from "./date.js";

export const GROUPS = [
  { id: "personal", label: "Личные", color: "#FFD23F" },
  { id: "work", label: "Работа", color: "#5CC8FF" },
  { id: "study", label: "Учёба", color: "#B6F25C" },
  { id: "home", label: "Дом", color: "#C9A0FF" },
];

export const TABS = [
  { id: "all", label: "Все" },
  ...GROUPS.map(({ id, label }) => ({ id, label })),
  { id: "archive", label: "Архив" },
];

const TAB_IDS = TABS.map((tab) => tab.id);

export function normalizeTab(value) {
  return TAB_IDS.includes(value) ? value : "all";
}

export function groupById(id) {
  return GROUPS.find((group) => group.id === id) ?? GROUPS[0];
}

export function filterByTab(tasks, tab) {
  if (tab === "archive") {
    return tasks.filter((task) => task.archived);
  }

  const active = tasks.filter((task) => !task.archived);
  if (tab === "all") {
    return active;
  }

  return active.filter((task) => task.group === tab);
}

export function sortTasks(tasks) {
  return [...tasks].sort((left, right) => {
    if (left.done !== right.done) {
      return left.done ? 1 : -1;
    }

    const leftStart = parseDate(left.startAt)?.getTime() ?? Number.POSITIVE_INFINITY;
    const rightStart = parseDate(right.startAt)?.getTime() ?? Number.POSITIVE_INFINITY;
    if (leftStart !== rightStart) {
      return leftStart - rightStart;
    }

    const leftCreated = parseDate(left.createdAt)?.getTime() ?? 0;
    const rightCreated = parseDate(right.createdAt)?.getTime() ?? 0;
    return leftCreated - rightCreated;
  });
}

export function countByTab(tasks) {
  return Object.fromEntries(TABS.map((tab) => [tab.id, filterByTab(tasks, tab.id).length]));
}
