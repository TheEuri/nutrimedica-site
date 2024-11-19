'use client'

import { useEffect, useState } from 'react';
import DashboardLayout from '../dashboardLayout';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export default function Page() {
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    cellphone: '',
    bornDate: '',
    observation: '',
    bloodType: '',
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleOpenDeleteModal = (patient) => {
    setSelectedPatient(patient);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPatient(null);
  };
  const fetchPatients = async () => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error('Token não encontrado. Faça login novamente.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/patients', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        toast.error('Erro ao buscar pacientes. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao buscar pacientes. Verifique os dados e tente novamente.');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleOpenModal = (patient = null) => {
    if (patient) {
      setFormData(patient);
      setIsEditMode(true);
    } else {
      setFormData({
        name: '',
        cpf: '',
        email: '',
        cellphone: '',
        bornDate: '',
        observation: '',
        bloodType: '',
      });
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeletePatient = async () => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error('Token não encontrado. Faça login novamente.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/patients/${selectedPatient.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Paciente deletado com sucesso!');
        await fetchPatients(); // Atualiza a lista de pacientes
        handleCloseDeleteModal();
      } else {
        toast.error('Erro ao deletar paciente. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.log(error);
      toast.error('Erro ao deletar paciente. Verifique os dados e tente novamente.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');
    if (!token) {
      toast.error('Token não encontrado. Faça login novamente.');
      return;
    }

    try {
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode ? `http://localhost:8080/patients/${formData.id}` : 'http://localhost:8080/patients';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(`Paciente ${isEditMode ? 'atualizado' : 'adicionado'} com sucesso!`);
        await fetchPatients(); // Atualiza a lista de pacientes
        handleCloseModal();
      } else {
        toast.error(`Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} paciente. Verifique os dados e tente novamente.`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} paciente. Verifique os dados e tente novamente.`);
    }
  };

  return (
    <div className="">
      <DashboardLayout pageName="Pacientes">
        <div className="flex justify-end m-5">
          <button
            onClick={() => handleOpenModal()}
            className="block text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            type="button"
          >
            Criar Paciente
          </button>
        </div>

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
              <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-zinc-800 sm:p-5">
                <button
                  type="button"
                  className="text-zinc-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-zinc-200 hover:text-zinc-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-zinc-600 dark:hover:text-white"
                  onClick={handleCloseDeleteModal}
                >
                  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                  <span className="sr-only">Fechar modal</span>
                </button>
                <svg className="text-zinc-400 dark:text-zinc-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                <p className="mb-4 text-zinc-500 dark:text-zinc-300">Tem certeza que deseja deletar este paciente?</p>
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={handleCloseDeleteModal}
                    type="button"
                    className="py-2 px-3 text-sm font-medium text-zinc-500 bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-zinc-900 focus:z-10 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-500 dark:hover:text-white dark:hover:bg-zinc-600 dark:focus:ring-zinc-600"
                  >
                    Não, cancele
                  </button>
                  <button
                    onClick={handleDeletePatient}
                    type="button"
                    className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                  >
                    Sim, tenho certeza
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
              <div className="relative p-4 bg-white rounded-lg shadow dark:bg-zinc-800 sm:p-5">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-zinc-600">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {isEditMode ? 'Atualizar Paciente' : 'Adicionar Paciente'}
                  </h3>
                  <button type="button" className="text-zinc-400 bg-transparent hover:bg-zinc-200 hover:text-zinc-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-zinc-600 dark:hover:text-white" onClick={handleCloseModal}>
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                    <span className="sr-only">Fechar modal</span>
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Nome</label>
                      <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Nome do paciente" required />
                    </div>
                    <div>
                      <label htmlFor="cpf" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">CPF</label>
                      <input type="text" name="cpf" id="cpf" value={formData.cpf} onChange={handleChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="CPF do paciente" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">E-mail</label>
                      <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="E-mail do paciente" required />
                    </div>
                    <div>
                      <label htmlFor="cellphone" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Telefone</label>
                      <input type="text" name="cellphone" id="cellphone" value={formData.cellphone} onChange={handleChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Telefone do paciente" required />
                    </div>
                    <div>
                      <label htmlFor="bornDate" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Data de Nascimento</label>
                      <input type="date" name="bornDate" id="bornDate" value={formData.bornDate} onChange={handleChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" required />
                    </div>
                    <div>
                      <label htmlFor="bloodType" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Tipo Sanguíneo</label>
                      <select id="bloodType" name="bloodType" value={formData.bloodType} onChange={handleChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500">
                        <option value="">Selecione o tipo sanguíneo</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="observation" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Observações</label>
                      <textarea id="observation" name="observation" value={formData.observation} onChange={handleChange} rows="4" className="block p-2.5 w-full text-sm text-zinc-900 bg-zinc-50 rounded-lg border border-zinc-300 focus:ring-green-500 focus:border-green-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Observações sobre o paciente"></textarea>
                    </div>
                  </div>
                  <button type="submit" className="text-white inline-flex items-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                    <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                    </svg>
                    {isEditMode ? 'Atualizar Paciente' : 'Adicionar Paciente'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-zinc-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Nome</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">E-mail</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Data de nascimento</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">CPF</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">{patient.name}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{patient.email}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{patient.bornDate}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{patient.cpf}</td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <button
                      onClick={() => handleOpenModal(patient)}
                      className="inline-block rounded bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(patient)}
                      className="inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 ml-2"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


      </DashboardLayout>
    </div>
  );
}