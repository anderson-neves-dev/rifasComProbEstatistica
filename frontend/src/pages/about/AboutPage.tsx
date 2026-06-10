import Logo from '../../components/shared/Logo';
import { GraduationCap, BookOpen, FlaskConical, Users, BarChart2, Ticket } from 'lucide-react';

export default function AboutPage() {
  const concepts = [
    { icon: BarChart2, label: 'Média, Mediana e Moda', desc: 'Medidas de tendência central dos números sorteados' },
    { icon: FlaskConical, label: 'Simulação Monte Carlo', desc: 'Estimativa de probabilidades por repetição aleatória' },
    { icon: Ticket, label: 'Probabilidade Clássica', desc: 'P(vitória) = casos favoráveis / casos totais' },
    { icon: BookOpen, label: 'Valor Esperado', desc: 'E(X) = prêmio × P(vitória) − custo do ticket' },
  ];

  const skills = [
    'Desenvolvimento web com React e NestJS',
    'Modelagem de banco de dados relacional',
    'Aplicação prática de conceitos estatísticos',
    'Simulação probabilística computacional',
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <div className="flex justify-center mb-4">
          <Logo size="lg" showText={true} />
        </div>
        <div className="inline-block bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium px-4 py-1.5 rounded-full mt-2">
          Trabalho Acadêmico — Sem fins lucrativos
        </div>
        <p className="text-gray-600 mt-4 leading-relaxed">
          Esta plataforma foi desenvolvida exclusivamente para fins acadêmicos,
          como trabalho prático da disciplina de <strong>Probabilidade e Estatística</strong>.
          Nenhum valor real é utilizado — todo o sistema opera com <strong>pontos virtuais fictícios</strong>.
        </p>
      </div>

      {/* Instituição */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 rounded-xl p-3 flex-shrink-0">
            <GraduationCap size={28} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">Instituição</h3>
            <p className="text-gray-600 mt-1 leading-relaxed">
              <strong>Instituto Federal de Educação, Ciência e Tecnologia da Bahia</strong><br />
              IFBA — Campus Vitória da Conquista
            </p>
            <div className="mt-3 space-y-1.5 text-sm text-gray-500">
              <p>📚 Disciplina: <strong className="text-gray-700">Probabilidade e Estatística</strong></p>
              <p>🎓 Curso: <strong className="text-gray-700">Sistemas de Informação</strong></p>
              <p>📍 Campus: <strong className="text-gray-700">Vitória da Conquista — BA</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Objetivo */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-3 flex items-center gap-2">
          <BookOpen size={20} className="text-primary" /> Objetivo do projeto
        </h3>
        <p className="text-gray-600 leading-relaxed">
          O projeto visa demonstrar de forma interativa e visual os principais conceitos
          de probabilidade e estatística estudados na disciplina. A mecânica de rifas virtuais
          serve como contexto prático para aplicar e visualizar os cálculos em tempo real,
          tornando o aprendizado mais dinâmico e intuitivo.
        </p>
      </div>

      {/* Conceitos aplicados */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
          <FlaskConical size={20} className="text-primary" /> Conceitos aplicados
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {concepts.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">
                <Icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">{label}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competências */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
          <Users size={20} className="text-primary" /> Competências desenvolvidas
        </h3>
        <ul className="space-y-2">
          {skills.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 text-center">
        <p className="text-xs text-gray-400 leading-relaxed">
          Este sistema não realiza transações financeiras de nenhuma natureza.<br />
          Todos os "pontos" são fictícios e não possuem valor monetário real.<br />
          Desenvolvido exclusivamente para fins educacionais — IFBA, 2025.
        </p>
      </div>

    </div>
  );
}
