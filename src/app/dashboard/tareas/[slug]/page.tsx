import { notFound } from "next/navigation";
import { getTaskBySlug, tasks } from "@/lib/tasks";
import TaskDetailView from "@/components/TaskDetailView";

type TaskPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return tasks.map((task) => ({ slug: task.slug }));
}

export default async function TaskDetailPage({ params }: TaskPageProps) {
  const { slug } = await params;
  const task = getTaskBySlug(slug);

  if (!task) {
    notFound();
  }

  return (
    <main className="task-detail-page">
      <TaskDetailView task={task} />
    </main>
  );
}
