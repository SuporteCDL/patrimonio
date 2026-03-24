import { IAtivo, IConferencia, ILocalidade } from "@/lib/interface"
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { useEffect, useState } from "react"
import { formatDateForDBShort, parseDateOnly } from "@/utils/functions"
import { AxiosRequestConfig } from "axios"
import { api } from "@/lib/axios"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface Props {
  setIsModalOpen: (isOpen:boolean) => void
  isEditting: boolean
  conferencia: IConferencia
  lista: () => void
}

const schemaConferencia = z.object({
  descricao: z.string().min(5, 'Favor informar no mínimo 5 caracteres'),
  data_inicio: z.string(),
  data_fim: z.string(),
  responsavel: z.string().optional(),
  codlocalidade: z.string().optional(),
  status: z.string().optional(),
})

type TConferencia = z.infer<typeof schemaConferencia>

export default function FrmConferencia({setIsModalOpen, isEditting, conferencia, lista}: Props) {
  const tituloPagina = isEditting ? 'Alterar Conferência de Ativos' : 'Cadastrar Nova Conferência de Ativos'
  const [localidades, setLocalidades] = useState<ILocalidade[]>([])
  const [openDataInicio, setOpenDataInicio] = useState(false)
  const [openDataFim, setOpenDataFim] = useState(false)
  const [dataInicio, setDataInicio] = useState<Date | undefined>(
    conferencia?.data_inicio ? new Date(String(conferencia?.data_inicio).replace(" ", "T")) : new Date('')
  )
  const [dataFim, setDataFim] = useState<Date | undefined>(
    conferencia?.data_fim ? new Date(String(conferencia?.data_fim).replace(" ", "T")) :  new Date('')
  )
  const form = useForm<TConferencia>({
    resolver: zodResolver(schemaConferencia),
    defaultValues: {
      descricao: isEditting ? String(conferencia.descricao) : '',
      data_inicio: isEditting ? conferencia.data_inicio.toString() : '',
      data_fim: isEditting ? conferencia.data_fim.toString() : '',
      responsavel: isEditting ? String(conferencia.responsavel) : '',
      codlocalidade: isEditting ? '1' : '1',
      status: isEditting ? String(conferencia.status) : '',
    }
  })

  async function listLocalidades() {
    const { data } = await api.get('localidades')
    if (data) {
      setLocalidades(data)
    }
  }

  async function listAtivos(codlocal: string) {
    const { data } = await api.get(`ativos?codlocalidade=${codlocal}`)
    return data
  }

  async function handleSubmit(values: TConferencia) {
    const ativos:IAtivo[] = await listAtivos(String(values.codlocalidade))
    const dataInicioFormatada = formatDateForDBShort(new Date(String(dataInicio)))
    const dataFimFormatada = formatDateForDBShort(new Date(String(dataFim)))
    const dados = {
      descricao: values.descricao,
      data_inicio: dataInicioFormatada,
      data_fim: dataFimFormatada,
      responsavel: values.responsavel,
      status: values.status
    }
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    if (isEditting) {
      await api.put(`conferencia`, {
        id: conferencia?.id,
        descricao: dados.descricao,
        data_inicio: dados.data_inicio,
        data_fim: dados.data_fim,
        responsavel: dados.responsavel,
        status: dados.status
      }, config)
      alert(`Conferencia alterada com sucesso!`)
      setIsModalOpen(false)
      lista()
    } else {
      const response = await api.post('conferencia', dados, config)
      const novaConferencia:IConferencia = response.data
      alert(`Nova Conferência incluída com sucesso!`)

      //loop para inclusão de itens
      await Promise.all(
        ativos.map(item => {
          return api.post('conferenciaitem', {
            conferencia_id: novaConferencia.id,
            patrimonio_id: item.id,
            encontrado: false,
            observacao: '',
            data_verificacao: new Date().toISOString().split('T')[0]
          }, config)
        })
      )
      alert(`Ativos para Conferência incluídos com sucesso!`)
      setIsModalOpen(false)
      lista()
    }
  }

  useEffect(() => {
    listLocalidades()
  },[])

  return (
    <div className='flex flex-col w-full h-full items-start'>
      <h1 className='flex w-full h-10 font-bold text-lg justify-center items-center mb-4 bg-gray-200'>{tituloPagina} Cadastro de Ativos</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col justify-between w-full h-full">
          <div className='flex md:flex-row flex-col gap-4 w-full'>
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição:</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição" className='md:w-[500px] w-full' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                      <SelectTrigger className="md:w-[500px] w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        { localidades.map(item => (
                          <SelectItem key={item.id} value={String(item.id)}>{item.descricao}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
            
          <div className="flex flex-row ">
            <div className='flex flex-col gap-2 p-1'>
              <label htmlFor="date" className='text-sm font-semibold'>Data Inicial:</label>
              <Popover open={openDataInicio} onOpenChange={setOpenDataInicio}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-60 justify-between font-normal text-gray-500"
                  >
                    {dataInicio ? dataInicio.toLocaleDateString() : "Informe a data"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataInicio}
                    captionLayout="dropdown"
                    onSelect={(dataInicio) => {
                      setDataInicio(dataInicio)
                      setOpenDataInicio(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className='flex flex-col gap-2 p-1'>
              <label htmlFor="date" className='text-sm font-semibold'>Data Final:</label>
              <Popover open={openDataFim} onOpenChange={setOpenDataFim}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-60 justify-between font-normal text-gray-500"
                  >
                    {dataFim ? dataFim.toLocaleDateString() : "Informe a data"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataFim}
                    captionLayout="dropdown"
                    onSelect={(dataFim) => {
                      setDataFim(dataFim)
                      setOpenDataFim(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className='flex md:flex-row flex-col gap-4 w-full'>
            <FormField
              control={form.control}
              name="responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável:</FormLabel>
                  <FormControl>
                    <Input placeholder="Responsável" className='md:w-[500px] w-full' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex md:flex-row flex-col gap-4 w-full'>
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
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Aberta'>Conferencia em aberto</SelectItem>
                        <SelectItem value='Fechada'>Conferencia encerrada</SelectItem>
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
            <Button className='bg-red-500' onClick={() => setIsModalOpen(false)}>Fechar</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}