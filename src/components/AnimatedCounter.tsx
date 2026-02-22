import { useEffect, useState, useRef } from 'react'

interface Props {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
}

const AnimatedCounter = ({ value, duration = 1000, prefix = '', suffix = '', decimals = 0 }: Props) => {
  const [display, setDisplay] = useState(0)
  const startTime = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const start = display
    const diff = value - start
    startTime.current = null

    const step = (ts: number) => {
      if (!startTime.current) startTime.current = ts
      const progress = Math.min((ts - startTime.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setDisplay(start + diff * eased)
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, duration])

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString()

  return <span>{prefix}{formatted}{suffix}</span>
}

export default AnimatedCounter
