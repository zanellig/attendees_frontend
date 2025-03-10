import { AttendeeList } from "@/components/AttendeeList";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Sistema de Confirmación de Eventos
            </h1>
            <p className="text-muted-foreground mt-2">
              Gestione asistentes al evento y realice seguimiento de
              confirmaciones
            </p>
          </div>

          <AttendeeList />
        </div>
        <Toaster />
      </main>
    </>
  );
}
