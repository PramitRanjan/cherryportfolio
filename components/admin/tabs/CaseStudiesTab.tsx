'use client';

import { useState } from 'react';
import type { SiteContent, CaseStudyContent, CaseSection, MediaBlock, ProjectLink } from '@/lib/site-content-schema';
import type { Patch } from '@/components/admin/DashboardEditor';
import {
  TextField,
  AreaField,
  StringListField,
  ImageField,
  ItemCard,
  AddButton,
  moveItem,
  type useImagePicker,
} from '@/components/admin/fields';

const EMPTY_STUDY: CaseStudyContent = {
  slug: '',
  title: '',
  oneliner: '',
  type: '',
  tags: [],
  prev: null,
  next: null,
  sections: [],
};

const EMPTY_SECTION: CaseSection = { key: '', eyebrow: '', body: '' };
const EMPTY_MEDIA: MediaBlock = { kind: 'image' };

function MediaBlockEditor({
  media,
  onChange,
  picker,
}: {
  media: MediaBlock[];
  onChange: (media: MediaBlock[]) => void;
  picker: ReturnType<typeof useImagePicker>;
}) {
  function update(i: number, next: MediaBlock) {
    const copy = [...media];
    copy[i] = next;
    onChange(copy);
  }

  return (
    <div className="mt-3">
      <span className="u-eyebrow block mb-2">media</span>
      {media.map((block, i) => (
        <ItemCard
          key={i}
          title={`${block.kind || 'media'} ${i + 1}`}
          onMoveUp={i > 0 ? () => onChange(moveItem(media, i, -1)) : undefined}
          onMoveDown={i < media.length - 1 ? () => onChange(moveItem(media, i, 1)) : undefined}
          onRemove={() => onChange(media.filter((_, j) => j !== i))}
        >
          <div className="mb-4">
            <span className="u-eyebrow block mb-1.5">kind</span>
            <select
              value={block.kind}
              onChange={(e) => update(i, { ...block, kind: e.target.value as MediaBlock['kind'] })}
              style={{ border: '1px solid var(--color-line)', background: 'var(--color-surface)', padding: '0.5rem 0.7rem', width: '100%' }}
            >
              <option value="image">image</option>
              <option value="gallery">gallery</option>
              <option value="embed">embed</option>
            </select>
          </div>
          <StringListField
            label="images"
            items={block.images ?? []}
            onChange={(v) => update(i, { ...block, images: v })}
            placeholder="image path"
          />
          <TextField label="embed url" value={block.embedUrl ?? ''} onChange={(v) => update(i, { ...block, embedUrl: v })} />
          <TextField label="caption" value={block.caption ?? ''} onChange={(v) => update(i, { ...block, caption: v })} />
          <div className="mb-4">
            <span className="u-eyebrow block mb-1.5">layout</span>
            <select
              value={block.layout ?? ''}
              onChange={(e) => update(i, { ...block, layout: (e.target.value || undefined) as MediaBlock['layout'] })}
              style={{ border: '1px solid var(--color-line)', background: 'var(--color-surface)', padding: '0.5rem 0.7rem', width: '100%' }}
            >
              <option value="">( default )</option>
              <option value="full">full</option>
              <option value="inset">inset</option>
              <option value="split">split</option>
            </select>
          </div>
        </ItemCard>
      ))}
      <AddButton label="media block" onClick={() => onChange([...media, { ...EMPTY_MEDIA }])} />
    </div>
  );
}

function SectionsEditor({
  sections,
  onChange,
  picker,
}: {
  sections: CaseSection[];
  onChange: (sections: CaseSection[]) => void;
  picker: ReturnType<typeof useImagePicker>;
}) {
  function update(i: number, next: CaseSection) {
    const copy = [...sections];
    copy[i] = next;
    onChange(copy);
  }

  return (
    <div>
      <span className="u-eyebrow block mb-3">sections</span>
      {sections.map((section, i) => (
        <ItemCard
          key={i}
          title={section.eyebrow || section.key || `section ${i + 1}`}
          onMoveUp={i > 0 ? () => onChange(moveItem(sections, i, -1)) : undefined}
          onMoveDown={i < sections.length - 1 ? () => onChange(moveItem(sections, i, 1)) : undefined}
          onRemove={() => onChange(sections.filter((_, j) => j !== i))}
        >
          <TextField label="key" value={section.key} onChange={(v) => update(i, { ...section, key: v })} />
          <TextField label="eyebrow" value={section.eyebrow} onChange={(v) => update(i, { ...section, eyebrow: v })} />
          <TextField label="headline" value={section.headline ?? ''} onChange={(v) => update(i, { ...section, headline: v })} />
          <AreaField label="body" value={section.body} onChange={(v) => update(i, { ...section, body: v })} minRows={5} />
          <MediaBlockEditor
            media={section.media ?? []}
            onChange={(v) => update(i, { ...section, media: v })}
            picker={picker}
          />
        </ItemCard>
      ))}
      <AddButton label="section" onClick={() => onChange([...sections, { ...EMPTY_SECTION }])} />
    </div>
  );
}

function ProjectLinkEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ProjectLink | null;
  onChange: (v: ProjectLink | null) => void;
}) {
  return (
    <div className="mb-4">
      <span className="u-eyebrow block mb-2">{label}</span>
      <label className="flex items-center gap-2 mb-2 u-eyebrow">
        <input
          type="checkbox"
          checked={value === null}
          onChange={(e) => onChange(e.target.checked ? null : { title: '', href: '' })}
        />
        none
      </label>
      {value !== null && (
        <div>
          <TextField label="title" value={value.title} onChange={(v) => onChange({ ...value, title: v })} />
          <TextField label="href" value={value.href} onChange={(v) => onChange({ ...value, href: v })} />
        </div>
      )}
    </div>
  );
}

export default function CaseStudiesTab({
  content,
  patch,
  picker,
}: {
  content: SiteContent;
  patch: Patch;
  picker: ReturnType<typeof useImagePicker>;
}) {
  const studies = content.caseStudies;
  const [openIndex, setOpenIndex] = useState<number | null>(studies.length > 0 ? 0 : null);

  function setStudies(next: CaseStudyContent[]) {
    patch((d) => { d.caseStudies = next; return d; });
  }

  function update(i: number, next: CaseStudyContent) {
    const copy = [...studies];
    copy[i] = next;
    setStudies(copy);
  }

  return (
    <div>
      {studies.map((study, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="mb-4" style={{ border: '1px solid var(--color-line)', background: 'var(--color-surface)' }}>
            <div className="flex items-center justify-between p-4">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="u-eyebrow text-left flex-1"
                style={{ color: 'var(--color-ink)' }}
              >
                {isOpen ? '( ' : ''}
                {study.title || study.slug || `case study ${i + 1}`}
                {isOpen ? ' )' : ''}
              </button>
              <div className="flex gap-3 u-eyebrow">
                <button type="button" onClick={() => setStudies(moveItem(studies, i, -1))} disabled={i === 0} style={{ opacity: i === 0 ? 0.3 : 1 }}>
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => setStudies(moveItem(studies, i, 1))}
                  disabled={i === studies.length - 1}
                  style={{ opacity: i === studies.length - 1 ? 0.3 : 1 }}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => setStudies(studies.filter((_, j) => j !== i))}
                  style={{ color: 'var(--color-pop-red)' }}
                >
                  remove
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="p-4" style={{ borderTop: '1px solid var(--color-line)' }}>
                <TextField label="slug" value={study.slug} onChange={(v) => update(i, { ...study, slug: v })} />
                <TextField label="title" value={study.title} onChange={(v) => update(i, { ...study, title: v })} />
                <TextField label="oneliner" value={study.oneliner} onChange={(v) => update(i, { ...study, oneliner: v })} />
                <TextField label="type" value={study.type} onChange={(v) => update(i, { ...study, type: v })} />
                <TextField label="year" value={study.year ?? ''} onChange={(v) => update(i, { ...study, year: v })} />
                <TextField label="award" value={study.award ?? ''} onChange={(v) => update(i, { ...study, award: v })} />
                <TextField label="team" value={study.team ?? ''} onChange={(v) => update(i, { ...study, team: v })} />
                <TextField label="accent" value={study.accent ?? ''} onChange={(v) => update(i, { ...study, accent: v })} />
                <ImageField
                  label="hero image"
                  value={study.heroImage ?? ''}
                  onChange={(v) => update(i, { ...study, heroImage: v })}
                  onPick={() => picker.openPicker((path) => update(i, { ...study, heroImage: path }))}
                />
                <AreaField label="pull quote" value={study.pullQuote ?? ''} onChange={(v) => update(i, { ...study, pullQuote: v })} minRows={2} />
                <StringListField label="tags" items={study.tags} onChange={(v) => update(i, { ...study, tags: v })} placeholder="tag" />

                <ProjectLinkEditor label="prev" value={study.prev} onChange={(v) => update(i, { ...study, prev: v })} />
                <ProjectLinkEditor label="next" value={study.next} onChange={(v) => update(i, { ...study, next: v })} />

                <SectionsEditor
                  sections={study.sections}
                  onChange={(v) => update(i, { ...study, sections: v })}
                  picker={picker}
                />
              </div>
            )}
          </div>
        );
      })}
      <AddButton
        label="case study"
        onClick={() => {
          setStudies([...studies, { ...EMPTY_STUDY }]);
          setOpenIndex(studies.length);
        }}
      />
    </div>
  );
}
