# Shopper Meter Reader API

API para processamento de leituras de medidores de água e gás usando visão computacional.

## Sobre o Projeto

O Shopper Meter Reader é uma API REST que permite:

- Upload de imagens de medidores de água e gás
- Processamento automático da leitura usando IA (Gemini)
- Confirmação ou correção das leituras processadas
- Listagem do histórico de leituras por cliente

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Google Gemini API (Visão Computacional)
- Jest (Testes)
- Docker

## Requisitos

- Node.js 20+
- PostgreSQL
- Chave de API do Google Gemini

## Instalação

### Usando Docker

1. Clone o repositório
```
git clone <url-do-repositório>
cd shopper-meter-reader
```

2. Configure o arquivo .env
```
cp .env.example .env
```

3. Edite o arquivo .env com suas configurações
```
DATABASE_URL="postgresql://user:password@localhost:5432/shopper_meter_reader?schema=public"
GEMINI_API_KEY="sua-chave-api-gemini"
PORT=8080
```

4. Execute com Docker Compose
```
docker-compose up -d
```

### Instalação Local

1. Clone o repositório
```
git clone <url-do-repositório>
cd shopper-meter-reader
```

2. Instale as dependências
```
npm install
```

3. Configure o arquivo .env
```
cp .env.example .env
```

4. Edite o arquivo .env com suas configurações

5. Execute as migrações do banco de dados
```
npx prisma migrate dev
```

6. Inicie o servidor
```
npm run dev
```

## Endpoints da API

### Upload de Leitura

```
POST /api/measures/upload

Body:
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
  "customer_code": "12345",
  "measure_datetime": "2025-04-30T12:00:00Z",
  "measure_type": "WATER" // ou "GAS"
}

Resposta:
{
  "image_url": "http://localhost.com/images/uuid",
  "measure_value": 123.45,
  "measure_uuid": "uuidv4"
}
```

### Confirmação ou Correção de Leitura

```
PATCH /api/measures/confirm

Body:
{
  "measure_uuid": "uuid",
  "confirmed_value": 123.45
}

Resposta:
{
  "success": true
}
```

### Listar Leituras por Cliente

```
GET /api/measures/{customer_code}/list?measure_type=WATER

Resposta:
{
  "customer_code": "12345",
  "measures": [
    {
      "measure_uuid": "uuid",
      "measure_datetime": "2025-04-30T12:00:00Z",
      "measure_type": "WATER",
      "has_confirmed": true,
      "image_url": "http://localhost.com/images/uuid"
    }
  ]
}
```

## Formatos de Imagem Suportados

A API suporta vários formatos de imagem:
- JPEG
- PNG
- GIF
- WebP

A detecção do tipo de imagem é feita automaticamente a partir do conteúdo base64, identificando as assinaturas:

| Formato | Assinatura Base64 |
|---------|-------------------|
| JPEG    | `/9j/`            |
| PNG     | `iVBORw0`         |
| GIF     | `R0lGODlh`        |
| WebP    | `UklGR`           |

## Estrutura do Projeto

```
src/
├── config/           # Configurações (Gemini API)
├── controllers/      # Controladores da API
├── database/         # Configuração do banco de dados
├── enums/            # Enumerações para tipos
├── routes/           # Definição de rotas
├── schemas/          # Esquemas de validação (Zod)
├── services/         # Lógica de negócio
└── __tests__/        # Testes unitários
```

## Testes

Execute os testes com:

```
npm test
```

Para executar os testes no modo watch:

```
npm run test:watch
```

## Ambientes

### Desenvolvimento
```
npm run dev
```

### Produção
```
npm start
```

## Docker

O projeto inclui um Dockerfile e docker-compose.yml para facilitar a execução em ambientes Docker.

Para construir e iniciar os contêineres:
```
docker-compose up -d
```

## Licença

ISC