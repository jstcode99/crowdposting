"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { INFLUENCER_CATEGORIES, INFLUENCER_STATUSES } from "@/types/influencer"
import {
  useInfluencers,
  type InfluencerFilters,
} from "../hooks/use-influencers"
import { InfluencerRegisterForm } from "./influencer-register-form"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  SearchIcon,
} from "lucide-react"
import type { Influencer } from "@/types/influencer"

// Table header column definition
interface ColumnDef<T> {
  key: keyof T
  label: string
  sortable?: boolean
}

const COLUMNS: ColumnDef<Influencer>[] = [
  { key: "name", label: "Nombre", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phone", label: "Teléfono" },
  { key: "instagram_url", label: "Instagram" },
  { key: "followers", label: "Seguidores", sortable: true },
  { key: "engagement_rate", label: "Engagement", sortable: true },
  { key: "category", label: "Categoría", sortable: true },
  { key: "status", label: "Estado", sortable: true },
  { key: "country", label: "País", sortable: true },
  { key: "city", label: "Ciudad", sortable: true },
]

// Format number with commas
function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-CO").format(value)
}

// Format percentage
function formatPercentage(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "percent",
    minimumFractionDigits: 2,
  }).format(value / 100)
}

// Sort icon component
function SortIcon({ field }: { field: keyof Influencer }) {
  const { sort, updateSort } = React.useContext(TableContext)

  const isActive = sort.field === field
  const direction = isActive ? sort.direction : null

  if (!isActive) {
    return <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
  }

  return direction === "asc" ? (
    <ArrowUpIcon className="size-4" />
  ) : (
    <ArrowDownIcon className="size-4" />
  )
}

// Table context for sharing state
const TableContext = React.createContext<{
  filters: InfluencerFilters
  sort: { field: keyof Influencer; direction: "asc" | "desc" }
  pagination: {
    page: number
    perPage: number
    totalCount: number
    totalPages: number
  }
  setPage: ReturnType<typeof useInfluencers>["setPage"]
  isLoading: boolean
  updateFilter: ReturnType<typeof useInfluencers>["updateFilter"]
  updateSort: ReturnType<typeof useInfluencers>["updateSort"]
}>({
  filters: {},
  sort: { field: "created_at", direction: "desc" },
  pagination: { page: 1, perPage: 10, totalCount: 0, totalPages: 0 },
  setPage: () => {},
  isLoading: false,
  updateFilter: () => {},
  updateSort: () => {},
})

// Filter bar component
function FiltersBar() {
  const { filters, updateFilter } = React.useContext(TableContext)

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Filtros</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="h-8 w-full rounded-lg border border-input bg-background py-1.5 pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
          />
        </div>

        {/* Category Filter */}
        <Select
          value={filters.category || ""}
          onValueChange={(value) =>
            updateFilter("category", value as InfluencerFilters["category"])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas las categorías</SelectItem>
            {INFLUENCER_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status || ""}
          onValueChange={(value) =>
            updateFilter("status", value as InfluencerFilters["status"])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los estados</SelectItem>
            {INFLUENCER_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Country Filter */}
        <input
          type="text"
          placeholder="País..."
          value={filters.country || ""}
          onChange={(e) => updateFilter("country", e.target.value)}
          className="h-8 rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
        />

        {/* City Filter */}
        <input
          type="text"
          placeholder="Ciudad..."
          value={filters.city || ""}
          onChange={(e) => updateFilter("city", e.target.value)}
          className="h-8 rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
        />
      </div>
    </div>
  )
}

// Pagination component
function PaginationBar() {
  const { pagination, setPage, isLoading } = React.useContext(TableContext)

  const { page, perPage, totalCount, totalPages } = pagination

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Mostrando {(page - 1) * perPage + 1} - {page * perPage} de {totalCount}{" "}
        registros
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1 || isLoading}
        >
          Anterior
        </Button>
        <span className="text-sm">
          Página {page} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages || isLoading}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}

// Sortable header cell
function SortableHeader({
  field,
  label,
}: {
  field: keyof Influencer
  label: string
}) {
  const { updateSort } = React.useContext(TableContext)

  return (
    <th
      className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors select-none hover:bg-muted/50"
      onClick={() => updateSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <SortIcon field={field} />
      </div>
    </th>
  )
}

// Main table component
export function InfluencersTable() {
  const {
    influencers,
    filters,
    sort,
    pagination: paginationState,
    isLoading,
    error,
    updateFilter,
    updateSort,
    setPage,
  } = useInfluencers()

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  // Handle successful registration
  function handleSuccess() {
    setIsDialogOpen(false)
    toast.success("Influencer registrado exitosamente")
  }

  const pagination = {
    ...paginationState,
    updateFilter,
    updateSort,
    setPage,
    isLoading,
  }

  const tableContextValue = React.useMemo(
    () => ({
      filters,
      sort,
      updateFilter,
      updateSort,
      pagination: paginationState,
      setPage,
      isLoading,
    }),
    [
      filters,
      sort,
      updateFilter,
      updateSort,
      paginationState,
      setPage,
      isLoading,
    ]
  )

  return (
    <TableContext.Provider value={tableContextValue}>
      <div className="flex flex-col gap-4">
        {/* Header with title and register button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium">Influencers</h1>
            <p className="text-muted-foreground">
              Lista de influencers registrados
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Registrar Influencer</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Influencer</DialogTitle>
                <DialogDescription>
                  Completa los datos del influencer para registrarlo en el
                  sistema
                </DialogDescription>
              </DialogHeader>
              <InfluencerRegisterForm onSuccess={handleSuccess} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <FiltersBar />

        {/* Error state */}
        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && (
          <div className="rounded-lg border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {COLUMNS.map((column) =>
                      column.sortable ? (
                        <SortableHeader
                          key={column.key}
                          field={column.key}
                          label={column.label}
                        />
                      ) : (
                        <th
                          key={column.key}
                          className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                        >
                          {column.label}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {influencers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={COLUMNS.length}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No se encontraron influencers
                      </td>
                    </tr>
                  ) : (
                    influencers.map((influencer) => (
                      <tr
                        key={influencer.id}
                        className="border-b transition-colors hover:bg-muted/30"
                      >
                        <td className="px-4 py-3 text-sm">{influencer.name}</td>
                        <td className="px-4 py-3 text-sm">
                          {influencer.email}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {influencer.phone}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {influencer.instagram_url ? (
                            <a
                              href={influencer.instagram_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Ver perfil
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {formatNumber(influencer.followers)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {formatPercentage(influencer.engagement_rate)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {influencer.category}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {influencer.status}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {influencer.country}
                        </td>
                        <td className="px-4 py-3 text-sm">{influencer.city}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {influencers.length > 0 && <PaginationBar />}
      </div>
    </TableContext.Provider>
  )
}
