// js/menuMobile.js
class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.navMenu = document.getElementById('navMenu');
        this.body = document.body;
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.menuToggle || !this.navMenu) {
            console.error('Elementos del menú no encontrados');
            return;
        }
        
        // Crear overlay si no existe
        this.createOverlay();
        
        // Event listeners
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        
        // Cerrar menú al hacer clic en un enlace
        this.navMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                this.closeMenu();
            }
        });
        
        // Cerrar menú con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Cerrar menú al redimensionar si vuelve a desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        });
        
        console.log('Menú móvil inicializado');
    }
    
    createOverlay() {
        let overlay = document.getElementById('menuOverlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'menuOverlay';
            overlay.className = 'menu-overlay';
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', () => this.closeMenu());
        }
        
        this.overlay = overlay;
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.navMenu.classList.add('active');
        this.menuToggle.classList.add('active');
        this.overlay.classList.add('active');
        this.body.classList.add('menu-open');
        this.menuToggle.setAttribute('aria-expanded', 'true');
        this.isOpen = true;
        
        // Focus trapping para accesibilidad
        this.trapFocus();
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.menuToggle.classList.remove('active');
        this.overlay.classList.remove('active');
        this.body.classList.remove('menu-open');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.isOpen = false;
        
        // Devolver focus al botón del menú
        this.menuToggle.focus();
    }
    
    trapFocus() {
        const focusableElements = this.navMenu.querySelectorAll(
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Enfocar primer elemento
        setTimeout(() => firstElement.focus(), 100);
        
        // Trap focus dentro del menú
        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };
        
        this.navMenu.addEventListener('keydown', handleTabKey);
        
        // Guardar referencia para remover después
        this.currentTabHandler = handleTabKey;
    }
    
    destroy() {
        if (this.currentTabHandler) {
            this.navMenu.removeEventListener('keydown', this.currentTabHandler);
        }
        
        this.menuToggle.removeEventListener('click', this.toggleMenu);
        window.removeEventListener('resize', this.handleResize);
        
        if (this.overlay) {
            this.overlay.removeEventListener('click', this.closeMenu);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.mobileMenu = new MobileMenu();
});