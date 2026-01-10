
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configura la retina display para que se vea nítido
    const resize = () => {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Configuración de las ondas
    const settings = {
        lines: 3, // Número de "cintas" o grupos de ondas
        amplitude: 60, // Altura de la onda
        frequency: 0.002, // Frecuencia espacial
        speed: 0.001, // Velocidad de movimiento
        color: '255, 255, 255'
    };

    let time = 0;

    function draw() {
        ctx.clearRect(0, 0, width, height); // Limpiar canvas

        // Efecto global de composición
        // Usamos 'screen' o 'lighter' para que se sumen los brillos si las líneas se cruzan
        ctx.globalCompositeOperation = 'screen';

        for (let l = 0; l < settings.lines; l++) {
            const phaseOffset = (l / settings.lines) * Math.PI * 2;

            ctx.beginPath();

            // Dibujamos de izquierda a derecha
            for (let x = 0; x <= width; x += 5) {
                // Onda compuesta: seno principal + seno secundario para iregularidad
                // Ajustamos 'y' para que esté centrado verticalmente, o un poco más abajo

                // Variación lenta en el tiempo
                const yOffset = Math.sin(x * settings.frequency + time + phaseOffset) * settings.amplitude;
                const yOffset2 = Math.sin(x * (settings.frequency * 2) - time * 0.5 + phaseOffset) * (settings.amplitude * 0.5);

                // Gradiente vertical sutil: hacemos que las ondas pasen por el centro de la pantalla
                // o un poco sesgadas para que parezca el ejemplo
                // Usamos una curva "sigmoide" o simplemente una diagonal para inclinar el flujo?
                // El ejemplo es bastante horizontal pero con curvas suaves.

                const centerY = height / 2 + (l * 20); // Un pequeño offset entre líneas para separarlas

                ctx.lineTo(x, centerY + yOffset + yOffset2);
            }

            // Estilo de trazo
            // Gradiente lineal a lo largo de la pantalla para el "desvanecimiento" en los bordes
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, `rgba(${settings.color}, 0)`);
            gradient.addColorStop(0.2, `rgba(${settings.color}, 0.05)`);
            gradient.addColorStop(0.5, `rgba(${settings.color}, 0.15)`); // Centro más brillante
            gradient.addColorStop(0.8, `rgba(${settings.color}, 0.05)`);
            gradient.addColorStop(1, `rgba(${settings.color}, 0)`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 150; // Línea MUY gruesa para parecer "humo" o luz difusa si la opacidad es baja
            // EN REALIDAD, para el efecto de la foto (hilos finos brillantes), lineWidth debe ser mas pequeño,
            // PERO si queremos el efecto "aurora/ghost" suave, usamos lineWidth grande y poca opacidad.
            // Vamos a intentar un enfoque híbrido: trazo grueso muy transparente para el "glow"
            // y luego dibujamos una línea fina encima?
            // Probemos solo el trazo "glowy" primero.

            // Re-configuración para parecerse a la imagen referencia (hilos finos definidos + glow)
            // Haremos líneas más finas (1-2px) pero con shadowBlur
            ctx.lineWidth = 1;
            ctx.shadowBlur = 20;
            ctx.shadowColor = `rgba(${settings.color}, 0.5)`;

            // Override del gradiente anterior para líneas finas y nítidas
            ctx.strokeStyle = `rgba(${settings.color}, 0.1)`;

            // Dibujar múltiles copias de la misma onda con ligero desfazaje para crear "cintas"
            for (let k = 0; k < 5; k++) {
                // Pequeño desplazamiento en Y para crear el grosor de la cinta
                // pero usando la misma ruta base es dificil con lineTo loop.
                // Mejor simplificar: dibujamos la ruta calculada arriba.
            }
            // En este loop simple, solo dibujamos 1 trazo por 'l' (linea principal)
            ctx.stroke();

            // Glow extra "fake" dibujando la misma linea mas gruesa y transparente detras?
            // Canvas shadowBlur ya hace eso un poco.
        }

        time += settings.speed;
        requestAnimationFrame(draw);
    }

    draw();
});
