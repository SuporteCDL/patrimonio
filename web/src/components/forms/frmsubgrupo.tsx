import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Input } from "@/components/ui/input"
import { api } from '@/lib/axios';
import { IGrupo, ISubGrupo } from '@/lib/interface';
import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';

const esquemaSubGrupo = z.object({
  codgrupo: z.string().min(1, 'Selecione um grupo válido'),
  descricao: z.string().min(3, 'É necessário informar no mínimo 3 caracteres'),
})
type TSubGrupo = z.infer<typeof esquemaSubGrupo>
type Props = {  
  isModalOpen: (isOpen:boolean) => void 
  isEditting: boolean
  subGrupo: ISubGrupo | undefined
}

export default function FrmSubGrupo({ isModalOpen, isEditting, subGrupo }: Props) {
  const [grupos, setGrupos] = useState<IGrupo[]>([])
  const tituloPagina = isEditting ? 'Alteração no ' : 'Inclusão no '
  const form = useForm<TSubGrupo>({
    resolver: zodResolver(esquemaSubGrupo),
    defaultValues: {
      codgrupo: isEditting ? String(subGrupo?.codgrupo) : "",
      descricao: isEditting ? subGrupo?.descricao ?? "" : "",
    },
  })

  async function listaGrupos() {
    const response = await api.get('grupos')
    if (response.data) {
      setGrupos(response.data)
    }
  }

  async function onSubmit(values: TSubGrupo) {
    const dados = {
      codgrupo: Number(values.codgrupo),
      descricao: values.descricao
    }
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    if (isEditting) {
      await api.put(`subgrupos/${subGrupo?.id}`, dados, config)
      alert(`Sub-Grupo alterado com sucesso!`)
      isModalOpen(false)
      
    } else {
      console.log(dados)
      await api.post('subgrupos', dados, config)
      alert(`Novo Sub-Grupo incluído com sucesso!`)
      isModalOpen(false)
    }
  }
  
  useEffect(() => {
    listaGrupos()
  },[])

  return (
    <div className='flex flex-col h-full items-start'>
      <h1 className='flex w-full h-10 font-bold text-lg justify-center items-center mb-4 bg-gray-200'>{tituloPagina} Cadastro de Sub-Grupos</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-between w-full h-full flex-1">
          <div className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name="codgrupo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grupo:</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value)}
                      defaultValue={String(field.value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          grupos.map(item => (
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
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descricao:</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição" {...field} />
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