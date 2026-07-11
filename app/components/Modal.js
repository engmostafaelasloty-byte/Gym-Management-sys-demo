'use client';
import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ margin: 0 }}>{title}</h3>
                    <button onClick={onClose} style={{ background: 'none', boxShadow: 'none', fontSize: 24, cursor: 'pointer', color: 'white', border: 'none' }}>×</button>
                </div>
                {children}
            </div>
        </div>
    );
}
