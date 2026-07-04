import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCaseStudy, getSiteContent } from '@/lib/site-content';
import { CaseStudyLayout } from '@/components/CaseStudyLayout';

export function generateStaticParams() {
  return getSiteContent().caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return { title: study.title, description: study.oneliner };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <main>
      <CaseStudyLayout study={study} />
    </main>
  );
}
