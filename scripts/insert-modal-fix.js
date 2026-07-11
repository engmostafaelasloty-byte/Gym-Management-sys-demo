const fs = require('fs');
const file = 'app/page.js';
let content = fs.readFileSync(file, 'utf8');

const modalUI = `
            {/* Custom Delete Confirmation Modal */}
            {confirmDelete.open && (
                <div className="modal-overlay">
                    <div className="modal-content delete-confirm-modal" style={{ maxWidth: 400, textAlign: 'center' }}>
                        <div className="delete-icon-warn">⚠️</div>
                        <h3>{lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion'}</h3>
                        <p style={{ opacity: 0.8, marginBottom: 24 }}>{confirmDelete.msg}</p>
                        
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button 
                                onClick={executeDeletion} 
                                disabled={isDeleting}
                                style={{ flex: 1, background: 'darkred', color: 'white' }}
                            >
                                {isDeleting ? (lang === 'ar' ? 'جاري الحذف...' : 'Deleting...') : (lang === 'ar' ? 'تأكيد الحذف' : 'Yes, Delete')}
                            </button>
                            <button 
                                onClick={() => setConfirmDelete({ open: false, type: '', id: '', msg: '' })} 
                                disabled={isDeleting}
                                style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}
                            >
                                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
`;

const insertPoint = '<ChatBot faqData={FAQ_DATA} lang={lang} />';
if (content.includes(insertPoint) && !content.includes('confirmDelete.open')) {
    content = content.replace(insertPoint, modalUI + '\n                ' + insertPoint);
    fs.writeFileSync(file, content);
    console.log("Inserted Custom Delete Modal UI correctly");
} else if (content.includes('confirmDelete.open')) {
    console.log("Modal UI already present");
} else {
    console.log("Insert point not found");
}
