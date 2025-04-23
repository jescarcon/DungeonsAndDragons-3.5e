import "./Modal.css"; 

function Modal({ isOpen, onClose, children }) {

  if (!isOpen) return null;

  return (
    // Capa de fondo del modal (fondo oscuro semitransparente)
    <div className="modal-container" onClick={onClose}>
      
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>  {/* Capa de fondo del modal (fondo oscuro semitransparente)*/}
        
        <button className="modal-close" onClick={onClose}>✖</button> {/* Boton X */}

        {children} {/* Contenido modal */}

      </div>

    </div>
  );
}

export default Modal;