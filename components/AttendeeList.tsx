"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Attendee } from "@/lib/types";
import { useAttendees, useDeleteAttendee } from "@/hooks/useAttendees";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AttendeeForm } from "@/components/AttendeeForm";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Loader2, Eye, Search } from "lucide-react";

export function AttendeeList() {
  const router = useRouter();
  const { data: attendees, isLoading, isError } = useAttendees();
  const deleteAttendee = useDeleteAttendee();

  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [attendeeToDelete, setAttendeeToDelete] = useState<Attendee | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Format the phone number for display
  const formatPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return "-";

    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Extract the last 10 digits (the actual phone number without country code and the 9)
    const last10 = cleaned.slice(-10);

    if (last10.length === 10) {
      return `${last10.substring(0, 2)}-${last10.substring(
        2,
        6
      )}-${last10.substring(6)}`;
    }

    return phoneNumber;
  };

  // Filter attendees based on search query
  const filteredAttendees = useMemo(() => {
    if (!attendees || !searchQuery.trim()) return attendees;

    const query = searchQuery.toLowerCase().trim();
    return attendees.filter(
      (attendee) =>
        attendee.name?.toLowerCase().includes(query) ||
        attendee.email?.toLowerCase().includes(query) ||
        attendee.phone_number?.toLowerCase().includes(query) ||
        attendee.company?.toLowerCase().includes(query)
    );
  }, [attendees, searchQuery]);

  const handleEdit = (attendee: Attendee) => {
    setSelectedAttendee(attendee);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (attendee: Attendee) => {
    setAttendeeToDelete(attendee);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (attendee: Attendee) => {
    router.push(`/attendees/${attendee.id}`);
  };

  const confirmDelete = async () => {
    if (!attendeeToDelete) return;

    try {
      await deleteAttendee.mutateAsync(attendeeToDelete.id!);
      toast.success("Asistente eliminado con éxito");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al eliminar el asistente"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-4 text-red-700 bg-red-50 rounded-md border border-red-200">
        Error al cargar los asistentes. Por favor, inténtelo de nuevo más tarde.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Asistentes al Evento: {filteredAttendees?.length || 0}
        </h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Asistente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogTitle>Añadir Nuevo Asistente</DialogTitle>
            <AttendeeForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, correo, teléfono o empresa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredAttendees && filteredAttendees.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Tamaño del Grupo</TableHead>
                <TableHead>Fecha de Confirmación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendees.map((attendee) => (
                <TableRow
                  key={attendee.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleView(attendee)}
                >
                  <TableCell className="font-medium">{attendee.name}</TableCell>
                  <TableCell>{attendee.email}</TableCell>
                  <TableCell>
                    {formatPhoneNumber(attendee.phone_number)}
                  </TableCell>
                  <TableCell>{attendee.company || "-"}</TableCell>
                  <TableCell>{attendee.group_size}</TableCell>
                  <TableCell>
                    {attendee.confirmation_date
                      ? format(
                          new Date(attendee.confirmation_date),
                          "dd/MM/yyyy"
                        )
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div
                      className="flex justify-end space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleView(attendee)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(attendee)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(attendee)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md bg-muted/50">
          <p className="text-muted-foreground">
            {searchQuery
              ? "No se encontraron asistentes que coincidan con la búsqueda."
              : "No se encontraron asistentes. Añada su primer asistente para comenzar."}
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogTitle>Editar Asistente</DialogTitle>
          {selectedAttendee && (
            <AttendeeForm
              attendee={selectedAttendee}
              onSuccess={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará permanentemente el registro de{" "}
              {attendeeToDelete?.name}. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteAttendee.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
