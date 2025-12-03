import { DBOrganization } from "@shared/types/src";
import Modal from "../ui/Modal";

interface SelectOrganizationModalProps {
  isOpen: boolean;
  organizations: DBOrganization[];
  onSelect: (org: DBOrganization) => void;
  isLoading?: boolean;
}

export default function SelectOrganizationModal({
  isOpen,
  organizations,
  onSelect,
  isLoading = false,
}: SelectOrganizationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Select Organization" showCloseButton={false}>
      <div className="space-y-4">
        <p className="text-muted-foreground text-center">
          Which organization will you be working in today?
        </p>

        <div className="space-y-2">
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => onSelect(org)}
              disabled={isLoading}
              className="w-full p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-muted transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="font-medium text-foreground">{org.name}</div>
              <div className="text-sm text-muted-foreground">@{org.slug}</div>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
