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
import { IUsuario } from '@/lib/interface';
import { AxiosRequestConfig } from 'axios';

const esquemaUsuario = z.object({
  nome: z.string().min(3, 'É necessário informar no mínimo 3 caracteres'),
  email: z.string().min(3, 'É necessário informar no mínimo 3 caracteres'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})
type TUsuario = z.infer<typeof esquemaUsuario>
type Props = {  
  isModalOpen: (isOpen:boolean) => void 
  isEditting: boolean
  usuario: IUsuario | undefined
}

export default function FrmUsuario({ isModalOpen, isEditting, usuario }: Props) {
  const tituloPagina = isEditting ? 'Alteração no ' : 'Inclusão no '
  const form = useForm<TUsuario>({
    resolver: zodResolver(esquemaUsuario),
    defaultValues: {
      nome: isEditting ? usuario?.nome : '',
      email: isEditting ? usuario?.email : '',
    }
  })
  
  async function onSubmit(values: TUsuario) {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    if (isEditting) {
      console.log(values)
      await api.put(`usuarios/${usuario?.id}`, values, config)
      alert(`Usuário alterado com sucesso!`)
      isModalOpen(false)
      
    } else {
      await api.post('usuarios', values, config)
      alert(`Novo Usuário incluído com sucesso!`)
      isModalOpen(false)
    }
  }
  
  return (
    <div className='flex flex-col h-full items-start'>
      <h1 className='flex w-full h-10 font-bold text-lg justify-center items-center mb-4 bg-gray-200'>{tituloPagina} Cadastro de Usuários</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-between w-full h-full flex-1">
          <div className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome:</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do usuário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail:</FormLabel>
                  <FormControl>
                    <Input placeholder="E-mail do usuário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha:</FormLabel>
                  <FormControl>
                    <Input placeholder="*****" type='password' {...field} />
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