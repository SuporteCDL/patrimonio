import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, 
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue, } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from '@/components/ui/switch'
import { ZeroLeft } from "@/utils/functions";
import { api } from "@/lib/axios";
import { ICentroCusto, ILocalidade, IMarca, ISubGrupo } from "@/lib/interface";

type TSearch = {
  codigo: string;
}
type TAtivo = {
  id: number
  codlocalidade: number
  codigo: string
  status: string
  motivo_baixa: string
  descricao: string
  aquisicao: string
  valor_aquisicao: number
  valor_atual: number
  depreciacao: number
  codsubgrupo: number
  codcentrocusto: number
  codmarca: number
  encontrado: boolean
  localidade: string
  centrocusto: string
  grupo: string
  subgrupo: string
  marca: string
  responsavel: string
}

export default function ConferirAtivos() {
  const [msg, setMsg] = useState("")
  const [listLocalidades, setListLocalidades] = useState<ILocalidade[]>([])
  const [listCentroCustos, setListCentroCustos] = useState<ICentroCusto[]>([])
  const [listSubGrupos, setListSubGrupos] = useState<ISubGrupo[]>([])
  const [listMarcas, setListMarcas] = useState<IMarca[]>([])
  const [localidade, setLocalidade] = useState("");
  const [centroCusto, setCentroCusto] = useState("");
  const [status, setStatus] = useState("");
  const [subGrupo, setSubGrupo] = useState("");
  const [marca, setMarca] = useState("");
  const [encontrado, setEncontrado] = useState(false)
  const [motivoBaixa, setMotivoBaixa] = useState("")
  const [ativo, setAtivo] = useState<TAtivo>({} as TAtivo)
  const { handleSubmit, reset, register, formState:{errors}, setValue } = useForm<TSearch>({
    defaultValues:{
      codigo: ""
    }
  })

  async function buscarCodigo(form: TSearch) {
    const codigo = ZeroLeft(String(form.codigo), 5)
    const response = await api.get(`ativos/buscaativo/${codigo}`)
    if (response.data[0]) {
      setMsg("")
      setAtivo(response.data[0])
      setEncontrado(Boolean(response.data[0]?.encontrado))
      setLocalidade(String(response.data[0]?.codlocalidade))
      setCentroCusto(String(response.data[0]?.codcentrocusto))
      setStatus(String(response.data[0]?.status))
      setSubGrupo(String(response.data[0]?.codsubgrupo))
      setMarca(String(response.data[0]?.codmarca))
      setMotivoBaixa(String(response.data[0]?.motivo_baixa))
    } else {
      setMsg(`Codigo ( ${codigo} ) não encontrado`)
    }
    reset()
  }

  async function atualiza() {
    event?.preventDefault()
    const dadosAtualizacao = {
      id: ativo.id,
      codlocalidade: Number(localidade),
      codigo: ativo.codigo,
      status: status,
      motivo_baixa: String(motivoBaixa),
      descricao: ativo.descricao,
      aquisicao: ativo.aquisicao,
      valor_aquisicao: ativo.valor_aquisicao,
      valor_atual: ativo.valor_atual,
      depreciacao: ativo.depreciacao,
      codsubgrupo: Number(subGrupo),
      codcentrocusto: Number(centroCusto),
      codmarca: Number(marca),
      encontrado: encontrado,
      responsavel: ativo.responsavel ? String(ativo.responsavel) : ''
    }
    // console.log(dadosAtualizacao)
    await api.put('ativos', dadosAtualizacao)
    alert('Ativo atualizado com sucesso!')
  }

  async function listaLocalidades() {
    const response = await api.get('localidades')
    if (response.data) {
      setListLocalidades(response.data)
    }
  }

  async function listaCentroCusto() {
    const response = await api.get('centrocusto')
    if (response.data) {
      setListCentroCustos(response.data)
    }
  }

  async function listaSubGrupo() {
    const response = await api.get('subgrupos')
    if (response.data) {
      setListSubGrupos(response.data)
    }
  }

  async function listaMarca() {
    const response = await api.get('marcas')
    if (response.data) {
      setListMarcas(response.data)
    }
  }
  
  useEffect(() => {
    listaLocalidades()
    listaCentroCusto()
    listaSubGrupo()
    listaMarca()
  },[])

  return (
    <div className="w-full h-full overflow-auto">
      <h1 className="text-2xl lg:text-lg font-bold text-left mb-4">Conferência de Ativos</h1>

     <form name="frmSearch" 
      onSubmit={handleSubmit(buscarCodigo)} 
      className="flex flex-row gap-4 justify-start items-center "
     >
        <Label htmlFor="codigo" className="text-xl lg:text-lg">Código:</Label>
        <Input
          className="w-40 h-10 lg:h-10 text-xl lg:text-lg placeholder:text-xl lg:placeholder:text-lg border-2 border-black lg:border-[1px] rounded-lg lg:rounded-sm"
          placeholder="999999"
          {...register('codigo')}
          autoFocus
          type="number"
          pattern="[0-9]*"
        />
        <Button 
          className="w-40 h-10 text-2xl lg:h-10 lg:text-lg"
          variant="default" 
          type="submit">
          Buscar
        </Button>

      </form>
      {msg !== "" && <span className="w-full text-red-600">{msg}</span>}

      <div className="mt-4 w-[450px] lg:w-1/3">
        <h2 className="font-semibold text-xl lg:text-lg">Dados do produto:</h2>
        <form name="frmAtualizacao" className="flex flex-col w-full h-full p-2 gap-1 scroll-auto">
          
          <div className="flex flex-row gap-2">
            <label className="font-semibold w-20">LOCAL:</label>
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

          <div className="flex flex-row gap-2">
            <label className="font-semibold w-20">CÓDIGO:</label>
            <span >{ativo?.codigo}</span>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <label className="font-semibold w-20">DESCRIÇÃO:</label>
            <input
              name="descricao"
              className="w-full h-8 pl-2 border-[0px] border-gray-300" 
              type="text"
              value={ativo?.descricao}
              onChange={(e) => setAtivo({ ...ativo, descricao: e.target.value })}
            />
          </div>

          <div className="flex flex-row gap-2 items-center">
            <label className="font-semibold w-60">CENTRO DE CUSTO:</label>
            <Select value={centroCusto} onValueChange={setCentroCusto}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    listCentroCustos.map(item => (
                      <SelectItem key={item.id} value={String(item.id)}>{item.descricao}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <label className="font-semibold w-60">SUB-GRUPO:</label>
            <Select value={subGrupo} onValueChange={setSubGrupo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    listSubGrupos.map(item => (
                      <SelectItem key={item.id} value={String(item.id)}>{item.descricao}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <label className="font-semibold w-60">MARCA:</label>
            <Select value={marca} onValueChange={setMarca}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    listMarcas.map(item => (
                      <SelectItem key={item.id} value={String(item.id)}>{item.descricao}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <label className="font-semibold w-60">STATUS:</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Incluido">Incluído</SelectItem>
                  <SelectItem value="Alterado">Alterado</SelectItem>
                  <SelectItem value="Baixado">Baixado</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <label className="font-semibold w-60">Motivo da baixa:</label>
            <Input
              className="w-[180px]"
              placeholder="Motivo da baixa..."
              type="text"
              value={String(motivoBaixa) ? String(motivoBaixa) : ""}
              onChange={(e) => setMotivoBaixa(e.target.value)}
            />
          </div>

          <div className="flex flex-row gap-2 items-center">
            <label className="font-semibold w-60">ENCONTRADO?</label>
            <Switch 
              id="encontrado" 
              checked={encontrado}
              onCheckedChange={(value) => setEncontrado(value)}
            />
            <Label htmlFor="encontrado">{encontrado ? "Sim" : "Não"}</Label>
          </div>

          <div className="flex flex-row gap-2 items-center mt-4">
            <Button onClick={atualiza} className="w-52 h-12 text-xl lg:w-32 lg:h-12">
              Atualizar
            </Button>
          </div>

        </form>
      </div>

    </div>
  )
}