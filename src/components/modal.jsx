import React from 'react';

function Modal({ show, title, content, children }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white-900 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="p-4">
          <h2 className="text-xl mb-4">{title}</h2>
          <p className="mb-4">{content}</p>
       {children}
        
        </div>
      </div>
    </div>
  );
}

export default Modal;
