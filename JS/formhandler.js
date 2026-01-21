class FormHandler {
    constructor() {
        this.form = document.getElementById('formulario');
        this.initialize();
    }
    
    initialize() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.setupValidation();
    }
    
    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Validación en tiempo real
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.clearError.bind(this));
        });
    }
    
    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Validaciones específicas
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        }
        
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
        }
        
        if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Ingresa un teléfono válido (10 dígitos)';
        }
        
        if (field.type === 'text' && field.id === 'nombre' && value.length < 3) {
            isValid = false;
            errorMessage = 'El nombre debe tener al menos 3 caracteres';
        }
        
        if (!isValid) {
            this.showError(field, errorMessage);
        } else {
            this.clearError(field);
        }
        
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }
    
    showError(field, message) {
        this.clearError(field);
        
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.id = `${field.id}-error`;
        
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
    
    clearError(field) {
        field.classList.remove('error');
        
        const existingError = document.getElementById(`${field.id}-error`);
        if (existingError) {
            existingError.remove();
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validar todos los campos
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            input.dispatchEvent(new Event('blur'));
            if (input.classList.contains('error')) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showFormMessage('Por favor corrige los errores en el formulario', 'error');
            return;
        }
        
        // Obtener datos
        const formData = new FormData(this.form);
        const data = {
            nombre: this.sanitize(formData.get('nombre') || ''),
            telefono: this.sanitize(formData.get('telefono') || ''),
            email: this.sanitize(formData.get('email') || ''),
            mensaje: this.sanitize(formData.get('mensaje') || '')
        };
        
        // Validación final
        if (!data.nombre || !data.telefono) {
            this.showFormMessage('Nombre y teléfono son obligatorios', 'error');
            return;
        }
        
        // Deshabilitar botón
        const submitBtn = this.form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        try {
            // Enviar a WhatsApp
            await this.sendToWhatsApp(data);
            
            this.showFormMessage('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
            this.form.reset();
            
            // Seguimiento (opcional)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'contact',
                    'event_label': 'whatsapp_form'
                });
            }
            
        } catch (error) {
            console.error('Error al enviar:', error);
            this.showFormMessage('Error al enviar. Por favor intenta de nuevo.', 'error');
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    sanitize(text) {
        // Eliminar etiquetas HTML y espacios extras
        const div = document.createElement('div');
        div.textContent = text;
        return encodeURIComponent(div.textContent.trim());
    }
    
    sendToWhatsApp(data) {
        return new Promise((resolve, reject) => {
            try {
                const phoneNumber = "523411276535"; 
                
                let message = `*Nuevo contacto desde la web*%0A%0A`;
                message += `*Nombre:* ${data.nombre}%0A`;
                message += `*Teléfono:* ${data.telefono}%0A`;
                
                if (data.email) {
                    message += `*Email:* ${data.email}%0A`;
                }
                
                if (data.mensaje) {
                    message += `*Mensaje:* ${data.mensaje}%0A`;
                }
                
                message += `%0A_Fecha: ${new Date().toLocaleDateString('es-MX')}_`;
                
                const url = `https://wa.me/${phoneNumber}?text=${message}`;
                
                // Abrir en nueva pestaña
                const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
                
                if (newWindow) {
                    resolve();
                } else {
                    reject(new Error('No se pudo abrir WhatsApp'));
                }
                
            } catch (error) {
                reject(error);
            }
        });
    }
    
    showFormMessage(message, type = 'info') {
        // Eliminar mensaje anterior
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Crear nuevo mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}-message`;
        messageDiv.textContent = message;
        messageDiv.setAttribute('role', 'alert');
        
        this.form.appendChild(messageDiv);
        
        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    destroy() {
        if (this.form) {
            this.form.removeEventListener('submit', this.handleSubmit);
        }
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    window.formHandler = new FormHandler();
});