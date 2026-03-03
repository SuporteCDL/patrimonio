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
import { Input } from "@/components/ui/input"
import { api } from '@/lib/axios';
import { IGrupo } from '@/lib/interface';
import { AxiosRequestConfig } from 'axios';

const esquemaGrupo = z.object({
  descricao: z.string().min(3, 'É necessário informar no mínimo 3 caracteres'),
})
type TGrupo = z.infer<typeof esquemaGrupo>
type Props = {  
  isModalOpen: (isOpen:boolean) => void 
  isEditting: boolean
  grupo: IGrupo | undefined
}

export default function FrmGrupo({ isModalOpen, isEditting, grupo }: Props) {
  const tituloPagina = isEditting ? 'Alteração no ' : 'Inclusão no '
  const form = useForm<TGrupo>({
    resolver: zodResolver(esquemaGrupo),
    defaultValues: {
      descricao: isEditting ? grupo?.descricao : ''
    }
  })

  async function onSubmit(values: TGrupo) {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    if (isEditting) {
      await api.put(`grupos/${grupo?.id}`, values, config)
      alert(`Grupo alterado com sucesso!`)
      isModalOpen(false)
      
    } else {
      await api.post('grupos', values, config)
      alert(`Novo Grupo incluído com sucesso!`)
      isModalOpen(false)
    }
  }
  
  return (
    <div className='flex flex-col h-full items-start'>
      <h1 className='flex w-full h-10 font-bold text-lg justify-center items-center mb-4 bg-gray-200'>{tituloPagina} Cadastro de Grupos</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-between w-full h-full space-y-8 flex-1">
          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descricao</FormLabel>
                <FormControl>
                  <Input placeholder="Descrição" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex flex-row gap-4'>
            <Button type="submit">Salvar</Button>
            <Button className='bg-red-500' onClick={() => isModalOpen(false)}>Fechar</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}