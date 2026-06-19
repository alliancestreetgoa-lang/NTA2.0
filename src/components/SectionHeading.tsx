import Reveal from './Reveal'

interface Props {
  eyebrow: string
  title: string
  intro?: string
  /** 'light' for dark text on paper, 'dark' for white text on near-black. */
  tone?: 'light' | 'dark'
  align?: 'left' | 'center'
  /** Editorial index, e.g. "01". */
  index?: string
}

export default function SectionHeading({ eyebrow, title, intro, tone = 'dark', align = 'left', index }: Props) {
  const titleColor = tone === 'dark' ? 'text-white' : 'text-[#0a0a0b]'
  const introColor = tone === 'dark' ? 'text-[#948f85]' : 'text-[#56616b]'
  const ruleColor = tone === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)'
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start'

  return (
    <Reveal className={`flex w-full flex-col ${alignment}`}>
      {/* Editorial rule: mono eyebrow · line · index */}
      <div className="mb-6 flex w-full items-center gap-5">
        <p className="eyebrow">{eyebrow}</p>
        <span className="h-px flex-1" style={{ background: ruleColor }} />
        {index && (
          <span
            className="text-xs tracking-[0.12em] text-white/35"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            {index} / 05
          </span>
        )}
      </div>
      <h2
        className={`font-display max-w-3xl text-4xl font-extrabold uppercase leading-[0.95] tracking-[-0.035em] text-balance sm:text-5xl lg:text-[3.4rem] ${titleColor}`}
      >
        {title}
      </h2>
      {intro && <p className={`mt-5 max-w-xl text-base leading-relaxed ${introColor}`}>{intro}</p>}
    </Reveal>
  )
}
