class TypeWriter {
    constructor(element, phrases, options = {}) {
        this.element = element;
        this.phrases = phrases;
        this.typingSpeed = options.typingSpeed || 100;
        this.deletingSpeed = options.deletingSpeed || 60;
        this.pauseTime = options.pauseTime || 1000;
        this.index = 0;
        this.text = '';
        this.isDeleting = false;
        this.timeout = null;
        this.isActive = true;
    }
    
    type() {
        if (!this.isActive) return;
        
        const currentPhrase = this.phrases[this.index];
        let typeSpeed = this.typingSpeed;
        
        if (!this.isDeleting) {
            this.text = currentPhrase.substring(0, this.text.length + 1);
        } else {
            this.text = currentPhrase.substring(0, this.text.length - 1);
        }
        
        this.element.textContent = this.text;
        this.element.setAttribute('aria-label', this.text);
        
        if (!this.isDeleting && this.text === currentPhrase) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.text === '') {
            this.isDeleting = false;
            this.index = (this.index + 1) % this.phrases.length;
            typeSpeed = 500;
        }
        
        this.timeout = setTimeout(() => this.type(), typeSpeed);
    }
    
    start() {
        this.isActive = true;
        this.type();
    }
    
    stop() {
        this.isActive = false;
        clearTimeout(this.timeout);
    }
    
    reset() {
        this.stop();
        this.index = 0;
        this.text = '';
        this.isDeleting = false;
        this.element.textContent = '';
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const phrases = [
        "Un diseño para tu vida",
        "Invierte en tu futuro", 
        "Piensa en tus hijos",
        "Nos encargamos de todo"
    ];
    
    const textElement = document.getElementById('text');
    
    if (textElement) {
        const typewriter = new TypeWriter(textElement, phrases, {
            typingSpeed: 100,
            deletingSpeed: 60,
            pauseTime: 1500
        });
        
        typewriter.start();
        
        // Pausar animación cuando no está visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typewriter.start();
                } else {
                    typewriter.stop();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(textElement);
        
        // Limpiar en pagehide
        window.addEventListener('pagehide', () => {
            typewriter.stop();
            observer.disconnect();
        });
    }
});