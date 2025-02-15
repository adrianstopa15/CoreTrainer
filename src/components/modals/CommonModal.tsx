import React from "react";
import Modal from "react-modal";

interface CommonModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title?: string;
  content?: string;
}

const CommonModal: React.FC<CommonModalProps> = ({
  isOpen,
  onRequestClose,
  title,
  content,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header">
        <h2>{title}</h2>
        <button onClick={onRequestClose} className="close-btn">
          &times;
        </button>
      </div>
      <div className="modal-body">
        <p>{content}</p>
      </div>
      <div className="modal-footer">
        <button onClick={onRequestClose} className="modal-close-btn">
          Close
        </button>
      </div>
    </Modal>
  );
};

export default CommonModal;
