const datePart = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
});

const timePart = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
});

const monthTitle = new Intl.DateTimeFormat("ru-RU", {
  month: "long",
  year: "numeric",
});

const dayTitle = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
});

const stampFormat = new Intl.DateTimeFormat("ru-RU", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

export const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function clean(value) {
  return value.replace(/[\u00A0\u202F]/g, " ").replace(/\s+/g, " ").trim();
}

export function parseDate(value) {
  if (value == null || value === "") {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toIso(value) {
  return parseDate(value)?.toISOString() ?? null;
}

function pad(number) {
  return String(number).padStart(2, "0");
}

export function dayKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toDatetimeLocal(value) {
  const date = parseDate(value);
  if (!date) {
    return "";
  }

  return `${dayKey(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocal(value) {
  if (!value) {
    return null;
  }

  return toIso(value);
}

export function isEndBeforeStart(startValue, endValue) {
  if (!startValue || !endValue) {
    return false;
  }

  const start = parseDate(startValue);
  const end = parseDate(endValue);
  if (!start || !end) {
    return false;
  }

  return end.getTime() < start.getTime();
}

export function isSameDay(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function taskFallsOnDay(task, day) {
  const start = parseDate(task.startAt);
  return Boolean(start) && isSameDay(start, day);
}

export function isOverdue(task, now = new Date()) {
  if (task.done) {
    return false;
  }

  const end = parseDate(task.endAt);
  return Boolean(end) && end.getTime() < now.getTime();
}

export function formatTaskWhen(startAt, endAt) {
  const start = parseDate(startAt);
  const end = parseDate(endAt);
  if (!start && !end) {
    return "";
  }

  if (start && end) {
    const startDate = clean(datePart.format(start));
    const startTime = clean(timePart.format(start));
    const endTime = clean(timePart.format(end));
    if (isSameDay(start, end)) {
      return `${startDate}, ${startTime} — ${endTime}`;
    }

    return `${startDate}, ${startTime} — ${clean(datePart.format(end))}, ${endTime}`;
  }

  const only = start || end;
  return `${clean(datePart.format(only))}, ${clean(timePart.format(only))}`;
}

export function formatMonthTitle(date) {
  return clean(monthTitle.format(date)).replace(/\s*г\.?$/i, "");
}

export function formatDayTitle(date) {
  return clean(dayTitle.format(date));
}

export function formatStamp(date) {
  return clean(stampFormat.format(date));
}

export function shiftMonth(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export function buildMonthGrid(visibleMonth) {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - offset);
  const cells = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    cells.push(date);
  }

  let lastInMonth = 0;
  cells.forEach((date, index) => {
    if (date.getMonth() === month) {
      lastInMonth = index;
    }
  });

  const rows = Math.ceil((lastInMonth + 1) / 7);
  return cells.slice(0, rows * 7);
}

export function withDate(localValue, day) {
  const time = typeof localValue === "string" && localValue.includes("T")
    ? localValue.slice(11, 16)
    : "09:00";
  return `${dayKey(day)}T${time}`;
}
