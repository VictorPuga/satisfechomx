# Documentación: Satisfecho.mx

1. [Definiciones y especificación de requerimientos](#1-Definiciones-y-especificación-de-requerimientos)  
1.1 [Definición general](#11-Definición-general)  
1.2 [Requerimientos del proyecto](#12-Requerimientos-del-proyecto)  
1.3 [Especificaciones de procedimientos](#13-Especificaciones-de-procedimientos)  
1.3.1 [Procedimientos de desarrollo](#131-Procedimientos-de-desarrollo)  
1.3.2 [Procedimientos de instalación y prueba](#132-Procedimientos-de-instalación-y-prueba)  
2. [Arquitectura del sistema](#2-Arquitectura-del-sistema)  
3. [Diseño del modelo de datos](#3-Diseño-del-modelo-de-datos)  
3.1 [Descripción de procesos y servicios ofrecidos por el sistema](#31-Descripción-de-procesos-y-servicios-ofrecidos-por-el-sistema)  
3.2 [Documentación técnica](#32-Documentación-técnica)  
4. [Aspectos relevantes](#4-Aspectos-relevantes)  

## 1. Definiciones y especificación de requerimientos  
### 1.1 Definición general

Satisfecho.mx es una interfaz que, a través de un chatbot de Messenger, permite hacer donaciones de alimentos para asociaciones civiles, como el Banco de Alimentos de Chihuahua. 

El objetivo de la aplicación es facilitar la donación de alimentos, para ayudar a las personas que no tienen los recursos para tener una buena alimentación

Los usuarios que utilizarán la aplicación serán gente que trabaje para un restaurante, mercado, o negocio similar, que sea el encargado de la merma de alimentos. A su vez, ellos notificarán a los voluntarios de las asociaciones civiles, quienes se encargarán de recoger el donativo.

### 1.2 Requerimientos del proyecto

- Requisitos generales:  
    - Conocimiento de Javascript
    - Conocimiento de la integración con Facebook
    - Conocimiento de la integración con Messenger
    - Conocimiento de la integración con Dialogflow
    - Conocimiento de la integración con AWS
    - Conocimiento de HTML
    - Conexiones con posibles donadores y asociaciones civiles
    - Editor de texto

- Requisitos funcionales:  
    - Conexión a intenet

- Información de autoría:  
No existe ninguna aplicación similar de un chatbot para realizar donaciones, o por lo menos no uno que sea popular. 

- Alcances del sistema:  
Las limitaciones del proyecto son que por el momento solo cubre un área, la ciudad de Chihuahua. No se pueden realizar donaciones desde o hacia otro lado.

### 1.3 Especificaciones de procedimientos
#### 1.3.1 Procedimientos de desarrollo

Las herramientas que se utilizaron fueron [Dialogflow](https://dialogflow.com/) para el desarrollo del chatbot, [Amazon Web Services](https://aws.amazon.com/) para el diseño de la infraestructura en la nube, y la pataforma de [Messenger](https://developers.facebook.com/docs/messenger-platform/) para la distribución del bot.

Primero se validó el diseño de la aplicación, para asegurarse de que sí se resuelva un problema del mundo real. Luego se planeó la arquitectura de los datos. Después, se desarrolló el bot y se realizaron pruebas. Se construyó una [landing page](https://www.satisfecho.mx/) para dar mayor información acerca del proyecto.  ~~**[... integración y recepción ...]**~~

#### 1.3.2 Procedimientos de instalación y prueba
- Requerimientos no funcionales:  
    - [...]

- Obtención e instalación:  
Para utilizar la app, busca "Satisfecho.mx" en Messenger. Contesta las preguntas del bot, para llenar la información sobre el donativo. Esto notificará a los voluntarios, quienes podrán ver la información en la página de Facebook.

- Especifcaciones de prueba y ejecución:  
Para poder usar la app, es necesario tener una cuenta de Facebook, y la aplicación de Messenger. También se requiere conexión a internet.

# 2. Arquitectura del sistema
<!-- ## Descripción jerárquica -->

## Diagrama de módulos
![Diagrama de módulos](https://github.com/VictorPuga/satisfechomx/blob/master/assets/diagram.png "Diagrama de módulos")

## Descripción individual

### Messenger
Messenger es en donde el usuario interactúa con la app. Toda la interfaz está diseñada para ser un chat, lo que simplifica la interacción con los usuarios. La función de esta integración con Messenger es usar una plataforma ya establecida para la distribución de la aplicación. A su vez, los mensajes que recibe el chat son mandados a un chatbot desarrollado con Dialogflow, para procesar el texto y que la verdadera magia funcione. 

### Dialogflow
El chatbot de Dialogflow es el encargado de recibir los mensajes, procesarlos, y saber qué hacer con esa información. El bot está entrenado con las frases necesarias para llevar a cabo la donación, y guiar al usuario por la conversación. Despúes de analizar el mensaje, llama una función en Lambda, a través de API Gateway, con la que se continúa la conversación. El bot va guardando un registro temporal de la conversación con el usuario.

### AWS
#### API Gateway
API Gateway es un servicio de AWS, con el que se puede, entre otras cosas, llamar API's. El chatbot hace llamadas a la API al procesar algunas respuestas. La API corre el código que está escrito en las funciones de Lambda.

#### Lambda
Es aquí donde está el código que se ejecuta en la nube. La API utiliza las funciones para autorizar el uso de la misma, para procesar los mensajes y mandar respuestas, para guardar las donaciones en la base de datos de DynamoDB, y hacer las publicaciones al grupo de Facebook.

#### DynamoDB
DynamoDB es un servicio de base de datos NoSQL, en donde se van almacenando la información de las donaciones. La API llama una función cuando se terminó de recabar la información acerca del donativo, para escribir en la base de datos la descripción obtenida.

### Facebook
En la [página de Facebook](https://fb.com/Satisfechomx-289652755034519/) de Satisfecho.mx se va publicando la información de los donativos, así como contenido, caducidad, ubicación, etc., para que los voluntarios lo vean y acudan por él. Además, funciona para dar difusión y viralidad acerca del proyecto. 

# 3. Diseño del modelo de datos
La base de datos de DynamoDB ofrece un sistema NoSQL. Los datos se van guardando como se muestra en los siguientes diagramas:

|Primary key| Sort key| Attributes|
|---|---|---|
|phone_number| |||

````dart
class Donation {
  const Donation({
    @required this.phone_number,
    @required this.post_id,
    this.donation_content,
    this.donation_quantity,
    this.donation_amount,
    this.donation_expiration_date,
    this.donation_pick_up_by_time,
    this.donation_photo,
    this.donation_location = const {'lat': 0, 'long': 0},
  }) : assert(donation_content != null &&
            donation_quantity != null &&
            donation_amount != null &&
            donation_expiration_date != null &&
            donation_pick_up_by_time != null &&
            donation_photo != null &&
            donation_location != null);

  final String phone_number;
  final String post_id;
  final String donation_content;
  final num donation_quantity;
  final String donation_amount;
  final String donation_expiration_date;
  final String donation_pick_up_by_time;
  final String donation_photo;
  final Map<String, num> donation_location;
}
````

## 3.1 Descripción de procesos y servicios ofrecidos por el sistema
- El usuario interactúa con el chatbot, respondiendo a sus preguntas.
- Cada mensaje de texto es procesado. Messenger lo manda a Dialogflow en formato JSON, quien a su vez llama una función de Lambda para procesar el mensaje, y luego regresa una respuesta, con el mismo formato.
- Cuando se ha recabado toda la información, Dialogflow llama otra función, que recibe parámetros para cada dato, a través de API Gateway. 
- La función crea una publicación de Facebook con toda la información recabada.
- Una vez publicada, escribe los datos a DynamoDB.
  - Si todo exitoso, regresa una respuesta a Messenger para concluir la conversación.
  - Si ocurrió algún error, regresa una respuesta para notificar el error e intentar de nuevo.

## 3.2 Documentación técnica
### Endpoints
#### Crear una nueva donación
```
POST /donations
```
| Parámetro                | Tipo     | Descripción                                                                 | Ejemplo                                |
|--------------------------|----------|-----------------------------------------------------------------------------|---------------------------------------:|
| phone_number             | `String` | Número de teléfono del donador                                              | `'+0123456789'`                        |
| donation_content         | `String` | Contenido de la donación                                                    | `'Manzanas'`                           |
| donation_quantity        | `Number` | Se usa en conjunto con `donation_amount`. Canditdad de la comida            | `2`                                    |
| donation_amount          | `String` | Se usa en conjunto con `donation_quantity`. Unidades de medida de la comida | `'kilos'`                              |
| donation_expiration_date | `String` | Fecha de caducidad de la comida. AAAA-MM-DD                                 | `'1985-10-25'`                         |
| donation_pick_up_by_time | `String` | ¿Cuándo se puede recoger la comida?                                         | `'Hoy a las 4'`                        |
| donation_photo           | `String` | URL de la foto de la comida                                                 | `'https://cool.example.com/image.jpg'` |
| donation_location        | `Object` | Coordenadas de localización de la comida                                    | `{ lat: 51.523767, long: -0.1607444 }` |
---

#### Obtener todas las donaciones de un mismo usuario
```
GET /donations/{phone_number}
```
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| N/A       |      |             |
---

#### Obtener una donación de un usuario
```
GET /donations/{phone_number}/{post_id}
```
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| N/A       |      |             |
---

#### Editar una donación
```
PUT /donations/{phone_number}/{post_id}
```
| Parámetro                | Tipo     | Descripción                                                                 | Ejemplo                                |
|--------------------------|----------|-----------------------------------------------------------------------------|---------------------------------------:|
| donation_content         | `String` | Contenido de la donación                                                    | `'Manzanas'`                           |
| donation_quantity        | `Number` | Se usa en conjunto con `donation_amount`. Canditdad de la comida            | `2`                                    |
| donation_amount          | `String` | Se usa en conjunto con `donation_quantity`. Unidades de medida de la comida | `'kilos'`                              |
| donation_expiration_date | `String` | Fecha de caducidad de la comida. AAAA-MM-DD                                 | `'1985-10-25'`                         |
| donation_pick_up_by_time | `String` | ¿Cuándo se puede recoger la comida?                                         | `'Hoy a las 4'`                        |
| donation_photo           | `String` | URL de la foto de la comida                                                 | `'https://cool.example.com/image.jpg'` |
| donation_location        | `Object` | Coordenadas de localización de la comida                                    | `{ lat: 51.523767, long: -0.1607444 }` |
---

###### * Los parámetros se pasan como cuerpo de la solicitud de HTTP

#### Enlaces externos:
[Documentación de Dialogflow](https://dialogflow.com/docs/)  
[Documentación de Messenger](https://developers.facebook.com/docs/messenger-platform/)  
[Documentación de Facebook](https://developers.facebook.com/docs/graph-api/)  
[Documentación de AWS](https://docs.aws.amazon.com/index.html)  
[Documentación de Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/)  
[Documentación de HTML](https://www.w3schools.com/tags/)  

# 4. Aspectos relevantes
La plataforma de satisfecho dispone de multiples sistemas que interactúan entre sí para traer solución al problema del desperdicio de alimentos en buen estado en supermercados.  

Volviendo al diagrama canónico:

![Proceso de donación](https://github.com/VictorPuga/satisfechomx/blob/master/assets/process.png "Proceso de donación")

El proceso se puede dividir en tres componentes generales. El bot, la página, y el pseudo-servidor.  

El bot es, como se puede esperar, la tecnología de Dialogflow; los diferentes “intents”, sus respuestas programadas, los contextos y la manera en la que deriva los datos del texto.  

La página se refiere al muro de Facebook hacia el cual se publican todas las donaciones de la plataforma y es el centro de gestión de inventario y uso de la aplicación. El pseudo-servidor es el pegamento que uno estos dos juntos; es servidor porque la lógica que contiene es central “always-on” y de middleware; es pseudo porque en realidad corre en infraestructura de “funciones de nube” que solo son invocadas on-demand y no están realmente en un servidor siempre encendido con cierto hardware de fondo.  

Al comienzo del flujo de uso, los donadores intercedan con nuestro chatbot y le comunican todos los datos del “payload” de comida que desean donar. Este en turno usa esos datos para generar un post de facebook y lo publica en nuestra página. Una vez ahí, es visto por nuestros voluntarios y estos finalmente usan esa información para recoger y distribuir ese alimento. Finalmente, el receptor recibe ese alimento y se encarga de entregarlo a gente que lo necesita.  


# Conclusiones
El desarrollo de la plataforma de Satisfecho.mx ha resultado sumamente interesante y a su vez bastante retador. El proyecto es de naturaleza multidisciplinario y precisa de muchos diferentes actores colaborando en sincronía, por lo tanto uno de los componentes más retadores ha sido el desarrollo de las conexiones pertinentes y necesarias para el seguimiento del proyecto. Estas son: nuestra relación con alsuper, llamar y conectarnos con banco de alimentos.  

A esto se suman los retos técnicos del proyecto como ser el primer proyecto en el que usamos tecnología de chatbot (Dialogflow), donde nuestro motor de procesamiento es un servicio de nube (AWS Lambda), y finalmente, que se conecta a una cuenta de desarrollo de Facebook. La naturaleza “multi-nube” del stack ha hecho su desarrollo mucho más complejo.   

No obstante ha sido muy enriquecedor.