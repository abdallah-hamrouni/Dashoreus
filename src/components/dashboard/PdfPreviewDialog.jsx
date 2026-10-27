import { useEffect } from "react";
import Modal from "../ui/Modal";
import Icon from "../ui/Icon";

export default function PdfPreviewDialog({ preview, onClose }) {
  const url = preview?.url;

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return (
    <Modal
      open={Boolean(preview)}
      onClose={onClose}
      title="Aperçu du bon de livraison"
      icon="file"
      className="pdf-document-dialog"
      returnFocusTo={preview?.returnFocusTo}
      footer={
        preview && (
          <>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              <Icon name="file" size={15} />
              Ouvrir dans un onglet
            </a>
            <div className="pdf-document-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={onClose}
              >
                Fermer
              </button>
              <a
                href={url}
                download={preview.fileName}
                className="button button-primary"
              >
                <Icon name="download" size={16} />
                Télécharger le PDF
              </a>
            </div>
          </>
        )
      }
    >
      {preview && (
        <>
          <p className="pdf-document-name" title={preview.fileName}>
            {preview.fileName}
          </p>
          <object
            data={url}
            type="application/pdf"
            aria-label="Aperçu du bon de livraison PDF"
            className="pdf-document-frame"
          >
            <div className="pdf-document-fallback">
              <Icon name="file" size={30} />
              <p>Ouvrez le document dans un onglet pour le consulter.</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-secondary"
              >
                Ouvrir le document
              </a>
            </div>
          </object>
        </>
      )}
    </Modal>
  );
}
