import Modal from './Modal';

type Props = {
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmDialog({
  title,
  body,
  confirmLabel = 'אישור',
  cancelLabel = 'ביטול',
  tone = 'default',
  onConfirm,
  onClose,
}: Props) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="bo-btn bo-btn--ghost" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className="bo-btn"
            data-tone={tone}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="bo-confirm-body">{body}</p>
    </Modal>
  );
}
