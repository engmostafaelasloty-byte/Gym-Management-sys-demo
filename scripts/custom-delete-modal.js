const fs = require('fs');

// 1. ADD MODAL STATE TO PAGE.JS
const pageFile = 'app/page.js';
let pageContent = fs.readFileSync(pageFile, 'utf8');

// Add states for custom delete modal
const stateInsertPoint = "const [editExpId, setEditExpId] = useState(null);";
const stateAddition = `
    const [confirmDelete, setConfirmDelete] = useState({ open: false, type: '', id: '', msg: '' });
    const [isDeleting, setIsDeleting] = useState(false);
`;
if (!pageContent.includes('confirmDelete')) {
    pageContent = pageContent.replace(stateInsertPoint, stateInsertPoint + stateAddition);
}

// Replace handleDelete with one that opens the modal
const handleDeleteOld = /async function handleDelete\(type, id, customMsg = null\) \{[\s\S]*?alert\(lang === 'ar' \? 'فشل الحذف: ' \+ err\.message : 'Delete failed: ' \+ err\.message\);[\s\S]*?\}[\s\S]*?\}/;
const handleDeleteNew = `async function handleDelete(type, id, customMsg = null) {
        setConfirmDelete({
            open: true,
            type,
            id,
            msg: customMsg || (lang === 'ar' ? 'هل أنت متأكد من رغبتك في الحذف؟ لا يمكن التراجع عن هذه الخطوة.' : 'Are you sure you want to delete? This action cannot be undone.')
        });
    }

    async function executeDeletion() {
        const { type, id } = confirmDelete;
        setIsDeleting(true);
        try {
            if (type === 'sub') await deleteSubscriber(id);
            else if (type === 'goods') await deleteGoods(id);
            else if (type === 'exp') await deleteExpense(id);
            else if (type === 'equipment') await deleteEquipment(id);
            else if (type === 'staff') await deleteStaff(id);
            else if (type === 'class') await deleteClass(id);
            
            await loadAllData();
            setConfirmDelete({ open: false, type: '', id: '', msg: '' });
            // Show a custom toast-like notification instead of alert if possible, 
            // but for now an alert is fine but we'll use a better UI later.
        } catch (err) {
            console.error(err);
            alert(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Error during deletion');
        } finally {
            setIsDeleting(false);
        }
    }`;

pageContent = pageContent.replace(handleDeleteOld, handleDeleteNew);

// Add the modal UI at the end of the return
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

// Insert modalUI before the last closing tags
const endPoint = "        </>\n    );\n}";
pageContent = pageContent.replace(endPoint, modalUI + endPoint);

fs.writeFileSync(pageFile, pageContent);

// 2. ADD CSS FOR DELETE MODAL
const cssFile = 'app/globals.css';
let cssContent = fs.readFileSync(cssFile, 'utf8');
const cssAddition = `
.delete-confirm-modal {
    border: 1px solid rgba(255,0,0,0.2) !important;
    background: linear-gradient(135deg, #1a1a1a, #2a1111) !important;
    animation: modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.delete-icon-warn {
    font-size: 48px;
    margin-bottom: 15px;
    animation: pulse 2s infinite;
}

@keyframes modalPop {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}
`;
if (!cssContent.includes('.delete-confirm-modal')) {
    fs.appendFileSync(cssFile, cssAddition);
}

console.log("Implemented Custom Delete Modal for better reliability and UI");
