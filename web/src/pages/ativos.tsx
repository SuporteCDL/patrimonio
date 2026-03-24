import { api } from "@/lib/axios"
import ReactModal from 'react-modal'
import { IAtivo, IAtivoJoin, ICentroCusto, ILocalidade, IMarca } from "@/lib/interface"
import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "react-router-dom"
import FrmAtivo from "@/components/forms/frmativo"
import { Input } from "@/components/ui/input"

export default function Ativos() {
  let totalRegistros=0
  const [localidades, setLocalidades] = useState<ILocalidade[]>([])
  const [centroCusto, setCentroCusto] = useState<ICentroCusto[]>([])
  const [subgrupos, setSubgrupos] = useState<any[]>([])
  const [marcas, setMarcas] = useState<IMarca[]>([])
  const [codLocal, setCodLocal] = useState(0)
  const [filtros, setFiltros] = useState({
    codlocalidade: "",
    codcentrocusto: "",
    codsubgrupo: "",
    codmarca: "",
    codigo: "",
  })
  const [ativos, setAtivos] = useState<IAtivoJoin[]>([])
  const [ativo, setAtivo] = useState<IAtivo>()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isEditting, setIsEditting] = useState(false)
  
  function handleOpenModal(tipo: string, objAtivo: IAtivo) {
    if (tipo==='add') {
      setIsOpenModal(true)
      setIsEditting(false)
    } 
    if (tipo==='edit') {
      setIsOpenModal(true)
      setIsEditting(true)
      setAtivo(objAtivo)
      setCodLocal(objAtivo.codlocalidade)
    }
  }

  async function listaAtivos(codlocalidade?: number) {
    const response = await api.get(`ativos?codlocalidade=${codlocalidade}`)
    setAtivos(response.data)
  }

  async function excluIAtivo(ativo: IAtivo) {
    // alert(`ativos/${ativo.id}`)
    if (window.confirm(`Tem certeza que deseja excluír ativo ${ativo.descricao}?`)) {
      await api.delete(`ativos/${ativo.id}`)
      alert(`Registro de ${ativo.descricao} excluido com sucesso!`)
      listaAtivos(ativo.codlocalidade)
    }
  }

  async function carregarDados() {
    const [localidades, centrocusto, subgrupos, marcas] = await Promise.all([
      api.get("localidades"),
      api.get("centrocusto"),
      api.get("subgrupos"),
      api.get("marcas"),
    ])
    setLocalidades(localidades.data)
    setCentroCusto(centrocusto.data)
    setSubgrupos(subgrupos.data)
    setMarcas(marcas.data)
  }
  
  function exportarExcel() {
  const ws = XLSX.utils.json_to_sheet(ativos)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Ativos")

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
  saveAs(blob, "ativos.xlsx")
}

function exportarPDF() {
  const doc = new jsPDF()
  doc.text("CONTROLE PATRIMONIAL CDL - Relatório de Ativos", 14, 10)

  // Cabeçalhos
  const colunas = ["Código", "Sub-grupo", "Descrição", "Localidade", "Centro Custo", "Marca"]
  const linhas = ativos.map(a => [
    a.codigo,
    a.subgrupo,
    a.descricao,
    a.localidade,
    a.centrocusto,
    a.marca,
  ])

  doc.autoTable({
    head: [colunas],
    body: linhas,
    startY: 20,
  })

  doc.save("ativos.pdf")
}

  useEffect(() => {
    listaAtivos()
    carregarDados()
  }, [])

  // Buscar os ativos filtrados
  async function buscarAtivos() {
    if (!filtros.codlocalidade) {
      alert("Selecione uma localidade (obrigatório)")
      return
    }
    const params = new URLSearchParams(
      Object.entries(filtros).filter(([_, v]) => v !== "")
    )
    const { data } = await api.get(`ativos?${params}`)
    setAtivos(data)
  }

  return (
    <div>
      <div className="flex flex-row justify-between mb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
          <h1 className="text-2xl font-bold mr-12 md:text-left text-center">Ativos</h1>
          <Select
            onValueChange={(v) => setFiltros({ ...filtros, codlocalidade: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Localidade" />
            </SelectTrigger>
            <SelectContent>
              {localidades.map((loc) => (
                <SelectItem key={loc.id} value={String(loc.id)}>
                  {loc.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(v) => setFiltros({ ...filtros, codcentrocusto: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Centro de Custo" />
            </SelectTrigger>
            <SelectContent>
              {centroCusto.map((cc) => (
                <SelectItem key={cc.id} value={String(cc.id)}>
                  {cc.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(v) => setFiltros({ ...filtros, codsubgrupo: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Subgrupo" />
            </SelectTrigger>
            <SelectContent>
              {subgrupos.map((sg) => (
                <SelectItem key={sg.id} value={String(sg.id)}>
                  {sg.grupo} - {sg.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(v) => setFiltros({ ...filtros, codmarca: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Marca" />
            </SelectTrigger>
            <SelectContent>
              {marcas.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Código (000000)"
            value={filtros.codigo}
            onChange={(e) => setFiltros({ ...filtros, codigo: e.target.value })}
          />
          <Button className="md:w-20 w-full" onClick={buscarAtivos}>Buscar</Button>
          <Button className="w-full md:w-20" variant="outline" onClick={ () => handleOpenModal('add', {} as IAtivo) }>+ Novo</Button>
          <Button className="md:w-20 w-full bg-green-600 hover:bg-green-700" onClick={exportarExcel}>XLS</Button>
          <Button className="md:w-20 w-full bg-red-500 hover:bg-red-700" onClick={exportarPDF}>PDF</Button>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300">Localidade</TableHead>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300">Centro de Custo</TableHead>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300">Sub-Grupo</TableHead>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300">Codigo</TableHead>
              <TableHead className="flex-1 bg-gray-100 border-b-2 border-gray-300">Descrição</TableHead>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300">Status</TableHead>
              <TableHead className="flex-1 bg-gray-100 border-b-2 border-gray-300">Responsável</TableHead>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300">Encontrado</TableHead>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300">Marca</TableHead>
              <TableHead className="text-center w-32 bg-gray-100 border-b-2 border-gray-300" colSpan={2}>Opções</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ativos.map((item, index) => {
              totalRegistros = index
              return (
              <TableRow key={item.id} className={item.encontrado ? 'bg-blue-50' : 'bg-gray-200'}>
                <TableCell className="w-28">{item.localidade}</TableCell>
                <TableCell className="w-44">{item.centrocusto}</TableCell>
                <TableCell className="w-48">{item.subgrupo}</TableCell>
                <TableCell className="w-10">{item.codigo}</TableCell>
                <TableCell className="flex-1">{item.descricao}</TableCell>
                <TableCell className="flex-1">{item.status}</TableCell>
                <TableCell className="w-10">{item.responsavel}</TableCell>
                <TableCell className="w-10 text-center">{item.encontrado ? 'Sim' : 'Não'}</TableCell>
                <TableCell className="w-10">{item.marca}</TableCell>
                <TableCell className="w-14">
                  <Link to='#' onClick={() => handleOpenModal('edit', {
                    id: Number(item.id),
                    codigo: item.codigo,
                    status: item.status,
                    motivo_baixa: item.motivo_baixa,
                    descricao: item.descricao,
                    aquisicao: item.aquisicao,
                    valor_aquisicao: item.valor_aquisicao,
                    valor_atual: item.valor_atual,
                    depreciacao: item.depreciacao,
                    codsubgrupo: Number(item.codsubgrupo),
                    codcentrocusto: Number(item.codcentrocusto),
                    codmarca: Number(item.codmarca),
                    encontrado: item.encontrado,
                    codlocalidade: Number(item.codlocalidade),
                    responsavel: item.responsavel
                  })}>
                    Alterar
                  </Link>
                </TableCell>
                <TableCell className="w-14"><Link to='#' onClick={()=>excluIAtivo(item)}>Excluir</Link></TableCell>
              </TableRow>
            )})}
          </TableBody>
          <TableRow>
            <TableCell colSpan={7}>
              Total de registros: {totalRegistros > 0 ? totalRegistros + 1 : totalRegistros}
            </TableCell>
          </TableRow>        
        </Table>

        <ReactModal 
          isOpen={isOpenModal}
          onAfterClose={listaAtivos}
          style={{
            overlay: {
              position: "fixed",
              backgroundColor: "rgba(255, 255, 255, 0.75)",
              zIndex: 50,
            },
            content: {
              position: window.innerWidth <= 768 ? "fixed" : "absolute",
              top: window.innerWidth <= 768 ? "0" : "10%",
              left: window.innerWidth <= 768 ? "0" : "30%",
              right: window.innerWidth <= 768 ? "0" : "20%",
              bottom: window.innerWidth <= 768 ? "0" : "20%",
              border: "1px solid #ccc",
              background: "#fff",
              overflow: "auto",
              width: window.innerWidth <= 768 ? "100%" : "810px",
              height: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: window.innerWidth <= 768 ? "0" : "4px",
              outline: "none",
              padding: "10px",
            },
          }}
        >
          <FrmAtivo 
            isModalOpen={setIsOpenModal} 
            isEditting={isEditting} 
            ativo={ativo} 
            listAtivos={() => listaAtivos(codLocal)} 
          />
        </ReactModal>
      </div>
    </div>
  )
}