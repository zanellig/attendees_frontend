"use client";
import React from "react";
import { Button } from "./ui/button";
import { Check, Loader2, X } from "lucide-react";
import { updateAttendeesAssisted } from "@/lib/actions/attendees.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAttendee } from "@/hooks/useAttendees";
import { toast } from "sonner";

interface ConfirmationButtonProps {
  userId: string;
}

export const ConfirmationButton: React.FC<ConfirmationButtonProps> = ({
  userId,
}) => {
  const queryClient = useQueryClient();

  const { data } = useAttendee(userId);

  const isAssisted = data?.assisted;

  const mutation = useMutation({
    mutationKey: ["attendee", userId, "assisted"],
    mutationFn: () => updateAttendeesAssisted({ userId }),
    onSuccess: () => {
      toast.success(
        isAssisted ? "Se eliminó la asistencia" : "Se confirmó la asistencia"
      );
    },
    onSettled: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["attendees", userId] });
    },
    onError: (error) => {
      console.error("Error al confirmar asistencia", error);
      toast.error("Error al confirmar asistencia");
    },
  });

  return (
    <Button
      onClick={() => mutation.mutate()}
      variant={"outline"}
      className="w-full flex gap-2"
      disabled={mutation.isPending}
    >
      {mutation.isPending ? (
        <Loader2 className="animate-spin" />
      ) : isAssisted ? (
        <X />
      ) : (
        <Check />
      )}
      {mutation.isPending
        ? "Confirmando..."
        : isAssisted
        ? "Eliminar asistencia"
        : "Confirmar asistencia"}
    </Button>
  );
};
