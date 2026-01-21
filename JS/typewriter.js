class TypeWriter {
    constructor(element, phrases, options = {}) {
        this.element = element;
        this.phrases = phrases;
        
        // Configuración de velocidad (más parámetros)
        this.typingSpeed = options.typingSpeed || 120; // ms por letra
        this.deletingSpeed = options.deletingSpeed || 70; // ms por letra al borrar
        this.pauseTime = options.pauseTime || 1800; // ms de pausa después de escribir
        this.pauseBetween = options.pauseBetween || 600; // ms entre frases
        
        // Efectos adicionales
        this.randomDelay = options.randomDelay || 30; // variación aleatoria
        this.slowOnSpaces = options.slowOnSpaces || true; // más lento en espacios
        this.slowOnPunctuation = options.slowOnPunctuation || true; // más lento en puntuación
        
        this.index = 0;
        this.text = '';
        this.isDeleting = false;
        this.timeout = null;
        this.isActive = true;
    }
    
    // Calcular velocidad variable para efecto más natural
    calculateSpeed() {
        const currentPhrase = this.phrases[this.index];
        const currentChar = this.text.charAt(this.text.length - 1);
        
        let speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
        
        // Más lento en espacios
        if (this.slowOnSpaces && currentChar === ' ') {
            speed *= 1.5;
        }
        
        // Más lento en puntuación
        if (this.slowOnPunctuation && /[.,;:!?]/.test(currentChar)) {
            speed *= 2;
        }
        
        // Variación aleatoria para efecto más natural
        if (this.randomDelay > 0) {
            const variation = Math.random() * this.randomDelay;
            speed += this.isDeleting ? -variation : variation;
        }
        
        return Math.max(speed, 50); // Mínimo 50ms
    }
    
    type() {
        if (!this.isActive) return;
        
        const currentPhrase = this.phrases[this.index];
        
        if (!this.isDeleting) {
            this.text = currentPhrase.substring(0, this.text.length + 1);
        } else {
            this.text = currentPhrase.substring(0, this.text.length - 1);
        }
        
        this.element.textContent = this.text;
        
        // Determinar velocidad para este ciclo
        let typeSpeed = this.calculateSpeed();
        
        // Pausas especiales
        if (!this.isDeleting && this.text === currentPhrase) {
            typeSpeed = this.pauseTime; // Pausa larga al terminar
            this.isDeleting = true;
        } else if (this.isDeleting && this.text === '') {
            this.isDeleting = false;
            this.index = (this.index + 1) % this.phrases.length;
            typeSpeed = this.pauseBetween; // Pausa entre frases
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
    
    // Métodos para ajustar velocidad dinámicamente
    setSpeed(typingSpeed, deletingSpeed = null) {
        this.typingSpeed = typingSpeed;
        if (deletingSpeed !== null) {
            this.deletingSpeed = deletingSpeed;
        }
    }
    
    setPauses(pauseTime, pauseBetween = null) {
        this.pauseTime = pauseTime;
        if (pauseBetween !== null) {
            this.pauseBetween = pauseBetween;
        }
    }
}

// Inicialización CON EFECTO LENTO Y NATURAL
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
            // Velocidad principal (más lento)
            typingSpeed: 130,        // 130ms por letra (bastante lento)
            deletingSpeed: 75,       // 75ms por letra al borrar
            
            // Pausas (más largas)
            pauseTime: 2200,         // 2.2 segundos de pausa al completar
            pauseBetween: 800,       // 0.8 segundos entre frases
            
            // Efectos realistas
            randomDelay: 40,         // Variación de ±40ms
            slowOnSpaces: true,      // Más lento en espacios
            slowOnPunctuation: true  // Más lento en puntuación
        });
        
        typewriter.start();
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!typewriter.isActive) {
                        typewriter.start();
                    }
                } else {
                    typewriter.stop();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(textElement);
        
        // Control por teclado para debugging (opcional)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                // Aumentar velocidad con flecha arriba
                typewriter.setSpeed(
                    Math.max(50, typewriter.typingSpeed - 20),
                    Math.max(30, typewriter.deletingSpeed - 10)
                );
                console.log(`Velocidad: ${typewriter.typingSpeed}ms`);
            } else if (e.key === 'ArrowDown') {
                // Disminuir velocidad con flecha abajo
                typewriter.setSpeed(
                    typewriter.typingSpeed + 20,
                    typewriter.deletingSpeed + 10
                );
                console.log(`Velocidad: ${typewriter.typingSpeed}ms`);
            }
        });
        
        window.addEventListener('pagehide', () => {
            typewriter.stop();
            observer.disconnect();
        });
    }
});