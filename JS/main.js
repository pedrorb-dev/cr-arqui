// Main Application
class App {
    constructor() {
        this.modules = {};
        this.init();
    }
    
    init() {
        // Inicializar módulos
        this.modules.typewriter = window.typewriter;
        this.modules.dialogManager = window.dialogManager;
        this.modules.formHandler = window.formHandler;
        this.modules.menuMobile = window.menuMobile;
        
        // Configuración adicional
        this.setupIntersectionObserver();
        this.setupScrollEffects();
        this.setupAnalytics();
        
    }
    
    setupIntersectionObserver() {
        // Observar elementos para animaciones
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        // Observar elementos específicos
        document.querySelectorAll('.proyecto-card, .galeria-item').forEach(el => {
            observer.observe(el);
        });
    }
    
    setupScrollEffects() {
        // Header scroll effect
        let lastScroll = 0;
        const header = document.querySelector('.header');
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                header.style.boxShadow = 'none';
                return;
            }
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scroll down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scroll up
                header.style.transform = 'translateY(0)';
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }
    
    setupAnalytics() {
        // Event tracking para botones importantes
        document.addEventListener('click', (e) => {
            // Track clicks en botones de proyectos
            if (e.target.matches('.btn-ver') || e.target.closest('.btn-ver')) {
                this.trackEvent('projects', 'view_details', e.target.textContent.trim());
            }
            
            // Track clicks en WhatsApp
            if (e.target.matches('.btn-submit') || e.target.closest('.btn-submit')) {
                this.trackEvent('contact', 'whatsapp_click', 'form_submit');
            }
        });
    }
    
    trackEvent(category, action, label) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        
        // Console log para desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.log(`Event: ${category}.${action} - ${label}`);
        }
    }
    
    // Método para limpiar todo
    destroy() {
        // Destruir módulos
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        // Limpiar event listeners
        window.removeEventListener('scroll', this.handleScroll);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Cargar módulos primero
    if (typeof TypeWriter !== 'undefined') window.typewriter = new TypeWriter();
    if (typeof DialogManager !== 'undefined') window.dialogManager = new DialogManager();
    if (typeof FormHandler !== 'undefined') window.formHandler = new FormHandler();
    if (typeof MenuMobile !== 'undefined') window.menuMobile = new MenuMobile();
    
    // Inicializar app principal
    window.app = new App();
});

// Manejar limpieza al descargar la página
window.addEventListener('beforeunload', () => {
    if (window.app && typeof app.destroy === 'function') {
        app.destroy();
    }
});

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}