import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, 
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue, } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from '@/components/ui/switch'
import { api } from "@/lib/axios";
import { ILocalidade } from "@/lib/interface";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type TAtivosConferencia = {
  id: number
  localidade: string
  centrocusto: string
  subgrupo: string
  codigo: string
  ativo: string
  status: string
  marca: string
  encontrado: boolean
}

export default function RelConferir() {
  const [msg, setMsg] = useState("")
  let cont = 0
  const [listLocalidades, setListLocalidades] = useState<ILocalidade[]>([])
  const [listAtivosConferencia, setListAtivosConferencia] = useState<TAtivosConferencia[]>([])
  const [encontrado, setEncontrado] = useState(false)
  const [localidade, setLocalidade] = useState("");
  const [ordem, setOrdem] = useState('0')

  async function listaLocalidades() {
    const response = await api.get('localidades')
    if (response.data) {
      setListLocalidades(response.data)
    }
  }

  async function buscarAtivo() {
    event?.preventDefault()
    const response = await api.get(`ativos/ativosconferencia?encontrado=${encontrado}&codlocalidade=${localidade}&ordem=${ordem}`)
    if (response.data[0]) {
      setListAtivosConferencia(response.data)
      setMsg("")
    } else {
      setMsg(`Não encontrado`)
    }
  }
  
  useEffect(() => {
    listaLocalidades()
  },[])

  return (
    <div className="w-full h-full overflow-auto">
      <h1 className="text-2xl lg:text-lg font-bold text-left mb-4">Conferência de Ativos</h1>

      <form name="frm" onSubmit={buscarAtivo} className="flex flex-row gap-4 justify-start items-center">
        <div className="flex flex-row items-center w-64 gap-3">
          <Label htmlFor="codigo" className="text-xl lg:text-lg">Local:</Label>
          <Select value={localidade} onValueChange={setLocalidade}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  listLocalidades.map(item => (
                    <SelectItem key={item.id} value={String(item.id)}>{item.descricao}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-row items-center w-64 gap-3">
          <Label htmlFor="codigo" className="text-xl lg:text-lg">Ordem:</Label>
          <Select value={ordem} onValueChange={setOrdem}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='1'>Centro de Custo / Código do Ativo</SelectItem>
                <SelectItem value='2'>Código do Ativo</SelectItem>
                <SelectItem value='3'>Sub-grupo / Marca</SelectItem>
                <SelectItem value='0'>Nome do Ativo / Código do Ativo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-row items-center w-64 gap-3">      
        <label className="font-semibold">ENCONTRADO?</label>
        <Switch 
          id="encontrado" 
          checked={encontrado}
          onCheckedChange={(value) => setEncontrado(value)}
        />
        <Label htmlFor="encontrado">{encontrado ? "Sim" : "Não"}</Label>
        </div>
        
        <Button 
          className="w-40 h-10 text-2xl lg:h-10 lg:text-lg"
          variant="default" 
          type="submit">
          Listar
        </Button>
      </form>
        {msg !== "" && <span className="w-full text-red-600">{msg}</span>}

      <div id="print-area" className="mt-4 w-[450px] lg:w-full">
        <div className="flex flex-row justify-between items-center py-4">
          <h2 className="font-semibold text-xl lg:text-lg">Lista de Ativos</h2>
          <Button variant="default" onClick={() => window.print()}>
            Imprimir
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300 print:hidden">Localidade</TableHead>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300">Centro de Custo</TableHead>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300 print:hidden">Sub-Grupo</TableHead>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300">Codigo</TableHead>
              <TableHead className="flex-1 bg-gray-100 border-b-2 border-gray-300">Descrição</TableHead>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300">Marca</TableHead>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300 print:hidden">Encontrado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listAtivosConferencia.map((item, index) => {
              cont = index
              return (
              <TableRow key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-200'}>
                <TableCell className="w-28 print:hidden">{item.localidade}</TableCell>
                <TableCell className="w-44">{item.centrocusto}</TableCell>
                <TableCell className="w-48 print:hidden">{item.subgrupo}</TableCell>
                <TableCell className="w-10">{item.codigo}</TableCell>
                <TableCell className="flex-1">{item.ativo}</TableCell>
                <TableCell className="w-10">{item.marca}</TableCell>
                <TableCell className="w-10 text-center print:hidden">{item.encontrado ? 'Sim' : 'Não'}</TableCell>
              </TableRow>
            )})}
          </TableBody>
          <TableRow>
            <TableCell colSpan={7}>
              Total de registros: {cont > 0 ? cont + 1 : cont}
            </TableCell>
          </TableRow>
        </Table>

      </div>
    </div>
  )
}
