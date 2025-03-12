"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAttendee } from "@/hooks/useAttendees";
import { AttendeeDetails } from "@/components/AttendeeDetails";
import { AttendeeForm } from "@/components/AttendeeForm";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  ArrowLeft,
  Edit,
  MessageCircleIcon,
  MailIcon,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export default function AttendeePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: attendee, isLoading, isError } = useAttendee(id);
  const [activeTab, setActiveTab] = useState("details");

  const handleBackClick = () => {
    router.push("/");
  };

  const handleEditSuccess = () => {
    setActiveTab("details");
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (isError || !attendee) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center p-8 border rounded-md bg-red-50 text-red-500">
            <p>
              Error al cargar los detalles del asistente. Es posible que el
              asistente no exista.
            </p>
            <Button onClick={handleBackClick} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la Lista de Asistentes
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>

            {activeTab === "details" && (
              <Button onClick={() => setActiveTab("edit")}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Asistente
              </Button>
            )}
          </div>

          <section className="flex justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{attendee.name}</h1>
              <p className="text-muted-foreground">
                {attendee.email} • {attendee.phone_number}
              </p>
            </div>
            <div className="flex space-x-2">
              {/* via mail */}
              <Button
                variant="secondary"
                onClick={() => {
                  const mailtoUrl = `mailto:${attendee.email}`;
                  window.open(mailtoUrl, "_blank");
                }}
              >
                <MailIcon className="mr-2 h-4 w-4" />
                Contactar vía Mail
              </Button>
              {/* via whatsapp */}
              <Button
                className="bg-green-700 hover:bg-green-800 text-white"
                onClick={() => {
                  const whatsappUrl = `https://wa.me/${attendee.phone_number}`;
                  window.open(whatsappUrl, "_blank");
                }}
              >
                <MessageCircleIcon className="mr-2 h-4 w-4" />
                Contactar vía Whatsapp
              </Button>
            </div>
          </section>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="edit">Editar</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <AttendeeDetails attendee={attendee} />
            </TabsContent>
            <TabsContent value="edit" className="mt-6">
              <AttendeeForm attendee={attendee} onSuccess={handleEditSuccess} />
            </TabsContent>
          </Tabs>
        </div>
        <Toaster />
      </main>
    </>
  );
}
