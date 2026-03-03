import { ILocalidade } from "@/lib/interface";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, 
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue, } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type TAtivosPorCCQtd = {
  centrocusto: string;
  quantidade: number;
}

export default function AtivosPorCentroCustoQtd() {
  let cont = 0
  const [listLocalidades, setListLocalidades] = useState<ILocalidade[]>([])
  const [localidade, setLocalidade] = useState("");
  const [listAtivosPorCCQtd, setListAtivosPorCCQtd] = useState<TAtivosPorCCQtd[]>([])

  async function listaLocalidades() {
    const response = await api.get('localidades')
    if (response.data) {
      setListLocalidades(response.data)
    }
  }

  async function buscaAtivosPorCCQtd() {
    event?.preventDefault()
    const response = await api.get(`ativos/ativoscentrocustoqtd/${localidade}`)
    if (response.data) {
      setListAtivosPorCCQtd(response.data)
    }
  }
  
  useEffect(() => {
    listaLocalidades()
  },[])

return (
    <div className="w-full h-full overflow-auto">
      <h1 className="text-2xl lg:text-lg font-bold text-left mb-4">Ativos por Centro de Custo - Quantitativo</h1>
      
      <form name="frm" onSubmit={buscaAtivosPorCCQtd} className="flex flex-row gap-4 justify-start items-center">
        <div className="flex flex-row items-center w-[350px] gap-3">
          <Label htmlFor="codigo" className="text-xl lg:text-lg">Local:</Label>
          <Select value={localidade} onValueChange={setLocalidade}>
            <SelectTrigger className="w-[350px]">
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
        <Button 
          className="w-40 h-10 text-2xl lg:h-10 lg:text-lg"
          variant="default" 
          type="submit">
          Listar
        </Button>
     </form>

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
              <TableHead className="bg-gray-100 border-b-2 border-gray-300 flex-1">Centro de Custo</TableHead>
              <TableHead className="bg-gray-100 border-b-2 border-gray-300 text-center">Quantidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listAtivosPorCCQtd.map((item, index) => {
              cont = index
              return (
              <TableRow key={item.centrocusto} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-200'}>
                <TableCell className="flex-1">{item.centrocusto}</TableCell>
                <TableCell className="w-44 text-center">{item.quantidade}</TableCell>
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