# ProbBet — Documentação Completa

## 1. Visão Geral

ProbBet é uma plataforma acadêmica web onde usuários criam e participam de **rifas virtuais** usando **pontos fictícios**. O objetivo central é demonstrar conceitos de Probabilidade e Estatística de forma prática e interativa. Não há dinheiro real envolvido.

## 2. Objetivo Acadêmico

- **Probabilidade clássica** — P(vitória) = casos favoráveis / casos totais
- **Valor Esperado líquido** — E(X) = prêmio × P(vitória) − custo do ticket
- **Estatística descritiva** — média, mediana e moda dos números sorteados
- **Simulação Monte Carlo** — comparar probabilidade teórica vs observada
- **Lei dos Grandes Números** — convergência com o aumento de simulações

## 3. Fórmulas Implementadas

### P(vitória)
```
P(vitória) = tickets do usuário / total de tickets vendidos
```
Exemplo: 3 tickets em uma rifa com 50 vendidos → P = 3/50 = 6%

### Valor Esperado Líquido
```
E(X) = prêmio × P(vitória) − custo_do_ticket
```
Exemplo: prêmio = 800 pts, P = 0.06, custo = 10 → E(X) = 48 − 10 = +38 pts
Fonte: LibreTexts Mathematics, seção 4.4 (math.libretexts.org)

### Média
```
x̄ = (x₁ + x₂ + ... + xₙ) / n
```

### Mediana
- n ímpar: elemento da posição (n+1)/2
- n par: média dos elementos nas posições n/2 e n/2+1

### Moda
Valor(es) com maior frequência absoluta.

### Monte Carlo
```
P_observada = vitórias_simuladas / total_de_simulações
```
Fonte: Britannica — Monte Carlo Method (britannica.com/science/Monte-Carlo-method)

## 4. Modelagem do Banco

### users
id (UUID PK) | name | email (unique) | password (bcrypt) | points (default 100) | createdAt

### raffles
id (UUID PK) | title | description | totalNumbers | ticketCost | prizeAmount | drawDate | status (OPEN/DRAWN/CANCELLED) | creatorId (FK users) | createdAt

### tickets
id (UUID PK) | raffleId (FK) | userId (FK) | selectedNumber | createdAt

### draws
id (UUID PK) | raffleId (FK) | winningNumber | winnerId (FK nullable) | drawDate

## 5. Fluxo de Pontos

1. Cadastro: usuário recebe 100 pontos (definido no AuthService)
2. Compra de ticket: backend debita ticketCost do saldo (TicketsService)
3. Sorteio: número aleatório gerado, ticket correspondente encontrado, prizeAmount creditado ao vencedor (DrawsService)
4. Sem vencedor: se nenhum ticket tiver o número sorteado, nenhum crédito ocorre

## 6. Regras de Negócio

- Usuário não pode comprar ticket sem saldo suficiente
- Número já comprado não pode ser comprado novamente
- Apenas o criador pode executar o sorteio
- Rifa só pode ser sorteada uma vez (OPEN → DRAWN)
- Rifas sorteadas não podem ser deletadas

## 7. Endpoints Resumidos

POST   /auth/register    — Cadastro (+100 pts)
POST   /auth/login       — Login JWT
GET    /users/me         — Perfil com stats
GET    /users/ranking    — Ranking por vitórias
GET    /raffles          — Listar rifas
POST   /raffles          — Criar rifa
GET    /raffles/:id      — Detalhes
DELETE /raffles/:id      — Deletar (criador, OPEN only)
POST   /tickets          — Comprar ticket
GET    /tickets/my       — Meus tickets
GET    /tickets/raffle/:id — Tickets de uma rifa
POST   /draws/raffle/:id — Executar sorteio
GET    /draws/raffle/:id — Resultado
GET    /draws            — Histórico
GET    /stats/global     — Média, mediana, moda globais
GET    /stats/raffle/:id — Stats de uma rifa

## 8. Melhorias Futuras

- Histórico de movimentação de pontos
- WebSockets para notificação em tempo real de sorteios
- Múltiplos vencedores por rifa
- Sorteio automático por data (cron job)
- Exportação de dados em CSV
