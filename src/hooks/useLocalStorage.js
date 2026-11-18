import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue, normalize) {
  const [value, setValue] = useState(() => readStorage(key, initialValue, normalize));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Хранилище недоступно — список остаётся в памяти до перезагрузки.
    }
  }, [key, value]);

  return [value, setValue];
}

function readStorage(key, initialValue, normalize) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) {
      return initialValue;
    }

    const parsed = JSON.parse(raw);
    return normalize ? normalize(parsed) : parsed;
  } catch {
    return initialValue;
  }
}
