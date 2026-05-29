// 1. IMPORTAR SUPABASE ( arriba de todo el  archivo JS)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://gkcbpkmkzpadxzsczdod.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrY2Jwa21renBhZHh6c2N6ZG9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNzkwMTksImV4cCI6MjA5NDg1NTAxOX0.HmPmOEB6n38mnnAmSCVKfMdELJRhcLWy2gEAYEJ7W7I' // Reemplazá esto con tu llave pública de Supabase
const supabase = createClient(supabaseUrl, supabaseKey)

// 2. TU FORMULARIO (Agregamos 'async' antes de la función para poder usar 'await')
const formulario = document.getElementById("formulario-viaje");

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    const inputDestino = document.getElementById("destino");
    const inputfecha = document.getElementById("fecha");
    const inputPrecio = document.getElementById("precio");
    const inputImagen = document.getElementById("imagen");
    
    const archivoFoto = inputImagen.files[0]; 

    // Validación por si se olvidaron de subir la foto
    if (!archivoFoto) {
        alert("Por favor, seleccioná una imagen para el recital.");
        return;
    }

    const nuevoViaje = {
        destino: inputDestino.value,
        fecha: inputfecha.value,
        precio: parseInt(inputPrecio.value),
        imagen: archivoFoto 
    };

    console.log("--- ENVIANDO A SUPABASE ---");

    try {
        // PASO A: Subir la foto real al Storage (al balde que creaste)
        // Le ponemos un nombre único usando la fecha actual para que no se pisen las fotos
        const nombreUnicoFoto = Date.now() + "_" + nuevoViaje.imagen.name;
        
        const { data: datosFoto, error: errorFoto } = await supabase.storage
          .from('recitales') // El nombre del Bucket que creaste en Supabase
          .upload(`fotos/${nombreUnicoFoto}`, nuevoViaje.imagen);

        if (errorFoto) throw errorFoto; // Si hay error con la foto, salta al 'catch'

        // PASO B: Obtener la URL pública de esa foto que acabamos de subir
        const { data: urlPublica } = supabase.storage
          .from('recitales')
          .getPublicUrl(`fotos/${nombreUnicoFoto}`);

        const linkFinalDeLaFoto = urlPublica.publicUrl;

        // PASO C: Guardar el texto y el link de la foto en tu tabla de la base de datos
        const { data: datosTabla, error: errorTabla } = await supabase
          .from('viajes') // El nombre de la tabla en el Table Editor
          .insert([
            { 
                destino: nuevoViaje.destino, 
                fecha: nuevoViaje.fecha, 
                precio: nuevoViaje.precio, 
                imagen_url: linkFinalDeLaFoto // Guardamos el LINK de internet, no el archivo pesado
            }
          ]);

        if (errorTabla) throw errorTabla;

        // Si todo salió bien, recién ahí avisamos y reseteamos
        alert("¡Viaje publicado con éxito en la web! Destino: " + nuevoViaje.destino);
        formulario.reset();

    } catch (error) {
        console.error("Hubo un problema en el viaje de datos:", error.message);
        alert("Error al subir el viaje: " + error.message);
    }
});