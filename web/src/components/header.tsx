import logosis from '@/assets/logosistema.png'
import logocdl from '@/assets/logotipo.png'
import { useAuth } from '@/context/AuthContext'

export default function Header() {
  const user = useAuth()

  return (
    <div className="flex flex-row w-full h-32 p-4 justify-start items-center">
      <div className='flex flex-row justify-start items-center w-60 gap-4'>
        <img src={logocdl} className='w-32 lg:w-20' />
        <img src={logosis} className='w-16 lg:w-12' />
      </div>
      <span className="text-3xl text-gray-700 font-bold text-center">
        CONTROLE PATRIMONIAL
      </span>
    </div>
  )
}

