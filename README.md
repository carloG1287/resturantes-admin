# resturantes-admin-web

Panel privado para restaurante/admin.

Requiere Node.js `>=20.19.0`.

Incluye layout responsive, kanban de pedidos con filtros, bancos, estadisticas basicas y conexion Socket.IO autenticada para room del restaurante.

```bash
cp .env.example .env
npm install
npm test
npm run dev
```

URL local: `http://localhost:3002/admin/login`

Docker:

```bash
docker build -t resturantes-admin-web .
docker run --rm -p 3002:80 resturantes-admin-web
```
