import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: Variant
  size?: Size
  loading?: boolean
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type ButtonAsLink = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

type ButtonProps = ButtonAsButton | ButtonAsLink

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gold text-white hover:bg-gold-dark focus-visible:ring-gold',
  outline:
    'border-2 border-gold text-gold hover:bg-gold hover:text-white focus-visible:ring-gold',
  ghost:
    'text-charcoal hover:bg-beige focus-visible:ring-charcoal',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3 text-lg',
}

export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    loading = false,
    className = '',
    children,
    ...rest
  } = props

  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-full font-medium',
    'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(' ')

  const content = (
    <>
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </>
  )

  if (props.href !== undefined) {
    const { variant: _v, size: _s, loading: _l, ...anchorProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & ButtonBaseProps
    return (
      <a className={classes} href={props.href} {...anchorProps}>
        {content}
      </a>
    )
  }

  const { variant: _v, size: _s, loading: _l, ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement> & ButtonBaseProps
  return (
    <button className={classes} disabled={loading} {...buttonProps}>
      {content}
    </button>
  )
}
