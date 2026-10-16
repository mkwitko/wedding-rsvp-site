// Site content. Personal and event-specific values come from VITE_* env vars
// (see .env.example); the defaults below are neutral placeholders.
const env = import.meta.env as Record<string, string | undefined>
const val = (key: string, fallback: string): string => env[key]?.trim() || fallback

const dataISO = val('VITE_EVENT_DATE_ISO', '2030-01-01T18:00:00-03:00')
const eventDate = new Date(dataISO)
const mapsQuery = val('VITE_VENUE_MAPS_QUERY', '0,0')

export const content = {
  casal: { noiva: val('VITE_PARTNER_A', 'Partner A'), noivo: val('VITE_PARTNER_B', 'Partner B') },
  dataISO,
  dataLabel: eventDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' }),
  horaLabel: eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }),
  local: {
    nome: val('VITE_VENUE_NAME', 'Venue name'),
    cidade: val('VITE_VENUE_CITY', 'City - ST'),
    endereco: val('VITE_VENUE_ADDRESS', 'Street, number, district, city'),
    mapsEmbed: `https://www.google.com/maps?q=${mapsQuery}&z=16&output=embed`,
    mapsLink: `https://www.google.com/maps?q=${mapsQuery}`,
  },
  historia: [
    'Aqui vai a nossa história — troque este texto quando quiser.',
    'Conte como se conheceram, o pedido, o que os une. Cada item do array vira um parágrafo.',
  ],
  // Fotos de bebê do casal na seção "Nossa história".
  // Coloque os arquivos em public/fotos/ e ponha o caminho em src (ex: '/fotos/foto-1.jpg').
  // src vazio => mostra placeholder elegante.
  historiaFotos: [
    { src: '', alt: 'Partner B as a baby', legenda: 'Partner B' },
    { src: '', alt: 'Partner A as a baby', legenda: 'Partner A' },
  ] as { src: string; alt: string; legenda: string }[],
  pix: {
    chave: val('VITE_PIX_KEY', 'pix-key@example.com'),
    // usados no payload BR Code; ajuste se quiser:
    nomeRecebedor: val('VITE_PIX_RECEIVER_NAME', 'Receiver Name'),
    cidadeRecebedor: val('VITE_PIX_RECEIVER_CITY', 'CITY'),
  },
  galeria: [
    // { src: '/fotos/1.jpg', alt: 'Couple' }
    // vazio => placeholders elegantes
  ] as { src: string; alt: string }[],
  convite: {
    // {nome} e {link} são substituídos ao gerar a mensagem
    mensagemWhatsApp: [
      '{saudacao},',
      '',
      'É com grande alegria e amor no coração que compartilhamos com todos vocês um momento muito especial: *o nosso casamento!*',
      '',
      'Queremos que você faça parte dessa celebração, pois a sua presença tornará esse dia ainda mais significativo.',
      '',
      '*Save the Date!*',
      '',
      'Confirme sua presença preenchendo nossa lista aqui: {link}',
      '',
      'Pedimos, por gentileza, que confirmem a participação, pois essa confirmação será bem importante para a organização do evento.',
      '',
      'Contamos com a presença e o carinho de todos para celebrar conosco esse novo capítulo de nossas vidas!',
      '',
      'Com carinho,',
      `${val('VITE_PARTNER_A', 'Partner A')} e ${val('VITE_PARTNER_B', 'Partner B')} 💛`,
    ].join('\n'),
    textoConvite:
      'É com muito carinho que convidamos você para celebrar o nosso casamento. Sua presença vai tornar esse dia ainda mais especial.',
  },
  doacao: {
    // número (com DDI 55) que recebe o aviso de "acabei de doar"
    whatsappAviso: val('VITE_NOTIFY_WHATSAPP', '5500900000000'),
    // {presente} é substituído pela sugestão escolhida (ou vazio)
    msgAviso: 'Oi! 💛 Acabei de contribuir com o presente de vocês{presente}. Felicidades ao casal!',
    // valor 0 = PIX sem valor fixo (a pessoa escolhe)
    sugestoes: [
      { emoji: '🕯️', titulo: 'Velas pro nosso jantar à luz de velas', valor: 25 },
      { emoji: '☕', titulo: 'Café da manhã na cama', valor: 39 },
      { emoji: '🌻', titulo: 'Flores pra alegrar o lar', valor: 55 },
      { emoji: '🍰', titulo: 'Aquela sobremesa que a gente ama', valor: 77 },
      { emoji: '🍽️', titulo: 'Nosso primeiro jantar em casa', valor: 149 },
      { emoji: '🛏️', titulo: 'Lençóis novos pra dormir bem', valor: 199 },
      { emoji: '🍳', titulo: 'Panelas pra cozinhar a dois', valor: 299 },
      { emoji: '🧹', titulo: 'Uma mãozinha na mudança', valor: 444 },
      { emoji: '🛋️', titulo: 'Um sofá pra maratonar filmes', valor: 555 },
      { emoji: '✈️', titulo: 'Um pedacinho da lua de mel', valor: 1000 },
      { emoji: '🏡', titulo: 'Um tijolinho do nosso lar', valor: 2000 },
      { emoji: '💛', titulo: 'Surpreenda os noivos', valor: 0 },
    ] as { emoji: string; titulo: string; valor: number }[],
  },
} as const
