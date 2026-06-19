import { cn } from '../../lib/utils'
import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react'

interface CosmicGlowButtonProps<T extends ElementType> {
  as?: T
  color?: string
  speed?: string
  className?: string
  children?: ReactNode
}

export const CosmicGlowButton = <T extends ElementType = 'button'>({
  as,
  className,
  color,
  speed = '5s',
  children,
  ...props
}: CosmicGlowButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof CosmicGlowButtonProps<T>>) => {
  const Component = (as || 'button') as ElementType
  const glowColor = color || '#ff5a1f'
  const content = children ?? 'Click me'

  return (
    <Component
      className={cn(
        'relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-2xl px-8 py-4 text-base font-semibold',
        'bg-gradient-to-r from-[#18181b] via-[#232327] to-[#18181b]',
        'text-white shadow-lg shadow-[rgba(0,0,0,0.5)]',
        className,
      )}
      {...props}
    >
      <span
        className="animate-glow-scale absolute inset-0 rounded-2xl opacity-40 blur-lg"
        style={{
          background: `radial-gradient(circle at center, ${glowColor} 10%, transparent 60%)`,
          animationDuration: speed,
          zIndex: 0,
        }}
      />
      <span
        className="animate-glow-slide absolute inset-0 rounded-2xl opacity-20"
        style={{
          background: `conic-gradient(from 90deg at 50% 50%, transparent 0deg, ${glowColor} 120deg, transparent 240deg)`,
          animationDuration: speed,
          zIndex: 0,
        }}
      />
      <span className="relative z-10">{content}</span>
    </Component>
  )
}
