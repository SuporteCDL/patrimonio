import { api } from "@/lib/axios"
import ReactModal from 'react-modal'
import { IConferencia } from "@/lib/interface"
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
import { Link, useNavigate } from "react-router-dom"
import FrmConferencia from "@/components/forms/frmconferencia"

export default function Conferencia() {
  let totalRegistros=0
  const [conferencias, setConferencias] = useState<IConferencia[]>([])
  const [conferencia, setConferencia] = useState({
    id: 0,
    descricao: '',
    data_inicio: new Date(''),
    data_fim: new Date(''),
    responsavel:'',
    status:''
  })
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isEditting, setIsEditting] = useState(false)
  
  function handleOpenModal(tipo: string, objAtivo: IConferencia) {
    if (tipo==='add') {
      setIsOpenModal(true)
      setIsEditting(false)
    } 
    if (tipo==='edit') {
      setIsOpenModal(true)
      setIsEditting(true)
      setConferencia(objAtivo)
    }
  }

  async function listaConferencias() {
    const response = await api.get('conferencia')
    setConferencias(response.data)
  }

  async function excluIAtivo(conferencia: IConferencia) {
    if (window.confirm(`Tem certeza que deseja excluír ativo ${conferencia.descricao}?`)) {
      await api.delete(`conferencia/${conferencia.id}`)
      alert(`Registro de ${conferencia.descricao} excluido com sucesso!`)
      listaConferencias()
    }
  }

  function exportarExcel() {
    const ws = XLSX.utils.json_to_sheet(conferencias)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Conferencias")

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(blob, "conferencias.xlsx")
  }

  function exportarPDF() {
    const doc = new jsPDF()
    doc.text("CONTROLE PATRIMONIAL CDL - Relatório de Conferências", 14, 10)

    // Cabeçalhos
    const colunas = ["Descricao", "Data início", "Data Término", "Responsável", "Status"]
    const linhas = conferencias.map(a => [
      a.descricao,
      a.data_inicio,
      a.data_fim,
      a.responsavel,
      a.status      
    ])

    doc.autoTable({
      head: [colunas],
      body: linhas,
      startY: 20,
    })

    doc.save("conferencias.pdf")
  }

  useEffect(() => {
    listaConferencias()
  }, [])

  return (
    <div>
      <div className="flex flex-row justify-between mb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
          <h1 className="text-2xl font-bold mr-12 md:text-left text-center">Conferências</h1>
          <div className="flex flex-row gap-4">
            <Button className="w-full md:w-20" variant="outline" onClick={ () => handleOpenModal('add', {} as IConferencia) }>+ Nova</Button>
            <Button className="md:w-20 w-full bg-green-600 hover:bg-green-700" onClick={exportarExcel}>XLS</Button>
            <Button className="md:w-20 w-full bg-red-500 hover:bg-red-700" onClick={exportarPDF}>PDF</Button>
          </div>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="flex-1 bg-gray-100 border-b-2 border-gray-300">Descrição</TableHead>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300">Data de início</TableHead>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300">Data de término</TableHead>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300">Responsável</TableHead>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300">Status</TableHead>
              <TableHead className="text-center w-32 bg-gray-100 border-b-2 border-gray-300" colSpan={3}>Opções</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conferencias.map((item, index) => {
              totalRegistros = index + 1
              return (
              <TableRow key={item.id} className={item.status === 'Aberto' ? 'bg-green-50' : 'bg-gray-200'}>
                <TableCell className="flex-1">{item.descricao}</TableCell>
                <TableCell className="w-44">
                  { new Date(item.data_inicio).toLocaleDateString('pt-BR') }
                </TableCell>
                <TableCell className="w-48">
                  { new Date(item.data_fim).toLocaleDateString('pt-BR') }
                </TableCell>
                <TableCell className="w-10">{item.responsavel}</TableCell>
                <TableCell className="flex-1">{item.status}</TableCell>
                <TableCell className="w-14">
                  <Link to='#' onClick={() => handleOpenModal('edit', {
                    id: Number(item.id),
                    descricao: item.descricao,
                    data_inicio: item.data_inicio,
                    data_fim: item.data_fim,
                    responsavel: item.responsavel,
                    status: item.status,
                  })}>
                    Alterar
                  </Link>
                </TableCell>
                <TableCell className="w-14"><Link to='#' onClick={()=>excluIAtivo(item)}>Excluir</Link></TableCell>
                <TableCell className="w-14"><Link to={`/conferenciaitens/${item.id}`}>Conferir</Link></TableCell>
              </TableRow>
            )})}
          </TableBody>
          <TableRow>
            <TableCell colSpan={7}>
              Total de registros: {totalRegistros}
            </TableCell>
          </TableRow>        
        </Table>

        <ReactModal 
          isOpen={isOpenModal}
          onAfterClose={listaConferencias}
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
              width: window.innerWidth <= 768 ? "100%" : "550px",
              height: "500px",
              WebkitOverflowScrolling: "touch",
              borderRadius: window.innerWidth <= 768 ? "0" : "4px",
              outline: "none",
              padding: "10px",
            },
          }}
        >
          <FrmConferencia 
            setIsModalOpen={setIsOpenModal} 
            isEditting={isEditting} 
            conferencia={conferencia} 
            lista={listaConferencias}
          />
        </ReactModal>
      </div>
    </div>
  )
}