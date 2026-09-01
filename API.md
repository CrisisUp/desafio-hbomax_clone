# 📡 Referência de API — HBO Max Clone

Este documento descreve as APIs que podem ser implementadas no futuro para tornar o projeto dinâmico.

---

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Endpoints Planejados](#endpoints-planejados)
- [Autenticação](#autenticação)
- [Modelos de Dados](#modelos-de-dados)
- [Códigos de Status](#códigos-de-status)
- [Erros](#erros)
- [Rate Limiting](#rate-limiting)

---

## Visão Geral

| Propriedade | Valor |
|-------------|-------|
| **Base URL** | `https://api.hbomax-clone.com/v1` |
| **Formato** | JSON |
| **Autenticação** | JWT Bearer Token |
| **Rate Limit** | 100 req/15min |

---

## Endpoints Planejados

### 🔐 Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/register` | Registrar novo usuário |
| `POST` | `/auth/login` | Login do usuário |
| `POST` | `/auth/logout` | Logout do usuário |
| `POST` | `/auth/refresh` | Renovar token JWT |
| `POST` | `/auth/forgot-password` | Esqueci minha senha |

### 👤 Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/users/me` | Obter perfil do usuário |
| `PUT` | `/users/me` | Atualizar perfil |
| `DELETE` | `/users/me` | Deletar conta |
| `PUT` | `/users/me/password` | Alterar senha |

### 📺 Conteúdo

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/content` | Listar todo conteúdo |
| `GET` | `/content/:id` | Obter conteúdo específico |
| `GET` | `/content/categories` | Listar categorias |
| `GET` | `/content/category/:slug` | Conteúdo por categoria |

### 📋 Planos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/plans` | Listar planos disponíveis |
| `GET` | `/plans/:id` | Obter detalhes do plano |
| `POST` | `/plans/:id/subscribe` | Assinar plano |

### 📜 Listas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/watchlist` | Minha lista para assistir |
| `POST` | `/watchlist/:contentId` | Adicionar à lista |
| `DELETE` | `/watchlist/:contentId` | Remover da lista |
| `GET` | `/history` | Histórico de assistidos |

---

## Autenticação

### Headers Requeridos

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Fluxo de Login

```
1. POST /auth/login
   Request:  { "email": "user@example.com", "password": "senha123" }
   Response: { "token": "eyJhbG...", "user": { ... } }

2. Usar token em requisições autenticadas
   GET /users/me
   Header: Authorization: Bearer eyJhbG...

3. Token expira em 24h
   POST /auth/refresh
   Header: Authorization: Bearer eyJhbG...
   Response: { "token": "novo_token..." }
```

---

## Modelos de Dados

### User

```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "avatar": "string (URL)",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

### Content

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "type": "movie | series",
  "poster": "string (URL)",
  "backdrop": "string (URL)",
  "rating": "number (0-5)",
  "year": "number",
  "duration": "number (minutes)",
  "categories": ["string"],
  "cast": ["string"],
  "director": "string"
}
```

### Plan

```json
{
  "id": "uuid",
  "name": "string",
  "price": "number",
  "interval": "month | year",
  "features": ["string"],
  "maxScreens": "number",
  "quality": "string"
}
```

### Subscription

```json
{
  "id": "uuid",
  "userId": "uuid",
  "planId": "uuid",
  "status": "active | cancelled | expired",
  "startDate": "ISO 8601",
  "endDate": "ISO 8601",
  "paymentMethod": "string"
}
```

---

## Códigos de Status

| Código | Descrição |
|--------|-----------|
| `200` | OK - Requisição bem-sucedida |
| `201` | Created - Recurso criado |
| `204` | No Content - Sucesso sem conteúdo |
| `400` | Bad Request - Parâmetros inválidos |
| `401` | Unauthorized - Não autenticado |
| `403` | Forbidden - Sem permissão |
| `404` | Not Found - Recurso não encontrado |
| `409` | Conflict - Conflito (ex: email já existe) |
| `422` | Unprocessable Entity - Dados inválidos |
| `429` | Too Many Requests - Rate limit |
| `500` | Internal Server Error - Erro no servidor |

---

## Erros

### Formato

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email inválido",
    "details": [
      {
        "field": "email",
        "message": "Formato de email inválido"
      }
    ]
  }
}
```

### Códigos de Erro

| Código | Descrição |
|--------|-----------|
| `VALIDATION_ERROR` | Erro de validação |
| `AUTH_REQUIRED` | Autenticação necessária |
| `AUTH_INVALID` | Credenciais inválidas |
| `TOKEN_EXPIRED` | Token expirado |
| `FORBIDDEN` | Sem permissão |
| `NOT_FOUND` | Recurso não encontrado |
| `CONFLICT` | Conflito de dados |
| `RATE_LIMITED` | Rate limit atingido |
| `INTERNAL_ERROR` | Erro interno |

---

## Rate Limiting

### Headers de Resposta

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1693526400
```

### Quando atingir o limite

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Muitas requisições. Tente novamente mais tarde.",
    "retryAfter": 900
  }
}
```

---

## Exemplos de Requisição

### Login

```bash
curl -X POST https://api.hbomax-clone.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "senha123"
  }'
```

### Obter Conteúdo

```bash
curl https://api.hbomax-clone.com/v1/content \
  -H "Authorization: Bearer eyJhbG..."
```

### Adicionar à Watchlist

```bash
curl -X POST https://api.hbomax-clone.com/v1/watchlist/abc123 \
  -H "Authorization: Bearer eyJhbG..."
```

---

## SDKs (Futuro)

| Linguagem | Status |
|-----------|--------|
| JavaScript | Planejado |
| Python | Planejado |
| React | Planejado |

---

*Referência de API — HBO Max Clone*
