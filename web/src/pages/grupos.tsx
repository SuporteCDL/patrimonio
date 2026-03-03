import { api } from "@/lib/axios"
import ReactModal from 'react-modal'
import { IGrupo } from "@/lib/interface"
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
import FrmGrupo from "@/components/forms/frmgrupo"

export default function Grupos() {
  const [grupos, setGrupos] = useState<IGrupo[]>([])
  const [grupo, setGrupo] = useState<IGrupo>()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isEditting, setIsEditting] = useState(false)

  function handleOpenModal(tipo: string, objGrupo: IGrupo) {
    if (tipo==='add') {
      setIsOpenModal(true)
      setIsEditting(false)
    } 
    if (tipo==='edit') {
      setIsOpenModal(true)
      setIsEditting(true)
      setGrupo(objGrupo)
    } 
  }

  async function listaGrupos() {
    const response = await api.get('grupos')
    setGrupos(response.data)
  }

  async function excluiGrupo(grupo: IGrupo) {
    const config: AxiosRequestConfig = {
      data: grupo,
    };
    if (window.confirm(`Tem certeza que deseja excluír grupo ${grupo.descricao}?`)) {
       await api.delete(`grupos/${grupo.id}`, config)
       alert(`Registro de ${grupo.descricao} excluido com sucesso!`)
       listaGrupos()
    }
  }
  
  useEffect(() => {
    listaGrupos()
  }, [])

  return (
    <div>
      <div className="flex flex-row justify-between mb-2">
        <h1 className="text-2xl font-bold">Grupos</h1>
        <Button variant="outline" onClick={ () => handleOpenModal('add', {} as IGrupo) }>+ Novo</Button>
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
            {grupos.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="flex-1">{item.descricao}</TableCell>
                <TableCell className="w-14">
                  <Link to='#' onClick={() => handleOpenModal('edit', item)}>
                    Alterar
                  </Link>
                </TableCell>
                <TableCell className="w-14"><Link to='#' onClick={()=>excluiGrupo(item)}>Excluir</Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <ReactModal 
          isOpen={isOpenModal}
          onAfterClose={listaGrupos}
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
          <FrmGrupo isModalOpen={setIsOpenModal} isEditting={isEditting} grupo={grupo} />
        </ReactModal>
      </div>
    </div>
  )
}