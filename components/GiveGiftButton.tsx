"use client";
import * as React from "react";
import { Button } from "./ui/button";
import { Check, Gift, Loader2 } from "lucide-react";
import { updateAttendeesGiffed } from "@/lib/actions/attendees.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAttendee } from "@/hooks/useAttendees";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface GiveGiftButtonProps {
  userId: string;
}

export const GiveGiftButton: React.FC<GiveGiftButtonProps> = ({ userId }) => {
  const queryClient = useQueryClient();

  const { data } = useAttendee(userId);

  const [isGifted, setIsGifted] = React.useState(!!data?.gift_received);

  const mutation = useMutation({
    mutationKey: ["attendee", userId, "gift"],
    mutationFn: () => {
      setIsGifted(true);
      return updateAttendeesGiffed({ userId });
    },
    onSuccess: () => {
      toast.success("Se confirmó la entrega del regalo");
      displayConfetti();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["attendee", userId] });
    },
    onError: (error) => {
      console.error("Error al confirmar el regalo", error);
      toast.error("Error al confirmar el regalo");
    },
  });

  const displayConfetti = () => {
    const end = Date.now() + 700;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

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
        <Gift className={`text-${isGifted ? "red-500" : "green-500"}`} />
      )}
      {mutation.isPending
        ? "Confirmando..."
        : isGifted
        ? "Regalo entregado"
        : "Confirmar regalo"}
    </Button>
  );
};
