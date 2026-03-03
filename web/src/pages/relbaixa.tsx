import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/axios";
import { ZeroLeft } from '@/utils/functions'
import { saveAs } from "file-saver"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable";
import logo from '@/assets/logotipo.png'

interface IAtivoBusca {
  centrocusto: string,
  localidade: string,
  grupo: string,
  subgrupo: string,
  marca: string,
  id: number,
  codigo: string,
  status: string,
  descricao: string,
  aquisicao: string,
  valor_aquisicao: number,
  valor_atual: number,
  depreciacao: number,
  codsubgrupo: number,
  codcentrocusto: number,
  codmarca: number,
  ultima_atualizacao: string,
  encontrado: true,
  motivo_baixa: string,
  codlocalidade: number,
  foto: string,
  responsavel: string
}

export default function RelBaixa() {
  const [codigo, setCodigo] = useState('')
  const [estado, setEstado] = useState('')
  const [motivo, setMotivo] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [ativo, setAtivo] = useState<IAtivoBusca>({} as IAtivoBusca)
  
  async function loadAtivo(codAtivo: string) {
    const cod = ZeroLeft(codAtivo, 6)
    const response = await api.get(`ativos/buscaativo/${cod}`)
    if (response.data) {
      setAtivo(response.data[0])
    }
  }

  function exportarPDF() {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    })
    // ===== CABEÇALHO =====
    
    doc.addImage(logo, "PNG", 80, 8, 40, 15)

    // Linha
    doc.line(14, 25, 196, 25)

    // ===== TÍTULO =====
    doc.setFontSize(16)
    doc.text("PEDIDO DE BAIXA PATRIMONIAL", 105, 35, { align: "center" })

    // ===== TEXTO =====
    doc.setFontSize(11)
    doc.text(
      "Solicitamos a Baixa Patrimonial dos materiais abaixo discriminados:",
      14, 45)

    // ===== TABELA =====
    const colunas = [
      "Nº PATRIM.",
      "QTDE",
      "DESCRIÇÃO DO BEM",
      "ESTADO DE CONSERVAÇÃO"
    ]

    const linhas = [[
      ativo.codigo,
      "1",
      ativo.descricao,
      estado
    ]]

    autoTable(doc, {
      head: [colunas],
      body: linhas,
      startY: 50,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [99, 99, 99],
        textColor: 255,
        fontStyle: "bold",
      },
    })

    // ===== MOTIVO =====
    const y = (doc as any).lastAutoTable.finalY + 10

    doc.text("MOTIVO DA BAIXA:", 14, y)
    doc.text(motivo, 14, y + 6)

    // ===== DECLARAÇÃO =====
    doc.text(
      "Assumo inteira responsabilidade pelas informações dadas acima.",
      14,
      y + 130
    )

    // ===== ASSINATURAS =====
    const assinaturaY = y + 170

    doc.line(14, assinaturaY, 70, assinaturaY)
    doc.line(80, assinaturaY, 136, assinaturaY)
    doc.line(146, assinaturaY, 196, assinaturaY)

    doc.setFontSize(9)
    doc.text("Responsável do Bem", 20, assinaturaY + 5)
    doc.text("Gerente do Departamento", 85, assinaturaY + 5)
    doc.text("Presidente", 160, assinaturaY + 5)
    
    const dataExtenso = new Date().toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
    doc.setFontSize(9)
    doc.text(
      `Anápolis, ${dataExtenso}`, 
      200, 
      assinaturaY + 20,
      { align: "right" }
    )

    doc.setFontSize(9)
    const alturaPagina = doc.internal.pageSize.height
    doc.text("Rua Conde Afonso Celso 43 - Anápolis / GO", 105, alturaPagina - 12, { align: "center" })
    doc.text("Tel.: (62) 3328-0008", 105, alturaPagina - 7, { align: "center" })

    doc.save("pedido_baixa.pdf")
  }

  useEffect(() => {
    loadAtivo(codigo)
  },[codigo])

  return (
    <div className="w-full h-full overflow-auto">
      <h1 className="text-2xl lg:text-lg font-bold text-left mb-4">Relatório de solicitação de baixa patrimonial</h1>
      <div className="flex flex-row gap-2 w-full mb-4 justify-start items-center">
        <label htmlFor="codigo">Codigo:</label>
        <Input 
          id="codigo"
          name="codigo"
          className="w-32"
          placeholder="999999"
          value={codigo}
          onChange={(text) => setCodigo(text.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-row gap-1 items-center">
          <span className="font-semibold">Descrição:</span>
          <span>{ativo?.descricao}</span>
        </div>

        <div className="flex flex-row gap-1 items-center">
          <span className="font-semibold">Localização:</span>
          <span>{ativo?.localidade}</span>
        </div>

        <div className="flex flex-row gap-1 items-center">
          <span className="font-semibold">Status:</span>
          <span>{ativo?.status}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-semibold">Estado de conservação:</span>
          <Input 
            name="estado"
            className="w-96"
            placeholder="Descreva como está o ativo"
            value={estado}
            onChange={(text) => setEstado(text.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-semibold">Motivo da baixa:</span>
          <Input 
            name="motivo"
            className="w-96"
            placeholder="Descreva o motivo da baixa"
            value={motivo}
            onChange={(text) => setMotivo(text.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-semibold">Responsável pelo ativo:</span>
          <Input 
            name="responsavel"
            className="w-96"
            placeholder="Descreva o motivo da baixa"
            value={responsavel}
            onChange={(text) => setResponsavel(text.target.value)}
          />
        </div>

        <Button type="button" className="w-52" onClick={exportarPDF}>Gerar Relatório</Button>
      </div>
    </div>
  )
}