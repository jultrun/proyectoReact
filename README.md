# Construir proyecto
Para construir el proyecto

1.  Editar el archivo .env para configurar las variables de entorno

![](https://i.imgur.com/XKXoAU2m.jpg)

    1  MONGO_URL para la url de conexión de la base de datos mongodb, por ejemplo mongodb://localhost/proyectoreact

    2 (opcional) JWT_SECRET para la clave secreta para jwt(json web token)

    3 PORT para la configurar el puerto de express

3. Ejecutar el comando `npm install` para instalar los paquetes necesarios
4. Ejecutar el comando `npm run wdev` para construir el proyecto en modo desarrollo o `npm run wprod` en modo producción
4. Ejecutar `npm start` para iniciar el proyecto.
