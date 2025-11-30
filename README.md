# OrderCraft Backend - Restaurant Order Management System

Teljes értékű Spring Boot backend az étterem rendelés kezelő rendszerhez JWT autentikációval, WebSocket valós idejű nyomonkövetéssel és teljes CRUD funkcionalitással.

## 🎯 Funkcionalitás

### Megvalósított Komponensek

✅ **Entitások (Models):**
- User (Felhasználó/Admin)
- MenuItem (Menüelem)
- Order (Rendelés)
- OrderItem (Rendelési tétel)

✅ **CRUD Műveletek (mindkét entitásra):**
- MenuItem: Létrehozás, Olvasás, Frissítés, Törlés
- Order: Létrehozás, Olvasás, Frissítés, Törlés

✅ **Autentikáció:**
- JWT Token alapú bejelentkezés
- Biztonságos jelszó tárolás (BCrypt)
- Admin és User szerepkörök
- Regisztráció és bejelentkezés endpointok

✅ **Extra Üzleti Logika:**
- Menü szűrése kategóriák szerint (Előétel, Főétel, Desszert)
- Népszerűségi rangsor (order_count alapján)
- Kosár funkció (OrderItem entitás)
- Valós idejű rendelés státusz követés (WebSocket)
- Rendelésár automatikus kalkuláció

✅ **Adatbázis:**
- PostgreSQL relációs adatbázis
- Két fő tábla: menu_items, orders
- Indextechnika lekérdezési teljesítmény javításához

✅ **API Végpontok:**
- 20+ RESTful endpoint
- CORS támogatás
- WebSocket valós idejű kapcsolat

## 📋 Technológiai Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **Spring Security**
- **JWT (JJWT 0.12.3)**
- **PostgreSQL 15+**
- **Spring WebSocket**
- **Maven**

## 🚀 Telepítés és Futtatás

### Előfeltételek

- Java 17 vagy újabb
- PostgreSQL adatbázis (futó)
- Maven 3.6+
- Git

### 1. Adatbázis beállítása

```bash
# PostgreSQL-be belépés
psql -U postgres

# Új adatbázis létrehozása
CREATE DATABASE ordercraft_db;

# Csatlakozás az új adatbázishoz
\c ordercraft_db

# Schema és sample adatok betöltése
\i schema.sql
```

### 2. Backend telepítés

```bash
# Projekt klónozása
git clone <repo-url>
cd Backend

# Függőségek telepítése
mvn clean install

# Alkalmazás futtatása
mvn spring-boot:run
```

Az alkalmazás `http://localhost:8080/api` címen lesz elérhető.

### 3. Konfigurációs fájl

**application.properties** módosítása szükség szerint:

```properties
# Adatbázis
spring.datasource.url=jdbc:postgresql://localhost:5432/ordercraft_db
spring.datasource.username=postgres
spring.datasource.password=postgres

# JWT Secret (MÓDOSÍTSD TERMELÉSBEN!)
app.jwt.secret=your-secret-key-change-this-in-production-min-32-chars

# CORS Origins
app.cors.allowed-origins=http://localhost:3000,http://localhost:3001
```

## 📚 API Dokumentáció

### Autentikáció Endpointok

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/validate
```

#### Login Törzs:
```json
{
  "username": "admin",
  "password": "admin"
}
```

#### Login Válasz:
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "userId": 1,
  "username": "admin",
  "role": "ADMIN",
  "email": "admin@ordercraft.com"
}
```

### Menü API

```
GET    /api/menu                    # Összes menüelem
GET    /api/menu/available          # Csak elérhető tételek
GET    /api/menu/category/{category}  # Kategória szerinti szűrés
GET    /api/menu/popular            # Népszerűségi sorrend
GET    /api/menu/{id}               # Egy menüelem
POST   /api/menu                    # Új menüelem (ADMIN)
PUT    /api/menu/{id}               # Frissítés (ADMIN)
DELETE /api/menu/{id}               # Törlés (ADMIN)
```

### Rendelés API

```
GET    /api/orders                      # Összes rendelés (ADMIN)
GET    /api/orders/{id}                 # Egy rendelés
GET    /api/orders/user/{userId}        # Felhasználó rendelésai
GET    /api/orders/status/{status}      # Státusz szerinti szűrés (ADMIN)
POST   /api/orders                      # Új rendelés
PUT    /api/orders/{id}                 # Rendelés frissítés (ADMIN)
PATCH  /api/orders/{id}/status/{newStatus}  # Státusz frissítés (ADMIN)
DELETE /api/orders/{id}                 # Rendelés törlése (ADMIN)
```

### Kategóriák

```
APPETIZER   - Előétel
MAIN_COURSE - Főétel
DESSERT     - Desszert
BEVERAGE    - Ital
OTHER       - Egyéb
```

### Rendelés Státuszok

```
PENDING     - Függőben
CONFIRMED   - Megerősítve
PREPARING   - Készülés
READY       - Kész
DELIVERED   - Szállítva
CANCELLED   - Lemondva
```

### Fizetési Módok

```
CARD        - Kártya
CASH        - Készpénz
ONLINE      - Online
```

## 🔐 JWT Token Kezelés

Az autentikált kérésekhez add meg az Authorization headert:

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:8080/api/menu
```

A token az alábbi információkat tartalmazza:
- `subject`: felhasználónév
- `role`: ADMIN vagy USER
- `exp`: lejárati idő (24 óra alapértelmezettként)

## 🌐 WebSocket Valós idejű Nyomonkövetés

Az `ws://localhost:8080/api/ws/orders` címen keresztül WebSocket kapcsolat:

### Kapcsolódás:
```javascript
const ws = new WebSocket('ws://localhost:8080/api/ws/orders');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Order update:', data);
};
```

### Üzenet küldés:
```javascript
ws.send(JSON.stringify({
  type: 'ORDER_STATUS_UPDATE',
  orderId: 1,
  status: 'PREPARING'
}));
```

## 📊 Adatbázis Struktúra

### Users Tábla
```sql
id: SERIAL PRIMARY KEY
username: VARCHAR UNIQUE
password: VARCHAR
email: VARCHAR UNIQUE
role: VARCHAR (ADMIN/USER)
active: BOOLEAN
```

### Menu Items Tábla
```sql
id: SERIAL PRIMARY KEY
name: VARCHAR
description: VARCHAR
price: DECIMAL(10,2)
category: VARCHAR
available: BOOLEAN
order_count: INTEGER (népszerűsés nyomkövetéshez)
```

### Orders Tábla
```sql
id: SERIAL PRIMARY KEY
user_id: FOREIGN KEY (users)
total_price: DECIMAL(10,2)
status: VARCHAR
payment_method: VARCHAR
created_at: TIMESTAMP
completed_at: TIMESTAMP
```

### Order Items Tábla
```sql
id: SERIAL PRIMARY KEY
order_id: FOREIGN KEY (orders)
menu_item_id: FOREIGN KEY (menu_items)
quantity: INTEGER
price_at_order: DECIMAL(10,2)
```

## 🧪 Teszt Adatok

Az adatbázisban az alábbi előbehelyezett adatok vannak:

**Admin felhasználó:**
```
username: admin
password: admin
email: admin@ordercraft.com
```

**10 mintás menüelem:** Saláta, leves, húsételek, desszertek, italok

## 🛠️ Fejlesztési Tippek

### Hibakeresés

```bash
# Debug módban futtatás
mvn spring-boot:run -Dspring-boot.run.arguments="--debug"

# Kötési probléma diagnosztikája
netstat -tuln | grep 8080
```

### Adatbázis problémák

```bash
# PostgreSQL státusza
psql -U postgres -c "SELECT version();"

# Adatbázisok listázása
psql -U postgres -l
```

## 📝 Jövedelem Deployment

### Docker

```dockerfile
FROM openjdk:17
COPY target/ordercraft-backend-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Production Beállítások

```properties
app.jwt.secret=<hosszú-biztonságos-kulcs-min-32-char>
spring.jpa.hibernate.ddl-auto=validate
logging.level.root=WARN
```

## 📄 Licenc

MIT License - Szabadon felhasználható oktatási és kereskedelmi célra.

## 👨‍💻 Szerző

OrderCraft Backend - University Project 2025

## ❓ Segítség és Támogatás

Problémák vagy kérdések esetén:
1. Ellenőrizd a PostgreSQL kapcsolatot
2. Válts be debug módba
3. Nézd meg a Spring Boot naplókat

---

**Utolsó frissítés:** November 2025
**Verzió:** 1.0.0
