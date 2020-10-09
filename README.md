## requisitos
1. una base de datos monodb
# Construir proyecto
Para construir el proyecto
1.  Editar el archivo .env para configurar las variables de entorno
![](https://i.imgur.com/T7LYDnw.png)
    1. MONGO_URL para la url de conexión de la base de datos mongodb
    2. (opcional) JWT_SECRET para la clave secreta para jwt(json web token)
    3. PORT para la configurar el puerto de express
3. Ejecutar el comando `npm install` para instalar los paquetes necesarios
![](https://i.imgur.com/HJouHDL.png)
4. Ejecutar el comando  `npm run wprod` para construir el proyecto
![](https://i.imgur.com/TLxeMaO.png)
5. Ejecutar `npm start` para iniciar el proyecto.
![](https://i.imgur.com/mtSySCm.png)