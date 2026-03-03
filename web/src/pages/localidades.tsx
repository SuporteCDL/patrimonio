import { api } from "@/lib/axios"
import ReactModal from 'react-modal'
import { ILocalidade } from "@/lib/interface"
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
import FrmLocalidade from "@/components/forms/frmlocalidade"

export default function Localidades() {
  const [localidades, setLocalidades] = useState<ILocalidade[]>([])
  const [localidade, setLocalidade] = useState<ILocalidade>()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isEditting, setIsEditting] = useState(false)

  function handleOpenModal(tipo: string, objLocalidade: ILocalidade) {
    if (tipo==='add') {
      setIsOpenModal(true)
      setIsEditting(false)
    } 
    if (tipo==='edit') {
      setIsOpenModal(true)
      setIsEditting(true)
      setLocalidade(objLocalidade)
    } 
  }

  async function listaLocalidades() {
    const response = await api.get('localidades')
    setLocalidades(response.data)
  }

  async function excluiLocalidade(localidade: ILocalidade) {
    const config: AxiosRequestConfig = {
      data: localidade,
    };
    if (window.confirm(`Tem certeza que deseja excluír localidade ${localidade.descricao}?`)) {
       await api.delete(`localidades/${localidade.id}`, config)
       alert(`Registro de ${localidade.descricao} excluido com sucesso!`)
       listaLocalidades()
    }
  }
  
  useEffect(() => {
    listaLocalidades()
  }, [])

  return (
    <div>
      <div className="flex flex-row justify-between mb-2">
        <h1 className="text-2xl font-bold">Localidades</h1>
        <Button variant="outline" onClick={ () => handleOpenModal('add', {} as ILocalidade) }>+ Novo</Button>
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
            {localidades.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="flex-1">{item.descricao}</TableCell>
                <TableCell className="w-14">
                  <Link to='#' onClick={() => handleOpenModal('edit', item)}>
                    Alterar
                  </Link>
                </TableCell>
                <TableCell className="w-14"><Link to='#' onClick={()=>excluiLocalidade(item)}>Excluir</Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <ReactModal 
          isOpen={isOpenModal}
          onAfterClose={listaLocalidades}
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
          <FrmLocalidade isModalOpen={setIsOpenModal} isEditting={isEditting} localidade={localidade} />
        </ReactModal>
      </div>
    </div>
  )
}