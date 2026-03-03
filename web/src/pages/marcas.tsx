import { api } from "@/lib/axios"
import ReactModal from 'react-modal'
import { IMarca } from "@/lib/interface"
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
import FrmMarca from "@/components/forms/frmmarca"

export default function Marcas() {
  const [marcas, setMarcas] = useState<IMarca[]>([])
  const [marca, setMarca] = useState<IMarca>()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isEditting, setIsEditting] = useState(false)

  function handleOpenModal(tipo: string, objMarca: IMarca) {
    if (tipo==='add') {
      setIsOpenModal(true)
      setIsEditting(false)
    } 
    if (tipo==='edit') {
      setIsOpenModal(true)
      setIsEditting(true)
      setMarca(objMarca)
    } 
  }

  async function listaMarcas() {
    const response = await api.get('marcas')
    setMarcas(response.data)
  }

  async function excluIMarca(Marca: IMarca) {
    const config: AxiosRequestConfig = {
      data: Marca,
    };
    if (window.confirm(`Tem certeza que deseja excluír Marca ${Marca.descricao}?`)) {
       await api.delete(`marcas/${Marca.id}`, config)
       alert(`Registro de ${Marca.descricao} excluido com sucesso!`)
       listaMarcas()
    }
  }
  
  useEffect(() => {
    listaMarcas()
  }, [])

  return (
    <div>
      <div className="flex flex-row justify-between mb-2">
        <h1 className="text-2xl font-bold">Marcas</h1>
        <Button variant="outline" onClick={ () => handleOpenModal('add', {} as IMarca) }>+ Nova</Button>
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
            {marcas.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="flex-1">{item.descricao}</TableCell>
                <TableCell className="w-14">
                  <Link to='#' onClick={() => handleOpenModal('edit', item)}>
                    Alterar
                  </Link>
                </TableCell>
                <TableCell className="w-14"><Link to='#' onClick={()=>excluIMarca(item)}>Excluir</Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <ReactModal 
          isOpen={isOpenModal}
          onAfterClose={listaMarcas}
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
          <FrmMarca isModalOpen={setIsOpenModal} isEditting={isEditting} marca={marca} />
        </ReactModal>
      </div>
    </div>
  )
}