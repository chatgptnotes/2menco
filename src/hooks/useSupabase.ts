import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useSupabaseQuery<T>(table: string, options?: { orderBy?: string; limit?: number }) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      let query = supabase.from(table).select('*')
      if (options?.orderBy) query = query.order(options.orderBy, { ascending: false })
      if (options?.limit) query = query.limit(options.limit)
      const { data: result, error: err } = await query
      if (err) {
        setError(err.message)
        setData([])
      } else {
        setData((result as T[]) || [])
        setError(null)
      }
      setLoading(false)
    }
    fetchData()
  }, [table])

  return { data, loading, error, refetch: () => { setLoading(true); /* triggers re-render */ } }
}
