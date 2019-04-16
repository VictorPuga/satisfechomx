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
    - Cuenta de desarrollador de Facebook
    - Cuenta de AWS
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
En la página de Facebook de Satisfecho.mx se va publicando la información de los donativos, así como contenido, caducidad, ubicación, etc., para que los voluntarios lo vean y acudan por él. Además, funciona para dar difusión y viralidad acerca del proyecto. 