"use client";
import React from "react";
import { Button } from "./ui/button";
import { Check, Loader2, X } from "lucide-react";
import { updateAttendeesAssisted } from "@/lib/actions/attendees.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ConfirmationButtonProps {
  userId: string;
}

export const ConfirmationButton: React.FC<ConfirmationButtonProps> = ({
  userId,
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => updateAttendeesAssisted({ userId }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["attendees", userId] });
    },
  });

  const isAssisted = queryClient.getQueryData(["attendees", userId])?.assisted;

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
