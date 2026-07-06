import type { WorkProject } from '@/lib/site-content-schema';
import { ProjectCard } from '@/components/ProjectCard';

/** The work index: a gallery grid of project tiles. */
export function WorkIndex({ projects }: { projects: WorkProject[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2">
      {projects.map((project, i) => (
        <ProjectCard key={project.href} project={project} index={i} />
      ))}
    </div>
  );
}
