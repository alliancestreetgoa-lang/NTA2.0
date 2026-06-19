import Reveal from './Reveal'

interface Props {
  eyebrow: string
  title: string
  intro?: string
  /** 'light' for dark text on paper, 'dark' for white text on navy. */
  tone?: 'light' | 'dark'
  align?: 'left' | 'center'
}

export default function SectionHeading({ eyebrow, title, intro, tone = 'dark', align = 'left' }: Props) {
  const titleColor = tone === 'dark' ? 'text-white' : 'text-[#101820]'
  const introColor = tone === 'dark' ? 'text-[#9aa6b3]' : 'text-[#56616b]'
  const alignment = align === 'center' ? 'mx-auto text-center items-center' : 'items-start'
  return (
    <Reveal className={`flex max-w-3xl flex-col ${alignment}`}>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className={`font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-[-0.035em] text-balance sm:text-5xl lg:text-[3.4rem] ${titleColor}`}>
        {title}
      </h2>
      {intro && <p className={`mt-5 max-w-xl text-base leading-relaxed ${introColor}`}>{intro}</p>}
    </Reveal>
  )
}
