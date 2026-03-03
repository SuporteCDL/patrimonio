import { api } from "@/lib/axios"
import ReactModal from 'react-modal'
import { ICentroCusto } from "@/lib/interface"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Link } from "react-router-dom"
import { AxiosRequestConfig } from "axios"
import FrmCentroCusto from "@/components/forms/frmcentrocusto"

export default function CentroCusto() {
  const [centroCustos, setCentroCustos] = useState<ICentroCusto[]>([])
  const [centroCusto, setCentroCusto] = useState<ICentroCusto>()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isEditting, setIsEditting] = useState(false)

  function handleOpenModal(tipo: string, objCentroCusto: ICentroCusto) {
    if (tipo==='add') {
      setIsOpenModal(true)
      setIsEditting(false)
    } 
    if (tipo==='edit') {
      setIsOpenModal(true)
      setIsEditting(true)
      setCentroCusto(objCentroCusto)
    } 
  }

  async function listaCentroCustos() {
    const response = await api.get('centrocusto')
    setCentroCustos(response.data)
  }

  async function excluICentroCusto(centroCusto: ICentroCusto) {
    const config: AxiosRequestConfig = {
      data: centroCusto,
    };
    if (window.confirm(`Tem certeza que deseja excluír o Centro de Custo ${centroCusto.descricao}?`)) {
       await api.delete(`centrocusto/${centroCusto.id}`, config)
       alert(`Registro de ${centroCusto.descricao} excluido com sucesso!`)
       listaCentroCustos()
    }
  }
  
  useEffect(() => {
    listaCentroCustos()
  }, [])

  return (
    <div>
      <div className="flex flex-row justify-between mb-2">
        <h1 className="text-2xl font-bold">Centro de Custos</h1>
        <Button variant="outline" onClick={ () => handleOpenModal('add', {} as ICentroCusto) }>+ Novo</Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="flex-1 bg-gray-100 border-b-2 border-gray-300">Descrição</TableHead>
              <TableHead className="text-center w-32 bg-gray-100 border-b-2 border-gray-300" colSpan={2}>Opções</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {centroCustos.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="flex-1">{item.descricao}</TableCell>
                <TableCell className="w-14">
                  <Link to='#' onClick={() => handleOpenModal('edit', item)}>
                    Alterar
                  </Link>
                </TableCell>
                <TableCell className="w-14"><Link to='#' onClick={()=>excluICentroCusto(item)}>Excluir</Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <ReactModal 
          isOpen={isOpenModal}
          onAfterClose={listaCentroCustos}
          style={{
            overlay: {
              position: 'fixed',
              backgroundColor: 'rgba(255, 255, 255, 0.75)'
            },
            content: {
              position: 'absolute',
              top: '30%',
              left: '40%',
              right: '40%',
              bottom: '40%',
              border: '1px solid #ccc',
              background: '#fff',
              overflow: 'auto',
              width: 500,
              height: 300,
              WebkitOverflowScrolling: 'touch',
              borderRadius: '4px',
              outline: 'none',
              padding: '8px'
            }  
          }}
        >
          <FrmCentroCusto isModalOpen={setIsOpenModal} isEditting={isEditting} centroCusto={centroCusto} />
        </ReactModal>
      </div>
    </div>
  )
}