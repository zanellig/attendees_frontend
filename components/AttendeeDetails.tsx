"use client";

import { format } from "date-fns";
import { Attendee } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AttendeeDetailsProps {
  attendee: Attendee;
}

export function AttendeeDetails({ attendee }: AttendeeDetailsProps) {
  // Format the phone number for display
  const formatPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return "-";

    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Extract the last 10 digits (the actual phone number without country code and the 9)
    const last10 = cleaned.slice(-10);

    if (last10.length === 10) {
      return `+${cleaned.slice(0, cleaned.length - 10)} ${last10.substring(
        0,
        2
      )}-${last10.substring(2, 6)}-${last10.substring(6)}`;
    }

    return phoneNumber;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Detalles del Asistente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Nombre
            </h3>
            <p className="text-base">{attendee.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Correo Electrónico
            </h3>
            <p className="text-base">{attendee.email}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Número de Teléfono
            </h3>
            <p className="text-base">
              {formatPhoneNumber(attendee.phone_number)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Tamaño del Grupo
            </h3>
            <p className="text-base">{attendee.group_size}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Puesto de Trabajo
            </h3>
            <p className="text-base">{attendee.job_title || "-"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Empresa
            </h3>
            <p className="text-base">{attendee.company || "-"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Fecha de Confirmación
            </h3>
            <p className="text-base">
              {attendee.confirmation_date
                ? format(new Date(attendee.confirmation_date), "dd/MM/yyyy")
                : "-"}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Preferencias Dietéticas
          </h3>
          <p className="text-base">
            {attendee.dietary_preferences || "No especificado"}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Comentarios Adicionales
          </h3>
          <p className="text-base whitespace-pre-wrap">
            {attendee.additional_comments || "Sin comentarios adicionales"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
