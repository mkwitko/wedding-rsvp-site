import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Check, Copy, QrCode, Gift, Send } from 'lucide-react'
import { content } from '../content'
import { buildPixPayload } from '../lib/pix'
import { waLink } from '../lib/convites'
import { Section } from './Section'
import { Button } from '@/components/ui/button'

type Sugestao = { emoji: string; titulo: string; valor: number }

export function Presentes() {
  const { chave, nomeRecebedor, cidadeRecebedor } = content.pix
  const [qr, setQr] = useState('')
  const [copiado, setCopiado] = useState<'' | 'chave' | 'codigo'>('')
  const [selecionado, setSelecionado] = useState<Sugestao | null>(null)
  const [avisoCopia, setAvisoCopia] = useState('')
  const [copiadoSug, setCopiadoSug] = useState('')

  // payload segue o valor do presente selecionado (undefined = sem valor fixo)
  const valorSel = selecionado && selecionado.valor > 0 ? selecionado.valor : undefined
  const payload = buildPixPayload({
    chave,
    nome: nomeRecebedor,
    cidade: cidadeRecebedor,
    valor: valorSel,
  })

  useEffect(() => {
    QRCode.toDataURL(payload, { margin: 1, width: 260, color: { dark: '#0a1a3f', light: '#f7f3ea' } })
      .then(setQr)
      .catch(() => setQr(''))
  }, [payload])

  async function copy(text: string, which: 'chave' | 'codigo') {
    try {
      await navigator.clipboard.writeText(text)
      setCopiado(which)
      setTimeout(() => setCopiado(''), 2000)
    } catch {
      /* clipboard bloqueado */
    }
  }

  async function escolherSugestao(s: Sugestao) {
    setSelecionado(s)
    // gera e copia o código já com o valor (QR do card também atualiza via payload)
    const code = buildPixPayload({
      chave,
      nome: nomeRecebedor,
      cidade: cidadeRecebedor,
      valor: s.valor > 0 ? s.valor : undefined,
    })
    try {
      await navigator.clipboard.writeText(code)
      setCopiadoSug(s.titulo)
      setTimeout(() => setCopiadoSug(''), 3000)
      setAvisoCopia(
        s.valor > 0
          ? `Presente escolhido: ${s.titulo} — R$ ${s.valor}. Código PIX copiado e QR atualizado! 💛`
          : 'Código PIX copiado! Escolha o valor no seu banco 💛',
      )
      setTimeout(() => setAvisoCopia(''), 5000)
    } catch {
      setAvisoCopia('QR atualizado! Não deu pra copiar o código — use a chave ou o QR 💛')
      setTimeout(() => setAvisoCopia(''), 5000)
    }
  }

  function avisarNoWhats() {
    const presente = selecionado
      ? selecionado.valor > 0
        ? ` — ${selecionado.titulo} (R$ ${selecionado.valor})`
        : ` — ${selecionado.titulo}`
      : ''
    const msg = content.doacao.msgAviso.replace('{presente}', presente)
    window.open(waLink(content.doacao.whatsappAviso, msg), '_blank')
  }

  return (
    <div id="presentes">
      <Section eyebrow="com carinho" title="Presentes" width="wide">
        <p className="mx-auto mb-6 max-w-md text-champagne/90">
          Sua presença é o maior presente. Se quiser nos ajudar a começar essa história, contribua via
          PIX 💛
        </p>

        {/* como doar — passo a passo pra quem não conhece PIX */}
        <details className="mx-auto mb-8 max-w-2xl overflow-hidden rounded-2xl border border-gold/25 bg-navy-800/40 text-left">
          <summary className="cursor-pointer list-none px-5 py-4 font-medium text-gold-light [&::-webkit-details-marker]:hidden">
            🤔 Nunca doou por PIX? Veja como fazer aqui — é rapidinho
          </summary>
          <ol className="space-y-2 px-6 pb-5 text-sm text-champagne/85 [counter-reset:passo]">
            <li>
              <b className="text-gold-light">1.</b> Escolha um presentinho abaixo (ou use a chave/QR).
              O código do PIX é copiado automaticamente.
            </li>
            <li>
              <b className="text-gold-light">2.</b> Abra o app do seu banco e entre na área <b>PIX</b>.
            </li>
            <li>
              <b className="text-gold-light">3.</b> Escolha <b>“PIX Copia e Cola”</b> e cole o código —
              ou <b>“Pagar/Ler QR Code”</b> e aponte a câmera pro QR.
            </li>
            <li>
              <b className="text-gold-light">4.</b> Confira o valor e confirme. Pronto! 💛
            </li>
            <li>
              <b className="text-gold-light">5.</b> Se quiser, toque em <b>“Já contribuí — avisar os
                noivos”</b> pra mandar um oi no nosso WhatsApp.
            </li>
          </ol>
        </details>

        {/* sugestões engraçadas */}
        <div className="mx-auto mb-10 max-w-3xl">
          <p className="mb-4 flex items-center justify-center gap-2 font-script text-2xl text-gold-light">
            <Gift className="size-5" /> escolha um presentinho
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {content.doacao.sugestoes.map((s) => (
              <button
                key={s.titulo}
                onClick={() => escolherSugestao(s)}
                className={`flex flex-col items-center gap-1 rounded-2xl border p-4 text-center transition-all hover:-translate-y-0.5 ${selecionado?.titulo === s.titulo
                    ? 'border-gold bg-gold/10'
                    : 'border-gold/25 bg-navy-800/50 hover:border-gold/60'
                  }`}
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-sm text-cream">{s.titulo}</span>
                {copiadoSug === s.titulo ? (
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold-light">
                    <Check className="size-3.5" /> código copiado!
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-gold-light">
                    {s.valor > 0 ? `R$ ${s.valor}` : 'à vontade'}
                  </span>
                )}
              </button>
            ))}
          </div>
          {avisoCopia && (
            <p className="mt-4 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold-light">
              {avisoCopia}
            </p>
          )}
        </div>

        <div className="mx-auto flex max-w-2xl flex-col items-center gap-7 rounded-3xl border border-gold/25 bg-navy-800/50 p-9 shadow-[0_16px_50px_-16px_rgba(4,10,28,0.7)]">
          {selecionado && selecionado.valor > 0 && (
            <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3">
              <span className="text-sm text-gold-light">
                {selecionado.emoji} {selecionado.titulo} · <b>R$ {selecionado.valor}</b>
              </span>
              <button
                onClick={() => setSelecionado(null)}
                className="text-xs text-champagne/70 underline underline-offset-2 hover:text-champagne"
              >
                limpar valor
              </button>
            </div>
          )}
          {qr && (
            <img
              src={qr}
              alt="QR Code PIX"
              width={240}
              height={240}
              className="rounded-xl border border-gold/50 bg-cream p-3 shadow-[0_0_28px_rgba(201,162,75,0.22)]"
            />
          )}

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="py-2 flex-1 text-base [&_svg]:size-5"
              onClick={() => copy(chave, 'chave')}
            >
              {copiado === 'chave' ? <Check /> : <Copy />}
              {copiado === 'chave' ? 'Chave copiada!' : 'Copiar chave'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="py-2 flex-1 text-base [&_svg]:size-5"
              onClick={() => copy(payload, 'codigo')}
            >
              {copiado === 'codigo' ? <Check /> : <QrCode />}
              {copiado === 'codigo' ? 'Copiado!' : valorSel ? `Copia e cola (R$ ${valorSel})` : 'Copia e cola'}
            </Button>
          </div>

          <div className="w-full rounded-xl border border-gold/20 bg-navy-900/50 px-5 py-4 text-center">
            <p className="text-sm uppercase tracking-wide text-champagne/60">Chave PIX</p>
            <code className="mt-1 block text-lg font-medium break-all text-gold-light sm:text-xl">
              {chave}
            </code>
          </div>

          <Button
            size="lg"
            variant="outline"
            className="w-full py-2 text-base [&_svg]:size-5"
            onClick={avisarNoWhats}
          >
            <Send /> Já contribuí — avisar os noivos
          </Button>
        </div>
      </Section>
    </div>
  )
}
