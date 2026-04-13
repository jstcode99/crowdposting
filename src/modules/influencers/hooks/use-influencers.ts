import * as React from "react"
import { supabase } from "@/lib/supabase/client"
import type { Influencer, InfluencerCategory, InfluencerStatus } from "@/types/influencer"

export interface InfluencerFilters {
  category?: InfluencerCategory | ""
  status?: InfluencerStatus | ""
  country?: string
  city?: string
  search?: string
}

export interface SortConfig {
  field: keyof Influencer
  direction: "asc" | "desc"
}

export interface PaginationConfig {
  page: number
  perPage: number
}

const DEFAULT_PER_PAGE = 10

export function useInfluencers() {
  const [influencers, setInfluencers] = React.useState<Influencer[]>([])
  const [filters, setFilters] = React.useState<InfluencerFilters>({
    category: "",
    status: "",
    country: "",
    city: "",
    search: "",
  })
  const [sort, setSort] = React.useState<SortConfig>({
    field: "created_at",
    direction: "desc",
  })
  const [pagination, setPagination] = React.useState<PaginationConfig>({
    page: 1,
    perPage: DEFAULT_PER_PAGE,
  })
  const [totalCount, setTotalCount] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Subscribe to realtime changes
  React.useEffect(() => {
    const channel = supabase
      .channel("influencers-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "influencers",
        },
        (payload) => {
          // Refresh data on any change
          fetchInfluencers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Fetch influencers based on filters and pagination
  async function fetchInfluencers() {
    setIsLoading(true)
    setError(null)

    try {
      const offset = (pagination.page - 1) * pagination.perPage

      let query = supabase
        .from("influencers")
        .select("*", { count: "exact" })

      // Apply filters
      if (filters.category) {
        query = query.eq("category", filters.category)
      }
      if (filters.status) {
        query = query.eq("status", filters.status)
      }
      if (filters.country) {
        query = query.ilike("country", `%${filters.country}%`)
      }
      if (filters.city) {
        query = query.ilike("city", `%${filters.city}%`)
      }
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        )
      }

      // Apply sorting
      query = query.order(sort.field, { ascending: sort.direction === "asc" })

      // Apply pagination
      query = query.range(offset, offset + pagination.perPage - 1)

      const { data, error: fetchError, count } = await query

      if (fetchError) {
        setError(fetchError.message)
        return
      }

      setInfluencers(data as Influencer[])
      setTotalCount(count || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch on filters, sort, or pagination change
  React.useEffect(() => {
    fetchInfluencers()
  }, [filters, sort, pagination.page, pagination.perPage])

  // Update filter helpers
  function updateFilter<K extends keyof InfluencerFilters>(
    key: K,
    value: InfluencerFilters[K]
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, page: 1 })) // Reset to page 1
  }

  function updateSort(field: keyof Influencer) {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  function setPage(page: number) {
    setPagination((prev) => ({ ...prev, page }))
  }

  const totalPages = Math.ceil(totalCount / pagination.perPage)

  return {
    influencers,
    filters,
    sort,
    pagination: { ...pagination, totalCount, totalPages },
    isLoading,
    error,
    updateFilter,
    updateSort,
    setPage,
    refresh: fetchInfluencers,
  }
}