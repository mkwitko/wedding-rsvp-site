import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { Send, Copy, Trash2, Check, Download, FileText } from 'lucide-react'
import { db } from '@/firebase'
import { content } from '../content'
import {
  parseLista,
  waLink,
  msgConvite,
  statusConvidados,
  type ConvidadoStatus,
} from '@/lib/convites'
import { criarConvidados, listarConvidados, setEnviado, apagarConvidado } from '@/lib/convitesDb'
import { toCsvConvidados } from './convidadosCsv'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

function linkConvite(id: string): string {
  return `${window.location.origin}/convite/${id}`
}

export function Convidados() {
  const [rows, setRows] = useState<ConvidadoStatus[]>([])
  const [carregando, setCarregando] = useState(true)
  const [bulk, setBulk] = useState('')
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [copiado, setCopiado] = useState('')
  const [copiadoTexto, setCopiadoTexto] = useState('')

  async function carregar() {
    setCarregando(true)
    const [convidados, rsvpSnap] = await Promise.all([
      listarConvidados(),
      getDocs(collection(db, 'rsvps')),
    ])
    const rsvps = rsvpSnap.docs.map((d) => {
      const x = d.data() as { conviteId?: string; presenca?: 'sim' | 'nao' }
      return { conviteId: x.conviteId ?? '', presenca: x.presenca ?? 'nao' }
    })
    setRows(statusConvidados(convidados, rsvps))
    setCarregando(false)
  }

  useEffect(() => {
    void carregar()
  }, [])

  async function addUm() {
    if (!nome.trim()) return
    await criarConvidados([{ nome, telefone }])
    setNome(''); setTelefone('')
    await carregar()
  }

  async function addLista() {
    const itens = parseLista(bulk)
    if (itens.length === 0) return
    await criarConvidados(itens)
    setBulk('')
    await carregar()
  }

  async function alternarEnviado(r: ConvidadoStatus) {
    await setEnviado(r.id, !r.enviado)
    await carregar()
  }

  async function remover(id: string) {
    if (!confirm('Apagar este convidado?')) return
    await apagarConvidado(id)
    await carregar()
  }

  function enviarWhats(r: ConvidadoStatus) {
    if (!r.telefone.trim()) return
    const msg = msgConvite(content.convite.mensagemWhatsApp, r.nome, linkConvite(r.id))
    window.open(waLink(r.telefone, msg), '_blank')
    if (!r.enviado) void setEnviado(r.id, true).then(carregar)
  }

  async function copiarLink(id: string) {
    try {
      await navigator.clipboard.writeText(linkConvite(id))
      setCopiado(id)
      setTimeout(() => setCopiado(''), 2000)
    } catch {
      /* bloqueado */
    }
  }

  async function copiarTexto(r: ConvidadoStatus) {
    const msg = msgConvite(content.convite.mensagemWhatsApp, r.nome, linkConvite(r.id))
    try {
      await navigator.clipboard.writeText(msg)
      setCopiadoTexto(r.id)
      setTimeout(() => setCopiadoTexto(''), 2000)
    } catch {
      /* bloqueado */
    }
  }

  function baixarCsv() {
    const blob = new Blob(['﻿' + toCsvConvidados(rows)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'convidados.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const enviados = rows.filter((r) => r.enviado).length
  const confirmados = rows.filter((r) => r.confirmou).length

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        <div className="rounded-2xl border border-gold/25 bg-navy-800/60 px-6 py-4">
          <b className="block font-display text-3xl text-gold-light">{rows.length}</b>
          <span className="text-sm text-champagne/70">convidados</span>
        </div>
        <div className="rounded-2xl border border-gold/25 bg-navy-800/60 px-6 py-4">
          <b className="block font-display text-3xl text-gold-light">{enviados}</b>
          <span className="text-sm text-champagne/70">convites enviados</span>
        </div>
        <div className="rounded-2xl border border-gold/25 bg-navy-800/60 px-6 py-4">
          <b className="block font-display text-3xl text-gold-light">{confirmados}</b>
          <span className="text-sm text-champagne/70">confirmados</span>
        </div>
        <Button variant="outline" className="ml-auto self-center" onClick={baixarCsv}>
          <Download className="size-4" /> CSV
        </Button>
      </div>


      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 rounded-2xl border border-gold/20 bg-navy-800/40 p-5">
          <p className="font-medium text-gold-light">Adicionar um</p>
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome (ex: João  ou  João e Maria)"
          />
          <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Telefone (WhatsApp)" />
          <Button onClick={addUm}>Adicionar</Button>
        </div>
        <div className="space-y-2 rounded-2xl border border-gold/20 bg-navy-800/40 p-5">
          <p className="font-medium text-gold-light">Adicionar em massa</p>
          <Textarea
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            placeholder={'Uma por linha:\nAna, 51999990000\nJoão, 5188887777'}
            className="min-h-28"
          />
          <Button onClick={addLista}>Importar lista</Button>
        </div>
      </div>

      {carregando ? (
        <p className="text-champagne/80">Carregando…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gold/20">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="text-gold-light">
                <th className="p-3">Nome</th>
                <th className="p-3">Telefone</th>
                <th className="p-3">Enviado</th>
                <th className="p-3">Confirmou</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-navy-700/70">
                  <td className="p-3 text-cream">{r.nome}</td>
                  <td className="p-3 text-champagne/80">{r.telefone || '—'}</td>
                  <td className="p-3">
                    <button onClick={() => alternarEnviado(r)} className="underline-offset-2 hover:underline">
                      {r.enviado ? '✓ sim' : 'não'}
                    </button>
                  </td>
                  <td className="p-3">{r.confirmou ? '✓ sim' : '—'}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => enviarWhats(r)} disabled={!r.telefone.trim()}>
                        <Send className="size-3.5" /> WhatsApp
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => copiarTexto(r)}>
                        {copiadoTexto === r.id ? <Check className="size-3.5" /> : <FileText className="size-3.5" />}
                        texto
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => copiarLink(r.id)}>
                        {copiado === r.id ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                        link
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-champagne/60 hover:text-destructive"
                        onClick={() => remover(r.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
