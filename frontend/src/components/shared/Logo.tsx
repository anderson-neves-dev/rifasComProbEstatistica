interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = { sm: 32, md: 44, lg: 64 };
  const px = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <svg width={px} height={px} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ticket background */}
        <rect x="2" y="8" width="40" height="28" rx="4" fill="#1E40AF"/>
        {/* Recortes laterais */}
        <circle cx="2" cy="22" r="4" fill="white"/>
        <circle cx="42" cy="22" r="4" fill="white"/>
        {/* Linha pontilhada */}
        <line x1="6" y1="22" x2="38" y2="22" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 2.5"/>
        {/* Barras do gráfico */}
        <rect x="7"  y="13" width="3" height="7" rx="1" fill="#60A5FA"/>
        <rect x="12" y="11" width="3" height="9" rx="1" fill="#34D399"/>
        <rect x="17" y="12" width="3" height="8" rx="1" fill="#60A5FA"/>
        <rect x="22" y="10" width="3" height="10" rx="1" fill="#F59E0B"/>
        <rect x="27" y="11" width="3" height="9" rx="1" fill="#34D399"/>
        <rect x="32" y="13" width="3" height="7" rx="1" fill="#60A5FA"/>
        {/* Número no bilhete */}
        <text x="8" y="33" fontFamily="monospace" fontSize="5" fill="#93C5FD" fontWeight="500">Nº 0042</text>
        <text x="36" y="33" fontFamily="monospace" fontSize="5" fill="#6EE7B7" textAnchor="end">2.5%</text>
      </svg>
      {showText && (
        <div>
          <p className="font-bold text-primary leading-tight" style={{ fontSize: size === 'sm' ? '14px' : size === 'md' ? '17px' : '22px' }}>
            Rifas com Estatística
          </p>
          {size !== 'sm' && (
            <p className="text-gray-400 leading-none" style={{ fontSize: '10px' }}>
              probabilidade · simulação
            </p>
          )}
        </div>
      )}
    </div>
  );
}
