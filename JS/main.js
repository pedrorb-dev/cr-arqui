let a = ["Un diseño para tu vida", "Invierte en tu futuro", "Piensa en tus hijos", "Nos encargamos de todo"];
let ref = document.getElementById("text");
let ind = 0, cInd = 0;
let remove = false;

function typing() {
    if (ind < a.length) {
        let currentText = a[ind];
        if (!remove && cInd < currentText.length) {
            ref.textContent += currentText.charAt(cInd);
            cInd++;
            setTimeout(typing, 100);
        } else if (remove && cInd >= 0) {
            ref.textContent = currentText.substring(0, cInd);
            cInd--;
            setTimeout(typing, 100);
        } else {
            remove = !remove;
            if (!remove) {
                ind = (ind + 1) % a.length;
            }
            setTimeout(typing, 1000);
        }
    }
}

typing();

const mostrar1 = document.getElementById("art1")
const mostrar2 = document.getElementById("art2")
const mostrar3 = document.getElementById("art3")
const mostrar4 = document.getElementById("art4")
const mostrar5 = document.getElementById("art5")
const mostrar6 = document.getElementById("art6")

const dlg1 = document.getElementById("art1-dlg")
const dlg2 = document.getElementById("art2-dlg")
const dlg3 = document.getElementById("art3-dlg")
const dlg4 = document.getElementById("art4-dlg")
const dlg5 = document.getElementById("art5-dlg")
const dlg6 = document.getElementById("art6-dlg")

const cerrar1 = document.getElementById("cerrar1")
const cerrar2 = document.getElementById("cerrar2")
const cerrar3 = document.getElementById("cerrar3")
const cerrar4 = document.getElementById("cerrar4")
const cerrar5 = document.getElementById("cerrar5")
const cerrar6 = document.getElementById("cerrar6")

mostrar1.addEventListener('click', () => {
    dlg1.showModal();
});


cerrar1.addEventListener('click', () => {
    dlg1.close();
});

mostrar2.addEventListener('click', () => {
    dlg2.showModal();
});


cerrar2.addEventListener('click', () => {
    dlg2.close();
});

mostrar3.addEventListener('click', () => {
    dlg3.showModal();
});


cerrar3.addEventListener('click', () => {
    dlg3.close();
});

mostrar4.addEventListener('click', () => {
    dlg4.showModal();
});


cerrar4.addEventListener('click', () => {
    dlg4.close();
});

mostrar5.addEventListener('click', () => {
    dlg5.showModal();
});


cerrar5.addEventListener('click', () => {
    dlg5.close();
});

mostrar6.addEventListener('click', () => {
    dlg6.showModal();
});


cerrar6.addEventListener('click', () => {
    dlg6.close();
});


function enviar() {
    document.getElementById("formulario").addEventListener("submit", function (e) {
        e.preventDefault();

        let nombre = document.getElementById("nombre").value;
        let telefono = document.getElementById("telefono").value;
        let mensaje = document.getElementById("mensaje").value;

        let numeroWhatsApp = "523411276535";
        let url = `https://wa.me/${numeroWhatsApp}?text=Hola, soy ${nombre}, mi teléfono es ${telefono}. ${mensaje}`;

        window.open(url, "_blank");
    });

}