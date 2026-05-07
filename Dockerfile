# ================= FRONTEND BUILD =================

FROM node:20 AS frontend

WORKDIR /app/client

COPY client/package*.json ./

RUN npm install

COPY client .

RUN npm run build



# ================= BACKEND =================

FROM node:20

WORKDIR /app/server

COPY server/package*.json ./

RUN npm install

COPY server .



# Copy frontend build into backend
COPY --from=frontend /app/client/dist ../client/dist



# Cloud Run port
EXPOSE 8080



# Start backend
CMD ["npm", "start"]