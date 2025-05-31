# Usar la imagen base oficial de Bun sobre Alpine
FROM oven/bun:latest

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo package.json y el lock file (si existen) para instalar las dependencias
COPY package.json bun.lock ./

# Instalar las dependencias de Bun
RUN bun install

# Copiar el resto de la aplicación
COPY index.ts .

# Exponer el puerto en el que la aplicación va a escuchar
EXPOSE 3000

# Iniciar la aplicación con Bun
CMD ["bun", "start"]

