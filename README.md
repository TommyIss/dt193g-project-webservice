# Projekt i kursen DT193G, Fullstack-utveckling med ramverk

## Webtjänst
Webbtjänsten är ett REST-baserat API byggt med NestJS och PostgreSQL. Syftet är att hantera produkter och deras kategorier samt varianter i ett lagerhanteringsystem, inklusive lagersaldo, priser, och relationer mellan entiteter. Tjänsten använder rollbaserad autentisering där admin kan utföra full CRUD och staff kan läsa data samt uppdatera lagersaldo för varianter.

## Installerade paket
Här är de viktigaste installerade paketen som används i projektet:
### Backend
- @nestjs/common
- @nestjs/core
- @nestjs/typeorm
- @nestjs/jwt
- @nestjs/passport
### Databas
- typeorm
- pg
### Autentisering & validering
- passport
- passport-jwt
- bcrypt
- class-validator
- class-transformer
### Cloudinary (bildhantering)
- cloudinary
- multer
- multer-storage-cloudinary

## Databas entiteter
API:et erbjuder CRUD-funktionalitet för användare(users), produkter(products), kategorier(kategorier), och varianter(variants).
### Users
| Fält | Datatyp | Beskrivning |
|------|---------|-------------|
| id | INT | Unikt id|
| firstname | STRING | Förnamn |
| lastname | STRING | Efternamn |
| email | STRING | E-post |
| password | STRING | Hashat Lösenord |
| role | STRING | Roll(admin, staff) |
| created_at | DATETIME | Datum för postens skapande |
| updated_at | DATETIME | Datum för postens senaste uppdatering |
### Products
| Fält | Datatyp | Beskrivning |
|------|---------|-------------|
| id | INT | Unikt id|
| name | STRING | Produktnamn |
| description | STRING | Produktbeskrivning |
| image_url | STRING | Bildsökväg |
| categoryId | INT | Foreign key till Category |
| created_at | DATETIME | Datum för postens skapande |
| updated_at | DATETIME | Datum för postens senaste uppdatering |
### Categories
| Fält | Datatyp | Beskrivning |
|------|---------|-------------|
| id | INT | Unikt id |
| name | STRING | Kategorinamn |
| created_at | DATETIME | Datum för postens skapande |
| updated_at | DATETIME | Datum för postens senaste uppdatering |
### Variants
| Fält | Datatyp | Beskrivning |
|------|---------|-------------|
| id | INT | Unikt id |
| size | STRING | Storlek på varianten (default: One Size) |
| price | DECIMAL | Pris för varianten |
| stock_quantity | INT | Lagersaldo |
| productId | INT | Foreign key till Product |
| created_at | DATETIME | Datum för postens skapande |
| updated_at | DATETIME | Datum för postens senaste uppdatering |

## Användning
Nedan finns URLs ändpunkter för att använda CRUD-operationer:
| Metod | Ändpunkt | Beskrivning |
|-------|----------|-------------|
| GET | /users | Hämta alla användarna |
| GET | /users/:id | Hämta användare med specifikt id |
| POST | /users | Lägg till en ny användare |
| PATCH | /users/:id | Uppdatera användare med specifikt id |
| DELETE | /users/:id | Radera användare med specifikt id |
| POST | /admin/create-admin | Lägg till en ny admin |
| POST | /auth/register | Lägg till ett nytt användarkonto |
| POST | /auth/login | Logga in till användarkonto |
| GET | /auth/profile | Hämta användarprofil med skyddade uppgifter |
| GET | /products | Hämta alla produkterna |
| GET | /products/:id | Hämta produkt med specifikt id |
| POST | /products | Lägg till en ny produkt |
| PATCH | /products/:id | Uppdatera produkt med specifikt id |
| PATCH | /products/:id/upload-image | Uppdatera bild av en produkt med specifikt id |
| DELETE | /products/:id | Radera produkt med specifikt id |
| GET | /categories | Hämta alla kategorierna |
| GET | /categories/:id | Hämta kategori med specifikt id |
| POST | /categories | Lägg till en ny kategori |
| PATCH | /categories/:id | Uppdatera kategori med specifikt id |
| DELETE | /categories/:id | Radera kategori med specifikt id |
| GET | /variants | Hämta alla varianterna |
| GET | /variants/:id | Hämta variant med specifikt id |
| POST | /variants | Lägg till en ny variant |
| PATCH | /variants/:id | Uppdatera variant med specifikt id |
| PATCH | /variants/:id/stock | Uppdatera lagersaldo för specifik produkt |
| DELETE | /variants/:id | Radera variant med specifikt id |

#### Tommy Issa, tois2401