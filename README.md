# Padel Social Network

https://padel-social-frontend.onrender.com/


## Tecnologias empleadas ## 
He utilizado la combinacion de Node.js, Javascript, MongoDB, mongoose, Express,Nodemailer,Multer,Websockets,Bcrypt, JWT.
Desglose de tecnologias relevantes:
- ## Nodemailer ##: He utilizado nodemailer para la creacion de un email de bienvenida.
- ## Multer ##: He utilizado multer para la subida de archivos, en nuestro caso concreto para gestionar la subida de la foto de perfil.
- ## Websockets ##: He utilizado WS, para la gestion de chats entre usuarios.
- ## Bcrypt ##: He utilizado Bcrypt para encriptar la contraseña.
- ## JWT ## : He utilizado JWT para la creacion del token y gestionar rutas restrigindas gracias a el.


## 🎾 Flujo del backend
En el backend podemos encontrar una correcta separacion por carpetas delegando funcionalidades concretas a cada seccion, tratando los esquemas en models, tanto de usuarios, como de partidos, mensajes y relaciones.
Tenemos la carpeta config donde tambien configuro la base de datos.
La carpeta rutas donde gestiono los endpoints que llamaran a unos controladores que a su vez llaman a unos servicios, donde defino la logica necesaria para el funcionamiento de nuestro backend y en consecuencia el front.
Una carpeta de validaciones donde trato las validaciones para la creacion de usuarios.
Una carpeta de middlewares donde trato los middlewares tanto de autenticacion como de errores basicos, que aplicaremos en las rutas necesarias, tanto en rutas como en app.js.
Una carpeta de Websockets, donde trato lo correspondiente para levantar estos y poder establecer el chat entre usuarios.
