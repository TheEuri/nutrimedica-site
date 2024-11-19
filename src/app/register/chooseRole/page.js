'use client'

import Image from 'next/image';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export default function ChooseRole() {
  const [selectedRole, setSelectedRole] = useState('');
  const [shift, setShift] = useState('');
  const [certifyingEntity, setCertifyingEntity] = useState('');
  const [state, setState] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [specialty, setSpecialty] = useState('');

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    setShift(''); // Reset shift when changing role
    setCertifyingEntity(''); // Reset certifying entity when changing role
    setState(''); // Reset state when changing role
    setCertificateNumber(''); // Reset certificate number when changing role
    setSpecialty(''); // Reset specialty when changing role
  };

  const handleShiftChange = (event) => {
    setShift(event.target.value);
  };

  const isNextButtonEnabled = () => {
    if (selectedRole === 'Recepcionista') {
      return shift !== '';
    }
    if (selectedRole === 'Médico') {
      return certifyingEntity !== '' && state !== '' && certificateNumber !== '' && specialty !== '';
    }
    return selectedRole !== '';
  };

  const handleNextClick = async () => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error('Token não encontrado. Faça login novamente.');
      return;
    }

    if (selectedRole === 'Médico') {
      const doctorData = {
        councilName: certifyingEntity,
        councilState: state,
        councilNumber: certificateNumber,
      };

      try {
        const response = await fetch('http://localhost:8080/users/register/doctors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(doctorData),
        });

        if (response.ok) {
          toast.success('Registro de médico realizado com sucesso!');

          // Segundo request para registrar a especialidade
          const specialtyData = {
            name: specialty,
          };

          const specialtyResponse = await fetch('http://localhost:8080/users/register/doctors/specialties', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(specialtyData),
          });

          if (specialtyResponse.ok) {
            toast.success('Especialidade registrada com sucesso!');
            window.location.href = '/dashboard';
          } else {
            toast.error('Erro ao registrar especialidade. Verifique os dados e tente novamente.');
          }
        } else {
          toast.error('Erro ao registrar médico. Verifique os dados e tente novamente.');
        }
      } catch (error) {
        toast.error('Erro ao registrar médico. Verifique os dados e tente novamente.');
      }
    } else if (selectedRole === 'Recepcionista') {
      const receptionistData = {
        shift: shift,
      };

      try {
        const response = await fetch('http://localhost:8080/users/register/receptionists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(receptionistData),
        });

        if (response.ok) {
          toast.success('Registro de recepcionista realizado com sucesso!');
          window.location.href = '/dashboard';
        } else {
          toast.error('Erro ao registrar recepcionista. Verifique os dados e tente novamente.');
        }
      } catch (error) {
        toast.error('Erro ao registrar recepcionista. Verifique os dados e tente novamente.');
      }
    }
  };

  return (
    <div className="max-w-full h-full flex justify-center place-items-center">
      <div className="max-w-lg w-full">
        <Image
          alt="Nutrimedica"
          src="/logo.svg"
          width={64}
          height={64}
          className="mx-auto h-16 w-auto mb-5"
        />
        <h1 className="text-3xl font-bold text-center pb-10">Qual a sua função?</h1>
        <fieldset className="grid grid-cols-1 gap-4">
          <legend className="sr-only">Delivery</legend>

          <div>
            <label
              htmlFor="DeliveryStandard"
              className="block cursor-pointer rounded-lg border border-zinc-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-zinc-200 has-[:checked]:border-zinc-700 has-[:checked]:ring-1 has-[:checked]:ring-zinc-700"
            >
              <div>
                <p className="text-zinc-700">Médico</p>
              </div>

              <input
                type="radio"
                name="DeliveryOption"
                value="Médico"
                id="DeliveryStandard"
                className="sr-only"
                onChange={handleRoleChange}
              />
            </label>
          </div>

          <div>
            <label
              htmlFor="DeliveryPriority"
              className="block cursor-pointer rounded-lg border border-zinc-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-zinc-200 has-[:checked]:border-zinc-700 has-[:checked]:ring-1 has-[:checked]:ring-zinc-700"
            >
              <div>
                <p className="text-zinc-700">Recepcionista</p>
              </div>

              <input
                type="radio"
                name="DeliveryOption"
                value="Recepcionista"
                id="DeliveryPriority"
                className="sr-only"
                onChange={handleRoleChange}
              />
            </label>
          </div>
        </fieldset>

        {selectedRole === 'Recepcionista' && (
          <div className="sm:col-span-3 mt-10">
            <label htmlFor="shift" className="block text-sm font-medium text-gray-700">
              Selecione o turno
            </label>
            <div className="mt-2">
              <select
                id="shift"
                name="shift"
                value={shift}
                onChange={handleShiftChange}
                className="mt-1.5 p-2.5 w-full shadow-sm rounded-lg border border-zinc-100 text-gray-700 sm:text-sm"
              >
                <option value="">Selecione uma opção</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Dia todo">Dia todo</option>
              </select>
            </div>
          </div>
        )}

        {selectedRole === 'Médico' && (
          <div className="mt-10">
            <div className="sm:col-span-3">
              <label htmlFor="certifyingEntity" className="block text-sm font-medium text-gray-700">
                Entidade Certificadora
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="certifyingEntity"
                  name="certifyingEntity"
                  value={certifyingEntity}
                  onChange={(e) => setCertifyingEntity(e.target.value)}
                  className="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-3 mt-4">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-3 mt-4">
              <label htmlFor="certificateNumber" className="block text-sm font-medium text-gray-700">
                Número do Certificado
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="certificateNumber"
                  name="certificateNumber"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  className="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-3 mt-4">
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                Especialidade Médica
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="specialty"
                  name="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {isNextButtonEnabled() && (
          <div className="mt-10 text-center">
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={handleNextClick}
            >
              Próximo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}