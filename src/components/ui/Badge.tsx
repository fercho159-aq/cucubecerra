type BadgeVariant = 'default' | 'success' | 'error'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gold/10 text-gold-dark border-gold/20',
  success: 'bg-success/10 text-success border-success/20',
  error: 'bg-error/10 text-error border-error/20',
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
