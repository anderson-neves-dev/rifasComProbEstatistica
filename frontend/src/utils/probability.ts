/**
 * Calcula a probabilidade de vitória do usuário em uma rifa.
 * P(vitória) = tickets do usuário / total de tickets vendidos
 */
export function calculateWinProbability(userTickets: number, totalTicketsSold: number): number {
  if (totalTicketsSold === 0) return 0;
  return parseFloat(((userTickets / totalTicketsSold) * 100).toFixed(2));
}

/**
 * Calcula o Valor Esperado líquido de participar em uma rifa.
 * E(X) = prêmio × P(vitória) − custo do ticket
 * Fonte: LibreTexts Mathematics, seção 4.4 — Expected Value
 */
export function calculateExpectedValue(
  prizeAmount: number,
  userTickets: number,
  totalTicketsSold: number,
  ticketCost: number,
): number {
  if (totalTicketsSold === 0) return -ticketCost;
  const probability = userTickets / totalTicketsSold;
  return parseFloat((prizeAmount * probability - ticketCost).toFixed(2));
}

/**
 * Executa simulação Monte Carlo para estimar probabilidade empírica.
 * Repete o sorteio N vezes e conta quantas vezes o usuário ganharia.
 * Retorna a probabilidade observada e os resultados por iteração para o gráfico de convergência.
 */
export function runMonteCarloSimulation(
  userTickets: number,
  totalNumbers: number,
  totalTicketsSold: number,
  simulations: number,
): { observedProbability: number; convergenceData: { simulation: number; probability: number }[] } {
  const convergenceData: { simulation: number; probability: number }[] = [];
  let wins = 0;

  for (let i = 1; i <= simulations; i++) {
    // Gera número vencedor aleatório entre 1 e totalNumbers
    const winningNumber = Math.floor(Math.random() * totalNumbers) + 1;

    // Simplificação: simula se o usuário teria ganhado dado seu número de tickets
    // P(ganhar em um sorteio) = userTickets / totalTicketsSold
    const userWins = winningNumber <= (totalNumbers * (userTickets / totalTicketsSold));
    if (userWins) wins++;

    // Registra convergência a cada intervalo para o gráfico
    const interval = Math.max(1, Math.floor(simulations / 50));
    if (i % interval === 0 || i === simulations) {
      convergenceData.push({
        simulation: i,
        probability: parseFloat(((wins / i) * 100).toFixed(2)),
      });
    }
  }

  return {
    observedProbability: parseFloat(((wins / simulations) * 100).toFixed(2)),
    convergenceData,
  };
}
