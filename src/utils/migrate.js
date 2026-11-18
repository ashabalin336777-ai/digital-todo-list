import { toIso } from "./date.js";

export const GROUP_IDS = ["personal", "work", "study", "home"];

export function migrateTasks(data) {
  try {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.flatMap((item) => {
      const task = migrateTask(item);
      return task ? [task] : [];
    });
  } catch {
    return [];
  }
}

function migrateTask(value) {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (typeof value.id !== "string" || value.id.trim() === "") {
    return null;
  }

  if (typeof value.text !== "string") {
    return null;
  }

  return {
    id: value.id,
    text: value.text,
    done: value.done === true,
    createdAt: toIso(value.createdAt) ?? new Date().toISOString(),
    completedAt: toIso(value.completedAt),
    group: GROUP_IDS.includes(value.group) ? value.group : "personal",
    startAt: toIso(value.startAt),
    endAt: toIso(value.endAt),
    archived: value.archived === true,
  };
}
