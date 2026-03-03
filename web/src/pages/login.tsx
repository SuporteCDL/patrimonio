import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form'
import logotipo from '@/assets/logocdl.png'
import logosistema from '@/assets/logosistema.png'
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface ILogin {
  email: string;
  password: string;
}

export function Login() {
  const { login } = useAuth();
  const [erroSenha, setErroSenha] = useState('')
  const { register, handleSubmit, formState:{errors} } = useForm<ILogin>({
    defaultValues: { email: '', password: '' }
  })

  async function handleLogin(formData: ILogin) {
    const {email, password} = formData
    const response = await fetch('http://192.168.2.106:3333/usuarios/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (response.ok) {
      login(data.usuario); 
    } else {
      setErroSenha(data.message)
      alert(data.message);
    }
  }

  return (
    <div className='flex flex-col p-16 mt-32 md:p-8 justify-center lg:w-1/3 mx-auto shadow-lg'>
      <div className="flex flex-row justify-between items-center gap-4 mb-16">
        <img src={logotipo} alt="Controle Patrimonial" className='w-32 h-28 lg:w-16 lg:h-12' />
        <h3 className="font-bold text-cyan-800 text-5xl lg:text-lg text-center">
          CONTROLE PATRIMONIAL
        </h3>
        <img src={logosistema} alt="Controle Patrimonial" className='w-32 h-28 lg:w-16 lg:h-14' />
      </div>

      <form
        className="flex flex-col w-full gap-16 items-center lg:gap-4"
        onSubmit={handleSubmit(handleLogin)}
      >
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="email" className="font-semibold text-4xl lg:text-lg">
            Email:
          </label>
          <input
            {...register('email')}
            className="h-28 w-full border border-gray-400 rounded p-2 text-4xl lg:h-10 lg:text-lg"
            id="email"
            name="email"
            type="email"
            placeholder="Email"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="password" className="font-semibold text-4xl lg:text-lg">
            Senha:
          </label>
          <input
            {...register('password')}
            className="h-28 border border-gray-400 rounded p-2 w-full text-4xl lg:h-10 lg:text-lg"
            id="password"
            name="password"
            type="password"
            placeholder="*****"
          />
          {erroSenha && (
            <span className="text-red-400 italic text-2xl">{erroSenha}</span>
          )}
        </div>

        <div className="flex justify-center items-center gap-2 mt-2 text-sm">
          <Link to="/signup" className="font-semibold hover:text-cyan-600 text-4xl lg:text-lg">
            Não tenho cadastro
          </Link>{" "}
          |{" "}
          <Link to="/forgot" className="font-semibold hover:text-cyan-600 text-4xl lg:text-lg">
            Esqueci a senha
          </Link>
        </div>

        <button
          type="submit"
          className="flex flex-row justify-center items-center gap-3 mt-6 p-3 rounded text-white w-full h-32 bg-cyan-600 hover:bg-cyan-500 text-5xl lg:w-52 lg:h-12 lg:text-lg"
        >
          <FiLogIn  />
          Entrar
        </button>
      </form>
    </div>
  );
}