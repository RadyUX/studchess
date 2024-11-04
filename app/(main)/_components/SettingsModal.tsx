"use client";
import {signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader
} from "@/components/ui/dialog";
import { useSettings } from "@/hooks/useSetting";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { updateUserSettings } from "@/actions/auth";
import unstable_update from "next-auth";

export const SettingsModal = () => {
    const session = useSession();
    const settings = useSettings();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!session?.data?.user) {
          console.error("La session ou les données utilisateur ne sont pas disponibles");
          alert("Erreur : les informations utilisateur ne sont pas disponibles");
          return;
        }
      // Récupérez les données du formulaire
      const formData = new FormData(event.target);
      const newObjectif = {
        bullet: formData.get("bullet")?.toString() || "0", // Conversion en string avec valeur par défaut
        blitz: formData.get("blitz")?.toString() || "0",
        rapid: formData.get("rapid")?.toString() || "0",
        userId: session?.data?.user?.id || "",
      };
  
      // Appelez la server action pour mettre à jour les informations utilisateur
      try {
        // Mettez à jour les informations utilisateur dans la base de données
        await updateUserSettings(newObjectif);
    

        settings.onClose(); // Fermez le modal après la mise à jour
        alert("Objectifs ELO updated ! Please Login Again to see the changes");
      } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        alert("Une erreur est survenue lors de la mise à jour.");
      }
    };
  
    return (
      <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
        <DialogContent>
          <DialogHeader className="border-b pb-3">
            <h2 className="text-lg font-bold text-[#0077B6]">My settings</h2>
          </DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-1">
              <Label className="text-lg font-bold text-[#0077B6]">Objectif</Label>
              <span className="text-[1rem] text-[#0077B6]">Enter a new objectif</span>
  
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-y-4">
                  <input type="text" name="bullet" placeholder="bullet" className="text-black p-4 rounded-md" required />
                  <input type="text" name="blitz" placeholder="blitz" className="text-black p-4 rounded-md" required />
                  <input type="text" name="rapid" placeholder="Rapid" className="text-black p-4 rounded-md" required />
                </div>
                <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">Enregistrer</button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  