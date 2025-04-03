"use client";
import * as React from "react";
import { Button } from "./ui/button";
import { Check, Gift, Loader2 } from "lucide-react";
import {
  updateAttendeesGiffed,
} from "@/lib/actions/attendees.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAttendee } from "@/hooks/useAttendees";
import { toast } from "sonner";

interface GiveGiftButtonProps {
  userId: string;
}

export const GiveGiftButton: React.FC<GiveGiftButtonProps> = ({ userId }) => {
  const queryClient = useQueryClient();

  const { data } = useAttendee(userId);

  const [isGifted, setIsGifted] = React.useState(data?.gift_received);

  const mutation = useMutation({
    mutationFn: () => {
        setIsGifted(true);
        return updateAttendeesGiffed({ userId })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["attendee", userId] });
    },
    onError: (error) => {
      console.error("Error al confirmar el regalo", error);
      toast.error("Error al confirmar el regalo");
    },
  });

  return (
    <Button
      onClick={() => mutation.mutate()}
      variant={"default"}
      className="w-full flex gap-2"
      disabled={mutation.isPending || isGifted}
    >
      {mutation.isPending ? (
        <Loader2 className="animate-spin" />
      ) : isGifted ? (
        <Check />
      ) : (
        <Gift className={`text-${isGifted ? "red-500" : "gree-500"}`} />
      )}
      {mutation.isPending
        ? "Confirmando..."
        : isGifted
        ? "Regalo entregado"
        : "Confirmar regalo"}
    </Button>
  );
};
