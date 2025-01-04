import React from "react";
import ReactDOM  from "react-dom";

interface PortalModalProps{
    isOpen:boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const PortalModal:React.FC<PortalModalProps> = ({isOpen, onClose, children}) => {
    if(!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header flex justify-end">
                <button onClick={onClose} className="text-gray-300 pr-4 pt-2 ">X</button>

                </div>
            <div className="modal-body">
                {children}    
                
            </div>
        </div>
        </div>,
        document.getElementById('modal-root')!
    );
};

export default PortalModal;