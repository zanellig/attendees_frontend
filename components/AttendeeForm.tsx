"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Attendee, AttendeeFormData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCreateAttendee, useUpdateAttendee } from "@/hooks/useAttendees";
import { toast } from "sonner";
import { isValidPhoneNumber } from "@/lib/utils";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  phone_number: z.string().refine(isValidPhoneNumber, {
    message: "El número de teléfono debe tener 10 dígitos (ej: 11-XXXX-XXXX)",
  }),
  email: z
    .string()
    .email({ message: "Dirección de correo electrónico inválida" }),
  job_title: z.string().optional(),
  company: z.string().min(1, { message: "La empresa es obligatoria" }),
  group_size: z.coerce
    .number()
    .min(1, { message: "El tamaño del grupo debe ser al menos 1" }),
  dietary_preferences: z.string().optional(),
  additional_comments: z.string().optional(),
});

interface AttendeeFormProps {
  attendee?: Attendee;
  onSuccess?: () => void;
}

export function AttendeeForm({ attendee, onSuccess }: AttendeeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState("54");
  const createAttendee = useCreateAttendee();
  const updateAttendee = useUpdateAttendee(attendee?.id || 0);
  const isEditing = !!attendee?.id;

  // Format the phone number for display if editing
  const formatInitialPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return "";
    const cleaned = phoneNumber.replace(/\D/g, "");
    // Take only the last 10 digits if longer
    const last10 = cleaned.slice(-10);
    if (last10.length === 10) {
      return `${last10.substring(0, 2)}-${last10.substring(
        2,
        6
      )}-${last10.substring(6)}`;
    }
    return phoneNumber;
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AttendeeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: attendee
      ? {
          ...attendee,
          phone_number: formatInitialPhoneNumber(attendee.phone_number),
        }
      : {
          name: "",
          phone_number: "",
          email: "",
          job_title: "",
          company: "",
          group_size: 1,
          dietary_preferences: "",
          additional_comments: "",
        },
  });

  const onSubmit = async (data: AttendeeFormData) => {
    setIsSubmitting(true);
    try {
      // Transform the phone number to the required format for the backend
      const transformedData = {
        ...data,
        phone_number: `${countryCode}9${data.phone_number.replace(/\D/g, "")}`,
      };

      if (isEditing) {
        await updateAttendee.mutateAsync(transformedData);
        toast.success("Asistente actualizado con éxito");
      } else {
        await createAttendee.mutateAsync(transformedData);
        toast.success("Asistente añadido con éxito");
        reset();
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ha ocurrido un error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <Controller
            name="phone_number"
            control={control}
            render={({ field }) => (
              <PhoneInput
                id="phone_number"
                label="Número de Teléfono *"
                countryCode={countryCode}
                onCountryCodeChange={setCountryCode}
                error={errors.phone_number?.message}
                {...field}
              />
            )}
          />

          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Nota:</strong> El número de teléfono debe tener 10 dígitos
              en el formato: 11-XXXX-XXXX. Solo se permiten números.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job_title">Puesto de Trabajo</Label>
              <Input id="job_title" {...register("job_title")} />
              {errors.job_title && (
                <p className="text-sm text-red-500">
                  {errors.job_title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa *</Label>
              <Input id="company" {...register("company")} />
              {errors.company && (
                <p className="text-sm text-red-500">{errors.company.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="group_size">Tamaño del Grupo *</Label>
            <Input
              id="group_size"
              type="number"
              min="1"
              {...register("group_size")}
            />
            {errors.group_size && (
              <p className="text-sm text-red-500">
                {errors.group_size.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietary_preferences">Preferencias Dietéticas</Label>
            <Input
              id="dietary_preferences"
              {...register("dietary_preferences")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional_comments">Comentarios Adicionales</Label>
            <Textarea
              id="additional_comments"
              {...register("additional_comments")}
            />
          </div>

          {/* aviso que los campos marcados con * son obligatorios */}
          {errors.name ||
          errors.email ||
          errors.phone_number ||
          errors.company ||
          errors.group_size ? (
            <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-md border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-300">
                Los campos marcados con * son obligatorios.
              </p>
            </div>
          ) : null}
        </CardContent>

        <CardFooter className="flex justify-end space-x-2 pt-4">
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess?.()}
            >
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Guardando..."
              : isEditing
              ? "Actualizar"
              : "Enviar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
