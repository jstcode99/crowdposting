"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { INFLUENCER_CATEGORIES, INFLUENCER_STATUSES } from "@/types/influencer"
import {
  influencerSchema,
  type InfluencerInput,
  defaultInfluencerValues,
} from "../schemas/influencer.schema"
import { createInfluencerAction } from "../actions/influencer.actions"

interface InfluencerRegisterFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function InfluencerRegisterForm({
  onSuccess,
  onCancel,
}: InfluencerRegisterFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<InfluencerInput>({
    resolver: zodResolver(influencerSchema),
    defaultValues: defaultInfluencerValues,
    mode: "onBlur",
  })

  async function onSubmit(data: InfluencerInput) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value))
      })

      await createInfluencerAction(formData)
      toast.success("Influencer registrado exitosamente")
      form.reset(defaultInfluencerValues)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCancel() {
    form.reset(defaultInfluencerValues)
    onCancel?.()
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Registrar Influencer</CardTitle>
        <CardDescription>
          Completa los datos del influencer para registrarlo en el sistema
        </CardDescription>
      </CardHeader>
      <form id="influencer-form" onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <FieldGroup>
            {/* Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="influencer-form-name">
                    Nombre completo
                  </FieldLabel>
                  <Input
                    {...field}
                    id="influencer-form-name"
                    placeholder="Juan Pérez"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="influencer-form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="influencer-form-email"
                    type="email"
                    placeholder="juan@ejemplo.com"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Phone */}
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="influencer-form-phone">
                    Teléfono
                  </FieldLabel>
                  <Input
                    {...field}
                    id="influencer-form-phone"
                    type="tel"
                    placeholder="+57 300 123 4567"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Instagram URL */}
            <Controller
              name="instagram_url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="influencer-form-instagram">
                    URL de Instagram
                  </FieldLabel>
                  <Input
                    {...field}
                    id="influencer-form-instagram"
                    type="url"
                    placeholder="https://instagram.com/usuario"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Followers and Engagement Rate Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                name="followers"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="influencer-form-followers">
                      Seguidores
                    </FieldLabel>
                    <Input
                      {...field}
                      id="influencer-form-followers"
                      type="number"
                      min="0"
                      placeholder="10000"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : 0
                        )
                      }
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="engagement_rate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="influencer-form-engagement">
                      Tasa de Engagement (%)
                    </FieldLabel>
                    <Input
                      {...field}
                      id="influencer-form-engagement"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="5.5"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseFloat(e.target.value) : 0
                        )
                      }
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Category */}
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="influencer-form-category">
                    Categoría
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="influencer-form-category"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {INFLUENCER_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Country and City Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                name="country"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="influencer-form-country">
                      País
                    </FieldLabel>
                    <Input
                      {...field}
                      id="influencer-form-country"
                      placeholder="Colombia"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="influencer-form-city">
                      Ciudad
                    </FieldLabel>
                    <Input
                      {...field}
                      id="influencer-form-city"
                      placeholder="Bogotá"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Status */}
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="influencer-form-status">
                    Estado
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="influencer-form-status"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {INFLUENCER_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? "Registrando..." : "Registrar Influencer"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
