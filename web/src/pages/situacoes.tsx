import FrmSituacao from "@/components/forms/frmsituacao";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/axios";
import { ISituacao } from "@/lib/interface";
import { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { Link } from "react-router-dom";

export default function Situacoes() {
  const [situacoes, setSituacoes] = useState<ISituacao[]>([])
  const [situacao, setSituacao] = useState<ISituacao>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditting, setIsEditting] = useState(false)

  function handleOpenModal(tipo: string, objSituacao: ISituacao) {
    if (tipo==='add') {
      setIsModalOpen(true)
      setIsEditting(false)
    } 
    if (tipo==='edit') {
      setIsModalOpen(true)
      setIsEditting(true)
      setSituacao(objSituacao)
    } 
  }

  async function listaSituacoes() {
    const response = await api.get('situacoes')
    setSituacoes(response.data)
  }

  async function excluiGrupo(sit: ISituacao) {
    const config: AxiosRequestConfig = {
      data: sit,
    };
    if (window.confirm(`Tem certeza que deseja excluír grupo ${sit.situacao}?`)) {
       await api.delete(`grupos/${sit.id}`, config)
       alert(`Registro de ${sit.situacao} excluido com sucesso!`)
       listaSituacoes()
    }
  }
  
  useEffect(() => {
    listaSituacoes()
  }, [])


  return (
    <div>
      <div className="flex flex-row justify-between mb-2">
        <h1 className="text-2xl font-bold">Status do Ativo</h1>
        <Button variant="outline" onClick={ () => handleOpenModal('add', {} as ISituacao) }>+ Novo</Button>
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
            {situacoes.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="flex-1">{item.situacao}</TableCell>
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
          isOpen={isModalOpen}
          onAfterClose={listaSituacoes}
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
          <FrmSituacao isModalOpen={setIsModalOpen} isEditting={isEditting} sit={situacao} />
        </ReactModal>
      </div>
    </div>
  )
}