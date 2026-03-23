import { Button } from '@/components/ui/Button';

interface DeleteConfirmSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  datePseudo: string;
}

export function DeleteConfirmSheet({
  isOpen,
  onClose,
  onConfirm,
  loading,
  datePseudo,
}: DeleteConfirmSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-24 shadow-xl animate-slide-up">
        <div className="px-24 pt-24 pb-32">
          <div className="w-40 h-4 bg-txt-16 rounded-full mx-auto mb-24" />

          <div className="mb-32">
            <h3 className="text-2xl font-display text-txt-100 mb-8">
              Supprimer ce date ?
            </h3>
            <p className="text-txt-60">
              Ton date avec <span className="font-medium">{datePseudo}</span> sera définitivement supprimé.
            </p>
          </div>

          <div className="space-y-12">
            <Button
              onClick={onConfirm}
              fullWidth
              variant="outline"
              loading={loading}
            >
              Oui, supprimer
            </Button>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full px-24 py-12 text-txt-60 hover:text-txt-100 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
