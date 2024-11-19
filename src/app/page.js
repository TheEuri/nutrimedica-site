'use client'

import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

export default function Home() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 500) {
        toast.error('E-mail ou senha inválidos');
        return;
      }

      const data = await response.text();
      console.log(data);

      const verifyResponse = await fetch('/api/verifyToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: data }),
      });


      console.log("oi")
      const verifyData = await verifyResponse.json();
      console.log(verifyData);
      if (verifyData.valid) {
        Cookies.set('token', data, { expires: 1 }); 
        toast.success('Login realizado com sucesso!');
        window.location.href = '/dashboard';
      } else {
        toast.error('Erro na autenticação. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.log(error);
      toast.error('Erro na autenticação. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          alt="Nutrimedica"
          src="/logo.svg"
          width={64}
          height={64}
          className="mx-auto h-16 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Entre em sua conta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              E-mail
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
          <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Senha
                </label>
                {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Esqueceu a senha?
                  </a>
                </div> */}
              </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Entrar
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
            Não tem uma conta?{' '}
            <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Crie agora!
            </a>
          </p>
      </div>
    </div>
  );
}