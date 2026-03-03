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
import { ISituacao } from '@/lib/interface';
import { AxiosRequestConfig } from 'axios';

const esquemaSituacao = z.object({
  situacao: z.string().min(3, 'É necessário informar no mínimo 3 caracteres'),
})
type TSituacao = z.infer<typeof esquemaSituacao>
type Props = {  
  isModalOpen: (isOpen:boolean) => void 
  isEditting: boolean
  sit: ISituacao | undefined
}

export default function FrmSituacao({ isModalOpen, isEditting, sit }: Props) {
  const tituloPagina = isEditting ? 'Alteração no ' : 'Inclusão no '
  const form = useForm<TSituacao>({
    resolver: zodResolver(esquemaSituacao),
    defaultValues: {
      situacao: isEditting ? sit?.situacao : ''
    }
  })

  async function onSubmit(values: TSituacao) {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    if (isEditting) {
      await api.put(`situacoes`, values, config)
      alert(`Situação alterado com sucesso!`)
      isModalOpen(false)
      
    } else {
      await api.post('situacoes', values, config)
      alert(`Nova Situação incluída com sucesso!`)
      isModalOpen(false)
    }
  }
  
  return (
    <div className='flex flex-col h-full items-start'>
      <h1 className='flex w-full h-10 font-bold text-lg justify-center items-center mb-4 bg-gray-200'>{tituloPagina} Cadastro de Status do Ativo</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-between w-full h-full space-y-8 flex-1">
          <FormField
            control={form.control}
            name="situacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Situação</FormLabel>
                <FormControl>
                  <Input placeholder="Situação" {...field} />
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