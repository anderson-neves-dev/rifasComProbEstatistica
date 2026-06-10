# ProbBet — Tutorial de Instalação

## Pré-requisitos

Instale o Docker Desktop no seu computador:
- Windows/Mac: https://www.docker.com/products/docker-desktop/
- Ubuntu: `sudo apt install docker.io docker-compose`

Verifique a instalação:
```bash
docker --version
docker compose version
```

---

## 1. Clonar o projeto

```bash
git clone https://github.com/seu-usuario/probbet.git
cd probbet
```

---

## 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

O arquivo `.env` padrão já funciona sem edição. Opcionalmente edite:
- `JWT_SECRET` — troque por um valor secreto longo
- `POSTGRES_PASSWORD` — mude a senha do banco

---

## 3. Subir os containers

```bash
docker compose up -d
```

Aguarde cerca de 30-60 segundos. O banco precisa inicializar antes do backend.

Verifique se tudo está rodando:
```bash
docker compose ps
```

Você deve ver 3 containers com status `Up`:
- `probbet_postgres`
- `probbet_backend`
- `probbet_frontend`

---

## 4. Acessar o sistema

| Serviço | URL |
|---------|-----|
| Frontend (aplicação) | http://localhost:5173 |
| Backend (API) | http://localhost:3000 |
| Swagger (docs API) | http://localhost:3000/api |
| PostgreSQL | localhost:5432 |

---

## 5. Acessar o PostgreSQL

Via terminal:
```bash
docker exec -it probbet_postgres psql -U probbet -d probbet_db
```

Listar tabelas:
```sql
\dt
SELECT * FROM users;
SELECT * FROM raffles;
\q
```

---

## 6. Parar os containers

```bash
docker compose down
```

---

## 7. Reiniciar os containers

```bash
docker compose restart
```

Ou parar e subir novamente:
```bash
docker compose down
docker compose up -d
```

---

## 8. Ver logs

Todos os containers:
```bash
docker compose logs -f
```

Apenas o backend:
```bash
docker compose logs -f backend
```

Apenas o banco:
```bash
docker compose logs -f postgres
```

---

## 9. Recriar o banco do zero

**Atenção: apaga todos os dados!**

```bash
docker compose down -v
docker compose up -d
```

O `-v` remove o volume do PostgreSQL. O banco será recriado vazio.

---

## 10. Reconstruir as imagens (após mudanças no código)

```bash
docker compose build
docker compose up -d
```

---

## 11. Uso básico do sistema

1. Acesse http://localhost:5173
2. Clique em "Cadastre-se" e crie uma conta — você receberá 100 pontos
3. No Dashboard, clique em "Criar Rifa"
4. Preencha: título, quantidade de números, custo por ticket e prêmio
5. Abra a rifa criada e compre um número
6. Para testar o sorteio: crie uma segunda conta, compre outro número, e execute o sorteio como criador
7. Veja as estatísticas em "Central Estatística"
8. Experimente o simulador em "Simulador Monte Carlo"

---

## 12. Troubleshooting

**Backend não conecta ao banco:**
```bash
docker compose restart backend
```

**Porta já em uso:**
Edite o `docker-compose.yml` e mude as portas externas (ex: `5174:80` para o frontend).

**Limpar tudo e começar do zero:**
```bash
docker compose down -v
docker system prune -f
docker compose up -d --build
```
