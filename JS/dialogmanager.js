class DialogManager {
    constructor() {
        this.dialogs = new Map();
        this.init();
    }
    
    init() {
        // Delegación de eventos
        document.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Registrar todos los diálogos
        document.querySelectorAll('dialog').forEach(dialog => {
            this.dialogs.set(dialog.id, dialog);
            
            // Click fuera para cerrar
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    this.closeDialog(dialog.id);
                }
            });
        });
    }
    
    handleClick(e) {
        // Abrir diálogo
        if (e.target.matches('[data-open-dialog]')) {
            e.preventDefault();
            const dialogId = e.target.dataset.openDialog;
            this.openDialog(dialogId);
            return;
        }
        
        // Cerrar diálogo
        if (e.target.matches('[data-close-dialog]')) {
            e.preventDefault();
            const dialog = e.target.closest('dialog');
            if (dialog) {
                this.closeDialog(dialog.id);
            }
            return;
        }
        
        // Ver proyectos (scroll)
        if (e.target.matches('#mostrar') || e.target.closest('#mostrar')) {
            e.preventDefault();
            this.scrollToProjects();
        }
    }
    
    handleKeydown(e) {
        // Cerrar con Escape
        if (e.key === 'Escape') {
            const openDialog = document.querySelector('dialog[open]');
            if (openDialog) {
                this.closeDialog(openDialog.id);
                e.preventDefault();
            }
        }
    }
    
    openDialog(dialogId) {
        const dialog = this.dialogs.get(dialogId);
        if (!dialog) {
            console.error(`Diálogo no encontrado: ${dialogId}`);
            return;
        }
        
        // Cerrar diálogo previo si existe
        const previousDialog = document.querySelector('dialog[open]');
        if (previousDialog && previousDialog.id !== dialogId) {
            previousDialog.close();
        }
        
        dialog.showModal();
        dialog.setAttribute('aria-hidden', 'false');
        
        // Focus management
        const firstFocusable = dialog.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
    }
    
    closeDialog(dialogId) {
        const dialog = this.dialogs.get(dialogId);
        if (!dialog) return;
        
        dialog.close();
        dialog.setAttribute('aria-hidden', 'true');
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
        
        // Devolver focus al elemento que abrió el diálogo
        const opener = document.querySelector(`[data-open-dialog="${dialogId}"]`);
        if (opener) {
            opener.focus();
        }
    }
    
    scrollToProjects() {
        const proyectosSection = document.getElementById('proyectos');
        if (proyectosSection) {
            proyectosSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Método para limpiar
    destroy() {
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('keydown', this.handleKeydown);
        this.dialogs.clear();
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    window.dialogManager = new DialogManager();
});