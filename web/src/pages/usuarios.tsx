import { api } from "@/lib/axios"
import ReactModal from 'react-modal'
import { IUsuario } from "@/lib/interface"
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
import FrmUsuario from "@/components/forms/frmusuario"

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([])
  const [usuario, setUsuario] = useState<IUsuario>()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isEditting, setIsEditting] = useState(false)

  function handleOpenModal(tipo: string, objUsuario: IUsuario) {
    if (tipo==='add') {
      setIsOpenModal(true)
      setIsEditting(false)
    } 
    if (tipo==='edit') {
      setIsOpenModal(true)
      setIsEditting(true)
      setUsuario(objUsuario)
    } 
  }

  async function listaUsuarios() {
    const response = await api.get('usuarios')
    setUsuarios(response.data)
  }

  async function excluIUsuario(usuario: IUsuario) {
    const config: AxiosRequestConfig = {
      data: usuario,
    };
    if (window.confirm(`Tem certeza que deseja excluír o usuario ${usuario.nome}?`)) {
       await api.delete(`usuarios/${usuario.id}`, config)
       alert(`Registro de ${usuario.nome} excluido com sucesso!`)
       listaUsuarios()
    }
  }
  
  useEffect(() => {
    listaUsuarios()
  }, [])

  return (
    <div>
      <div className="flex flex-row justify-between mb-2">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <Button variant="outline" onClick={ () => handleOpenModal('add', {} as IUsuario) }>+ Novo</Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300">Nome</TableHead>
              <TableHead className="flex-1 bg-gray-100 border-b-2 border-gray-300">E-Mail</TableHead>
              <TableHead className="text-center w-32 bg-gray-100 border-b-2 border-gray-300" colSpan={2}>Opções</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nome}</TableCell>
                <TableCell className="flex-1">{item.email}</TableCell>
                <TableCell className="w-14">
                  <Link to='#' onClick={() => handleOpenModal('edit', item)}>
                    Alterar
                  </Link>
                </TableCell>
                <TableCell className="w-14"><Link to='#' onClick={()=>excluIUsuario(item)}>Excluir</Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <ReactModal 
          isOpen={isOpenModal}
          onAfterClose={listaUsuarios}
          style={{
            overlay: {
              position: 'fixed',
              backgroundColor: 'rgba(255, 255, 255, 0.75)'
            },
            content: {
              position: 'absolute',
              top: '20%',
              left: '35%',
              right: '40%',
              bottom: '40%',
              border: '1px solid #ccc',
              background: '#fff',
              overflow: 'auto',
              width: 500,
              height: 400,
              WebkitOverflowScrolling: 'touch',
              borderRadius: '4px',
              outline: 'none',
              padding: '8px'
            }  
          }}
        >
          <FrmUsuario isModalOpen={setIsOpenModal} isEditting={isEditting} usuario={usuario} />
        </ReactModal>
      </div>
    </div>
  )
}