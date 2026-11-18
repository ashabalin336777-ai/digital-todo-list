import TaskItem from "./TaskItem.jsx";

export default function TaskList({
  tasks,
  onToggle,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
}) {
  if (tasks.length === 0) {
    return <p className="empty">Задач пока нет</p>;
  }

  return (
    <ul className="list">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskItem
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onArchive={onArchive}
            onRestore={onRestore}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
