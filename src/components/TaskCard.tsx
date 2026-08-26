"use client";

import type { Task } from "@/lib/tasks";
import { getTaskIconSymbol } from "@/lib/tasks";

type TaskCardProps = {
  task: Task;
  selected?: boolean;
  onOpen: (slug: string) => void;
};

export default function TaskCard({
  task,
  selected = false,
  onOpen,
}: TaskCardProps) {
  return (
    <button
      className={`task-card ${selected ? "task-card-selected" : ""}`}
      type="button"
      onClick={() => onOpen(task.slug)}
    >
      <span className={`task-icon task-icon-${task.tone}`} aria-hidden="true">
        {getTaskIconSymbol(task.category)}
      </span>
      <span className="task-card-content">
        <span className="task-card-topline">
          <span>
            {task.category} · {task.time}
          </span>
          <b>{task.status}</b>
        </span>
        <strong className="task-title">{task.title}</strong>
        <span className="task-action">{task.action}</span>
        <span className="task-card-footer">
          <strong className="task-reward">{task.reward}</strong>
          <span className="task-button">
            Ver tarea <span aria-hidden="true">→</span>
          </span>
        </span>
      </span>
    </button>
  );
}
