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
import { ILocalidade } from '@/lib/interface';
import { AxiosRequestConfig } from 'axios';

const esquemaLocalidade = z.object({
  descricao: z.string().min(3, 'É necessário informar no mínimo 3 caracteres'),
})
type TLocalidade = z.infer<typeof esquemaLocalidade>
type Props = {  
  isModalOpen: (isOpen:boolean) => void 
  isEditting: boolean
  localidade: ILocalidade | undefined
}

export default function FrmLocalidade({ isModalOpen, isEditting, localidade }: Props) {
  const tituloPagina = isEditting ? 'Alteração no ' : 'Inclusão no '
  const form = useForm<TLocalidade>({
    resolver: zodResolver(esquemaLocalidade),
    defaultValues: {
      descricao: isEditting ? localidade?.descricao : ''
    }
  })

  async function onSubmit(values: TLocalidade) {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    if (isEditting) {
      await api.put(`localidades/${localidade?.id}`, values, config)
      alert(`Localidade alterada com sucesso!`)
      isModalOpen(false)
      
    } else {
      await api.post('localidades', values, config)
      alert(`Nova Localidade incluída com sucesso!`)
      isModalOpen(false)
    }
  }
  
  return (
    <div className='flex flex-col h-full items-start'>
      <h1 className='flex w-full h-10 font-bold text-lg justify-center items-center mb-4 bg-gray-200'>{tituloPagina} Cadastro de Localidades</h1>
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