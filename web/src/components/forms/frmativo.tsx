import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '../ui/label';
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { api } from '@/lib/axios';
import { IAtivo, ICentroCusto, ILocalidade, IMarca, ISituacao } from '@/lib/interface';
import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { formatDateForDB } from '@/utils/functions';

interface ISubGrupo {
  id: number;
  grupo: string;
  descricao: string;
}

const esquemaAtivo = z.object({
  codlocalidade: z.string()
  .refine((val) => val !== '0', {
    message: 'Selecione uma localidade válida'
  }),
  codigo: z.string().min(1, 'Favor informar no mínimo 1 caracter'),
  status: z.string().min(3, 'Favor informar o Status'),
  descricao: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  aquisicao: z.string().optional(),
  valor_aquisicao: z.string(),
  responsavel: z.string().optional(),
  valor_atual: z.string(),
  depreciacao: z.string(),
  codsubgrupo: z.string()
  .refine((val) => val !== "0",
  { 
    message: 'Favor informar o Sub-Grupo' 
  }),
  codcentrocusto: z.string()
  .refine((val) => val !== "0", { 
    message: 'Favor informar o Centro de Custo' 
  }),
  codmarca: z.string()
  .refine((val) => val !== '0', { 
    message: 'Favor informar a Marca' 
  }),
  encontrado: z.boolean(),
  motivo_baixa: z.string().optional()
})
type TAtivo = z.infer<typeof esquemaAtivo>
type Props = {  
  isModalOpen: (isOpen:boolean) => void 
  isEditting: boolean
  ativo: IAtivo | undefined
  listAtivos: (codlocal: number) => void
}

export default function FrmAtivo({ isModalOpen, isEditting, ativo, listAtivos }: Props) {
  const [statusEncontrado, setStatusEncontrado] = useState("Não")
  const [localidades, setLocalidades] = useState<ILocalidade[]>([])
  const [situacoes, setSituacoes] = useState<ISituacao[]>([])
  const [subGrupos, setSubGrupos] = useState<ISubGrupo[]>([])
  const [centroCusto, setCentroCusto] = useState<ICentroCusto[]>([])
  const [marcas, setMarcas] = useState<IMarca[]>([])
  const [open, setOpen] = useState(false)
  const [dataAquisicao, setDataAquisicao] = useState<Date | undefined>(
    ativo?.aquisicao ? new Date(ativo.aquisicao.replace(" ", "T")) : undefined
  )
  const tituloPagina = isEditting ? 'Alteração no ' : 'Inclusão no '
  const form = useForm<TAtivo>({
    resolver: zodResolver(esquemaAtivo),
    defaultValues: {
      codlocalidade: isEditting ? String(ativo?.codlocalidade) : "0",
      codigo: isEditting ? ativo?.codigo : "", 
      status: isEditting ? ativo?.status : "", 
      motivo_baixa: isEditting ? ativo?.motivo_baixa : "",
      descricao: isEditting ? ativo?.descricao : "", 
      valor_aquisicao: isEditting ? String(ativo?.valor_aquisicao) : "0", 
      valor_atual: isEditting ? String(ativo?.valor_atual) : "0", 
      depreciacao: isEditting ? String(ativo?.depreciacao) : "0",
      codsubgrupo: isEditting ? String(ativo?.codsubgrupo) : "0",
      codcentrocusto: isEditting ? String(ativo?.codcentrocusto) : "0",
      codmarca: isEditting ? String(ativo?.codmarca) : "0",
      encontrado: isEditting ? ativo?.encontrado : false,
      responsavel: isEditting ? String(ativo?.responsavel) : "",
    }
  })

  async function listaLocalidades() {
    const response = await api.get('localidades')
    if (response.data) {
      setLocalidades(response.data)
    }
  }

  async function listaSituacoes() {
    const response = await api.get('situacoes')
    if (response.data) {
      setSituacoes(response.data)
    }
  }

  async function listaSubGrupos() {
    const response = await api.get('subgrupos')
    if (response.data) {
      setSubGrupos(response.data)
    }
  }

  async function listaCentroCustos() {
    const response = await api.get('centrocusto')
    if (response.data) {
      setCentroCusto(response.data)
    }
  }

  async function listaMarcas() {
    const response = await api.get('marcas')
    if (response.data) {
      setMarcas(response.data)
    }
  }

  async function onSubmit(values: TAtivo) {
    const dataFormatada = formatDateForDB(new Date(String(dataAquisicao)))
    const dados = {
      codigo: values.codigo,
      status: values.status,
      motivo_baixa: values.motivo_baixa,
      descricao: values.descricao,
      aquisicao: dataFormatada,
      valor_aquisicao: Number(values.valor_aquisicao),
      valor_atual: Number(values.valor_atual),
      depreciacao: Number(values.depreciacao),
      codsubgrupo: Number(values.codsubgrupo),
      codcentrocusto: Number(values.codcentrocusto),
      codmarca: Number(values.codmarca),
      codlocalidade: Number(values.codlocalidade),
      encontrado: values.encontrado,
      responsavel: values.responsavel ? values.responsavel : ""
    }
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    if (isEditting) {
      await api.put(`ativos`, {
        ...dados,
        id: ativo?.id
      }, config)
      alert(`Ativo alterado com sucesso!`)
      isModalOpen(false)
      listAtivos(Number(ativo?.codlocalidade))
    } else {
      await api.post('ativos', dados, config)
      alert(`Novo Ativo incluído com sucesso!`)
      isModalOpen(false)
      listAtivos(Number(ativo?.codlocalidade))
    }
  }
  
  useEffect(() => {
    listaLocalidades()
    listaSituacoes()
    listaSubGrupos()
    listaCentroCustos()
    listaMarcas()
  }, [])

  return (
    <div className='flex flex-col w-full h-full items-start'>
      <h1 className='flex w-full h-10 font-bold text-lg justify-center items-center mb-4 bg-gray-200'>{tituloPagina} Cadastro de Ativos</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-between w-full h-full">
          
          <div className='flex md:flex-row flex-col gap-4 w-full'>
            <FormField
              control={form.control}
              name="codlocalidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localidade:</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value)}
                      defaultValue={String(field.value)}
                    >
                      <SelectTrigger className="md:w-96 w-full">
                        <SelectValue placeholder="Selecione a localidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          localidades.map(item => (
                            <SelectItem key={item.id} value={String(item.id)}>{item.descricao}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codigo:</FormLabel>
                  <FormControl>
                    <Input placeholder="999999" className='md:w-96 w-full' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex md:flex-row flex-col gap-4 w-full'>
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descricao:</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição" className='md:w-96 w-full' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status:</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value)}
                      defaultValue={String(field.value)}
                    >
                      <SelectTrigger className="md:w-96 w-full">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          situacoes.map(item => (
                            <SelectItem key={item.id} value={item.situacao}>{item.situacao}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex md:flex-row flex-col gap-4 w-full'>
            <FormField
              control={form.control}
              name="motivo_baixa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo da baixa:</FormLabel>
                  <FormControl>
                    <Input placeholder="Motivo da baixa" className='md:w-96 w-full' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-col gap-2 p-1'>
              <label htmlFor="date" className='text-sm font-semibold'>Aquisição:</label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-96 justify-between font-normal text-gray-500"
                  >
                    {dataAquisicao ? dataAquisicao.toLocaleDateString() : "Informe a data"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataAquisicao}
                    captionLayout="dropdown"
                    onSelect={(dataAquisicao) => {
                      setDataAquisicao(dataAquisicao)
                      setOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className='flex md:flex-row flex-col gap-4 w-full'>
            <FormField
              control={form.control}
              name="codsubgrupo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-Grupo:</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value)}
                      defaultValue={String(field.value)}
                    >
                      <SelectTrigger className="md:w-96 w-full">
                        <SelectValue placeholder="Selecione o Subgrupo" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          subGrupos.map(item => (
                            <SelectItem key={item.id} value={String(item.id)}>{item.grupo} - {item.descricao}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="codcentrocusto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Centro de Custo:</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value)}
                      defaultValue={String(field.value)}
                    >
                      <SelectTrigger className="md:w-96 w-full">
                        <SelectValue placeholder="Selecione o Centro de Custo" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          centroCusto.map(item => (
                            <SelectItem key={item.id} value={String(item.id)}>{item.descricao}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex md:flex-row flex-col gap-4 w-full'>
            <FormField
              control={form.control}
              name="codmarca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca:</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value)}
                      defaultValue={String(field.value)}
                    >
                      <SelectTrigger className="md:w-96 w-full">
                        <SelectValue placeholder="Selecione a Marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          marcas.map(item => (
                            <SelectItem key={item.id} value={String(item.id)}>{item.descricao}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              name="encontrado"
              control={form.control}
              render={({ field }) => (
                <div className='flex flex-col gap-4 w-full pt-2'>
                  <Label htmlFor="encontrado">
                    Encontrado? 
                  </Label>
                  <div className='flex flex-row gap-2'>
                    <Switch
                      id="encontrado"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onClick={() => setStatusEncontrado(statusEncontrado==='Não' ? "Sim" : "Não")}
                    />
                    <span>{statusEncontrado}</span>
                  </div>
                </div>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável pela utilização do ativo:</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value)}
                      defaultValue={String(field.value)}
                    >
                      <SelectTrigger className="md:w-96 w-full">
                        <SelectValue placeholder="Selecione o responsável" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Osmair'>Osmair</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-row gap-4'>
            <Button type="submit">Salvar</Button>
            <Button className='bg-red-500' onClick={() => isModalOpen(false)}>Fechar</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}