# Declaración de Uso de Inteligencia Artificial

**Estudiante:** Edison Fabricio Oñate Cañar
**Actividad:** Activida integradora 2 - TaskManager - JavaScript Vanilla

### 1. ¿Qué herramientas de IA utilizó y en qué momentos?

Utilicé la herramienta **DeepSeek** como asistente de programación durante el desarrollo de esta actividad. La utilicé principalmente en la fase de revision y futuras modificaciones del código, para comprender la lógica del patrón observador (Custom Events) y para proponer los estilos CSS base.

### 2. Prompts (instrucciones) clave utilizados:

*   **Prompt 1:** "Ayúdame a revisar y dame las observaciones en cuanto a la aplicación TaskManager con JS Vanilla que use la API de JSONPlaceholder y LocalStorage, aplicando el patrón observador con CustomEvents para actualizar el dashboard".
*   **Prompt 2:** "Tengo un problema, cuando recargo la página el dashboard (Total, Pendientes, Completadas) se reinicia a 0 aunque las tareas sigan en la lista. ¿Cómo puedo hacer que el dashboard se actualice automáticamente al leer del localStorage?"
*   **Prompt 3:** Tengo puesto mi logo mi logo como fondo de toda la página, pero que las letras y las tarjetas de tareas no dejan visualizar el logo. ¿Cómo puedo aplicar un efecto de transparencia (cristal) a las cajas y controlar la opacidad del fondo en CSS

### 3. ¿Qué partes del código sugerido por la IA contenían errores o requirieron ajustes manuales?

*   **Error en el Dashboard:** El código creado inicialmente no actualizaba los contadores del Dashboard cuando la página se recargaba y los datos se leían desde el `localStorage`. La IA me ayudo a encontrar el error y se lo ajustao manualmente el código agregando la línea `document.dispatchEvent(eventoActualizarDashboard);` dentro del bloque `if (datosLocales)` para obligar a que el evento se disparara al iniciar.

*   **Ajustes de CSS:** Los colores de fondo que estaban inicialmente hacían que las cajas de texto (inputs) se perdieran con la imagen de fondo. Tuve que modificar manualmente los valores de opacidad `rgba` en las clases `.contenedor` y `.tarea-item` para lograr el efecto visual transparente que se adaptara a la imagen de mi emprendimiento (System World Tech).

la IA se usó como apoyo técnico y no como sustituto de mi autoría.