import { TABS } from "../utils/tasks.js";

export default function GroupTabs({ active, counts, onChange }) {
  return (
    <div className="tabs" role="tablist" aria-label="Группы задач">
      {TABS.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            className={selected ? "tab is-active" : "tab"}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
          >
            <span>{tab.label}</span>
            <span className="count">{counts[tab.id]}</span>
          </button>
        );
      })}
    </div>
  );
}
