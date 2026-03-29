interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
  titleClassName?: string
}

export default function SectionHeader({
  title,
  subtitle,
  className = '',
  titleClassName = '',
}: SectionHeaderProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2
        className={`text-3xl md:text-4xl font-semibold text-charcoal ${titleClassName}`}
      >
        {title}
      </h2>
      <div className="mt-4 flex items-center justify-center gap-4">
        <span className="h-px w-12 bg-gold" />
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        <span className="h-px w-12 bg-gold" />
      </div>
      {subtitle && (
        <p className="mt-4 text-gray-warm max-w-xl mx-auto text-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}
