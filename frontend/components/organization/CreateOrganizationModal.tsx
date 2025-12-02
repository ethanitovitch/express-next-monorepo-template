"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { useCreateOrganization } from "@/hooks/api/useOrganization";
import { organization as authClientOrganization } from "@/lib/auth-client";

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  allowClose?: boolean; // Allow closing the modal (default: false for first org)
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function findUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data } = await authClientOrganization.checkSlug({ slug });
    
    // status: true means slug is available
    if (data?.status === true) {
      return slug;
    }
    
    // If slug is taken, append a number and try again
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export default function CreateOrganizationModal({
  isOpen,
  onClose,
  onSuccess,
  allowClose = false,
}: CreateOrganizationModalProps) {
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const createMutation = useCreateOrganization();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Organization name is required");
      return;
    }

    const baseSlug = generateSlug(name);
    if (!baseSlug || baseSlug.length === 0) {
      toast.error("Please enter a valid organization name");
      return;
    }

    setIsCreating(true);

    try {
      // Find a unique slug
      const uniqueSlug = await findUniqueSlug(baseSlug);

      // Create the organization with the unique slug
      createMutation.mutate(
        { name: name.trim(), slug: uniqueSlug },
        {
          onSuccess: (result) => {
            if (result.error) {
              toast.error(result.error.message || "Failed to create organization");
              setIsCreating(false);
            } else {
              toast.success("Organization created successfully!");
              setName("");
              setIsCreating(false);
              onSuccess?.();
              onClose();
            }
          },
          onError: () => {
            toast.error("An error occurred. Please try again.");
            setIsCreating(false);
          },
        }
      );
    } catch {
      toast.error("Failed to generate unique slug. Please try again.");
      setIsCreating(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Create Organization" 
      subtitle={allowClose ? "Add a new organization to your account." : "To get started, please create your first organization."} 
      showCloseButton={allowClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Organization Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Company"
          required
          autoFocus
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isCreating}
            className="flex-1"
          >
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
}

