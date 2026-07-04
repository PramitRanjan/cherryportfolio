import type { WorkProject } from '@/lib/site-content-schema';
import { ProjectCard } from '@/components/ProjectCard';

/** The editorial work index: rows with an in-row hover preview. */
export function WorkIndex({ projects }: { projects: WorkProject[] }) {
  return (
    <div style={{ borderBottom: '1px solid var(--color-line)' }}>
      {projects.map((project, i) => (
        <ProjectCard key={project.href} project={project} index={i} />
      ))}
    </div>
  );
}
