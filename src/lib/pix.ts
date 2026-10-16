// Monta um campo EMV: id + tamanho(2 dígitos) + valor
function emv(id: string, value: string): string {
  if (value.length > 99) throw new Error(`Campo EMV ${id} excede 99 chars`)
  const len = value.length.toString().padStart(2, '0')
  return `${id}${len}${value}`
}

// CRC16/CCITT-FALSE (poly 0x1021, init 0xFFFF), hex maiúsculo 4 chars
export function crc16(payload: string): string {
  const bytes = new TextEncoder().encode(payload)
  let crc = 0xffff
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i] << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()
}

export function buildPixPayload(args: {
  chave: string
  nome: string
  cidade: string
  valor?: number
  txid?: string
}): string {
  const { chave, nome, cidade, valor, txid = '***' } = args
  // Merchant Account Information (id 26): GUI + chave
  const mai = emv('00', 'br.gov.bcb.pix') + emv('01', chave)
  let p = ''
  p += emv('00', '01') // Payload Format Indicator
  p += emv('26', mai)
  p += emv('52', '0000') // Merchant Category Code
  p += emv('53', '986') // moeda BRL
  if (valor != null && Number.isFinite(valor)) p += emv('54', valor.toFixed(2))
  p += emv('58', 'BR') // país
  p += emv('59', normalize(nome)) // nome recebedor (sem corte; EMV sugere 25)
  p += emv('60', normalize(cidade)) // cidade (sem corte; EMV sugere 15)
  p += emv('62', emv('05', txid)) // Additional Data / txid
  p += '6304' // campo CRC (id 63, len 04)
  p += crc16(p)
  return p
}
