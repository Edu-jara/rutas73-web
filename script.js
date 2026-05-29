// 1. Buscamos el formulario en el HTML usando la etiqueta <form>

// =========================================================
//  VALIDACION FORMULARIO EN RESERVAS (Solo corre en reservas.html)
// =========================================================
const formularioReserva = document.getElementById("form-reserva");

if (formularioReserva) {
    
    formularioReserva.addEventListener("submit", function(evento) {
        // 1. Frenamos el envío automático para revisar con JS
        evento.preventDefault(); 

        // 2. Leemos qué escribió el usuario en los campos
        let nombre = document.getElementById("nombre").value.trim();
        let email = document.getElementById("email").value.trim();
        let mensaje = document.getElementById("mensaje").value.trim();

        // 3. Tu filtro infalible de campos vacíos
        if (nombre === "" || email === "" || mensaje === "") {
            alert("⚠️ Error: Faltan completar campos obligatorios. No se puede enviar.");
            return; // Freno de mano si falta algo
        }

        // 4. Si está todo lleno, pasa por acá:
        alert("¡Todo listo! Enviando consulta a Ruta 73... 🚌");
        
        // ¡Tu jugada maestra! Envia e inmediatamente limpia la pantalla
        formularioReserva.submit(); 
        formularioReserva.reset(); 
    });
} 


// =========================================================
// CONECTAMOS SUPABASE CON LOS HTML PARA CREAR LAS TARGETAS DE VIAJE
// =========================================================
// 1. IMPORTAR SUPABASE
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://gkcbpkmkzpadxzsczdod.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrY2Jwa21renBhZHh6c2N6ZG9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNzkwMTksImV4cCI6MjA5NDg1NTAxOX0.HmPmOEB6n38mnnAmSCVKfMdELJRhcLWy2gEAYEJ7W7I' 
const supabase = createClient(supabaseUrl, supabaseKey)

// 🛑 1. FRENO DE MANO ANTES DEL TIRÓN: Le "robamos" el hash al navegador apenas pisa la página
const hashDestino = window.location.hash;
if (hashDestino === '#contacto' || hashDestino === '#contacto-info') {
    // Limpiamos la URL al instante para que el navegador piense que cargó desde arriba de todo
    history.replaceState(null, null, window.location.pathname + window.location.search);
}

// 2. BUSCAMOS EL CONTENEDOR EN TU HTML
const contenedor = document.getElementById("contenedor-viajes");

// 3. LA FUNCIÓN PARA TRAER LOS DATOS EN VIVO
async function cargarViajesVivos() {
    try {
        console.log("Conectando a Supabase...");

        // Pedimos los viajes ordenados: el último subido aparece primero
const { data: viajes, error } = await supabase
    .from('viajes')
    .select('*')
    .order('id', { ascending: false }); // <-- Esto los da vuelta para mostrar los ultimas cargas

        if (error) throw error;

        if (!contenedor) {
            console.error("❌ ERROR: No encontré ningún div con id='contenedor-viajes' en el HTML.");
            return;
        }

        contenedor.innerHTML = "";

        if (viajes.length === 0) {
            contenedor.innerHTML = `<p class="mensaje">Por el momento no hay viajes programados. ¡Volvé pronto!</p>`;
            return;
        }

        //Creamos una variable para guardar los viajes que vamos a mostrar
        let viajesAMostrar = viajes;

        // Detectamos en qué página está el usuario para evitar el choque de enlaces
        const estamosEnReservas = window.location.pathname.includes('reservas.html');

        // 🚨 SI NO ESTÁ EN RESERVAS (o sea, está en el index), cortamos el array para mostrar solo los últimos 4
        if (!estamosEnReservas) {
            // .slice(0, 4) agarra desde el viaje en la posición 0 hasta el 3 (los primeros 4)
            viajesAMostrar = viajes.slice(0, 4); 
        }

        let cantidadViajes = 0;

        // 🔄 AHORA EL BUCLE RECORRE 'viajesAMostrar' EN VEZ DE 'viajes'
        for (const unViaje of viajesAMostrar) {
            cantidadViajes++;

            const tarjeta = document.createElement("article");
            tarjeta.classList.add("tarjeta-show");

            // 💵 SOLUCIÓN AL PRECIO: Pone los puntos automáticos si es número
            const precioFormateado = isNaN(unViaje.precio) ? unViaje.precio : Number(unViaje.precio).toLocaleString('es-AR');

            // 🧭 SOLUCIÓN AL ENLACE: Si ya está en reservas, va directo al ancla. Si está en el index, viaja de página.
            const enlaceDestino = estamosEnReservas 
                ? `#contacto` 
                : `reservas.html?viaje=${encodeURIComponent(unViaje.destino)}#contacto`;

            tarjeta.innerHTML = `
                <div class="imagen-show">
                    <img src="${unViaje.imagen_url}" alt="${unViaje.destino}">
                    <span class="precio">$${precioFormateado}</span>
                </div>
                <div class="info-show">
                    <h3>${unViaje.destino}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> <strong>Salida:</strong> LA PLATA / 1 y 47</p>
                    <p><i class="fas fa-calendar-check"></i> <strong>Fecha:</strong> ${unViaje.fecha || 'A confirmar'}</p>
                    <p>Incluye: Traslado ida y vuelta + refrigerio + buena onda.</p>
                    
                    <a href="${enlaceDestino}" class="boton-reserva" data-viaje="${unViaje.destino}">
                        <i class="fas fa-bus"></i> RESERVAR MI LUGAR
                    </a>
                </div>
            `;

            contenedor.appendChild(tarjeta);
        }
        
        console.log(`✅ ¡Magia realizada! Se dibujaron ${cantidadViajes} viajes en pantalla.`);

        // 🚀 4. SCROLL INTELIGENTE AUTOMÁTICO AL FINAL DE LA CARGA (Planchado y sin tirones)
        if (hashDestino === '#contacto' || hashDestino === '#contacto-info') {
            const elementoDestino = document.querySelector(hashDestino); 
            
            if (elementoDestino) {
                setTimeout(() => {
                    // Bajamos de forma continua y limpia hasta las redes o el formulario
                    elementoDestino.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    // CORRECCIÓN CLAVE: Mantenemos la URL limpia sin el '#' pegado para que el botón no se trabe al re-escribir
                    history.replaceState(null, null, window.location.pathname + window.location.search);
                    
                    console.log(`🚀 Scroll continuo e impecable hacia: ${hashDestino}`);
                }, 200); // 200ms es perfecto para que cargue en las Mac sin dar saltos visuales
            }
        }

    } catch (error) {
        console.error("Hubo un problema al cargar los viajes:", error.message);
    }
}

// 5. AUTO-RELLENAR EL TEXTAREA DEL FORMULARIO SI VIENE DE UN BOTÓN
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const viajeSeleccionado = params.get('viaje');
    const inputMensaje = document.getElementById('mensaje');

    if (viajeSeleccionado && inputMensaje) {
        inputMensaje.value = `Hola! Quiero reservar mi lugar para el viaje de: ${decodeURIComponent(viajeSeleccionado)}.`;
    }
});

// Escuchamos los clics en los botones por si ya está dentro de reservas.html
document.addEventListener('click', (e) => {
    const boton = e.target.closest('.boton-reserva');
    if (boton && window.location.pathname.includes('reservas.html')) {
        const nombreViaje = boton.getAttribute('data-viaje');
        const inputMensaje = document.getElementById('mensaje');
        if (inputMensaje) {
            inputMensaje.value = `Hola! Quiero reservar mi lugar para el viaje de: ${nombreViaje}.`;
        }
    }
});

// 6. EJECUTAMOS LA FUNCIÓN DIRECTAMENTE
cargarViajesVivos();