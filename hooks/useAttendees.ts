import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Attendee, AttendeeFormData } from "@/lib/types";

// Fetch all attendees
export function useAttendees() {
  return useQuery({
    queryKey: ["attendees"],
    queryFn: async () => {
      const response = await fetch("/api/attendees");
      if (!response.ok) {
        throw new Error("Failed to fetch attendees");
      }
      return response.json() as Promise<Attendee[]>;
    },
  });
}

// Fetch a single attendee by ID
export function useAttendee(id: number | string | undefined) {
  return useQuery({
    queryKey: ["attendees", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await fetch(`/api/attendees/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch attendee");
      }
      return response.json() as Promise<Attendee>;
    },
    enabled: !!id, // Only run the query if we have an ID
  });
}

// Create a new attendee
export function useCreateAttendee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AttendeeFormData) => {
      const response = await fetch("/api/attendees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create attendee");
      }

      return response.json() as Promise<Attendee>;
    },
    onSuccess: () => {
      // Invalidate the attendees query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["attendees"] });
    },
  });
}

// Update an existing attendee
export function useUpdateAttendee(id: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AttendeeFormData) => {
      const response = await fetch(`/api/attendees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update attendee");
      }

      return response.json() as Promise<Attendee>;
    },
    onSuccess: () => {
      // Invalidate both the list and the individual attendee queries
      queryClient.invalidateQueries({ queryKey: ["attendees"] });
      queryClient.invalidateQueries({ queryKey: ["attendees", id] });
    },
  });
}

// Delete an attendee
export function useDeleteAttendee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const response = await fetch(`/api/attendees/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete attendee");
      }

      return response.json();
    },
    onError: (error) => {
      console.error("Error deleting attendee:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["attendees"] });
    },
  });
}
