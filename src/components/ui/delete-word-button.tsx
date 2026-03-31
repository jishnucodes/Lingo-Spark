"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DeleteWordButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    toast("Are you sure you want to delete this word?", {
      action: {
        label: "Delete",
        onClick: async () => {
          setIsDeleting(true);
          try {
            const res = await fetch(`/api/words/${id}`, {
              method: "DELETE",
            });
            if (res.ok) {
              toast.success("Word deleted.");
              router.refresh();
            } else {
              toast.error("Failed to delete the word.");
            }
          } catch (error) {
            console.error(error);
            toast.error("Error deleting word.");
          } finally {
            setIsDeleting(false);
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting}
      className="h-8 w-8 text-gray-400 hover:text-red-600 dark:hover:text-red-400 border border-transparent hover:border-red-100 dark:hover:border-red-900/30 transition-colors"
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );
}
