'use client'

import { useEffect, useState } from 'react';
import DashboardLayout from '../dashboardLayout';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export default function Places() {
  const [places, setPlaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('Token não encontrado. Faça login novamente.');
        window.location.href = '/login';
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/users/userDetail', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          toast.error('Erro ao buscar detalhes do usuário. Verifique os dados e tente novamente.');
        }
      } catch (error) {
        toast.error('Erro ao buscar detalhes do usuário. Verifique os dados e tente novamente.');
      } 
    };

    fetchUserDetails();
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    addressCep: '',
    address: '',
    addressNumber: '',
    addressDistrict: '',
    addressCity: '',
    addressState: '',
    addressComplement: '',
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [agendaEvents, setAgendaEvents] = useState([]);
  const [isAgendaEventModalOpen, setIsAgendaEventModalOpen] = useState(false);
  const [isAgendaEventEditMode, setIsAgendaEventEditMode] = useState(false);
  const [agendaEventFormData, setAgendaEventFormData] = useState({
    name: '',
    duration: '',
    paymentMethod: '',
    description: '',
    is_deleted: false,
  });
  const [isAgendaEventDeleteModalOpen, setIsAgendaEventDeleteModalOpen] = useState(false);
  const [selectedAgendaEvent, setSelectedAgendaEvent] = useState(null);

  
  const handleOpenAgendaEventModal = (event = null) => {
    if (event) {
      setAgendaEventFormData(event);
      setIsAgendaEventEditMode(true);
    } else {
      setAgendaEventFormData({
        name: '',
        duration: '',
        paymentMethod: '',
        description: '',
      });
      setIsAgendaEventEditMode(false);
    }
    setIsAgendaEventModalOpen(true);
  };

  const handleCloseAgendaEventModal = () => {
    setIsAgendaEventModalOpen(false);
  };

  const handleOpenAgendaEventDeleteModal = (event) => {
    setSelectedAgendaEvent(event);
    setIsAgendaEventDeleteModalOpen(true);
  };

  const handleCloseAgendaEventDeleteModal = () => {
    setIsAgendaEventDeleteModalOpen(false);
    setSelectedAgendaEvent(null);
  };

  const handleOpenDeleteModal = (place) => {
    setSelectedPlace(place);
    setIsDeleteModalOpen(true);
  };



  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPlace(null);
  };

  
  const fetchAgendaEvents = async () => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error('Token não encontrado. Faça login novamente.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/agenda-events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAgendaEvents(data);
      } else {
        toast.error('Erro ao buscar tipos de agendamentos. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao buscar tipos de agendamentos. Verifique os dados e tente novamente.');
    }
  };

  const fetchPlaces = async () => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error('Token não encontrado. Faça login novamente.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/places', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPlaces(data);
      } else {
        toast.error('Erro ao buscar locais. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao buscar locais. Verifique os dados e tente novamente.');
    }
  };


  useEffect(() => {
    fetchPlaces();
    fetchAgendaEvents();
  }, []);

  const handleOpenModal = (place = null) => {
    if (place) {
      setFormData(place);
      setIsEditMode(true);
    } else {
      setFormData({
        name: '',
        addressCep: '',
        address: '',
        addressNumber: '',
        addressDistrict: '',
        addressCity: '',
        addressState: '',
        addressComplement: '',
      });
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  
  const handleDeleteAgendaEvent = async () => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error('Token não encontrado. Faça login novamente.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/agenda-events/${selectedAgendaEvent.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Tipo de agendamento deletado com sucesso!');
        await fetchAgendaEvents(); 
        handleCloseAgendaEventDeleteModal();
      } else {
        toast.error('Erro ao deletar tipo de agendamento. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.log(error);
      toast.error('Erro ao deletar tipo de agendamento. Verifique os dados e tente novamente.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeletePlace = async () => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error('Token não encontrado. Faça login novamente.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/places/${selectedPlace.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Local deletado com sucesso!');
        await fetchPlaces(); 
        handleCloseDeleteModal();
      } else {
        toast.error('Erro ao deletar local. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.log(error);
      toast.error('Erro ao deletar local. Verifique os dados e tente novamente.');
    }
  };


  const handleAgendaEventSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');
    if (!token) {
      toast.error('Token não encontrado. Faça login novamente.');
      return;
    }

    try {
      const method = isAgendaEventEditMode ? 'PUT' : 'POST';
      const url = isAgendaEventEditMode ? `http://localhost:8080/agenda-events/${agendaEventFormData.id}` : 'http://localhost:8080/agenda-events';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(agendaEventFormData),
      });

      if (response.ok) {
        toast.success(`Tipo de agendamento ${isAgendaEventEditMode ? 'atualizado' : 'adicionado'} com sucesso!`);
        await fetchAgendaEvents(); 
        handleCloseAgendaEventModal();
      } else {
        toast.error(`Erro ao ${isAgendaEventEditMode ? 'atualizar' : 'adicionar'} tipo de agendamento. Verifique os dados e tente novamente.`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Erro ao ${isAgendaEventEditMode ? 'atualizar' : 'adicionar'} tipo de agendamento. Verifique os dados e tente novamente.`);
    }
  };

 
  const handleAgendaEventChange = (e) => {
    const { name, value } = e.target;
    setAgendaEventFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
      const url = isEditMode ? `http://localhost:8080/places/${formData.id}` : 'http://localhost:8080/places';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(`Local ${isEditMode ? 'atualizado' : 'adicionado'} com sucesso!`);
        await fetchPlaces(); 
        handleCloseModal();
      } else {
        toast.error(`Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} local. Verifique os dados e tente novamente.`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} local. Verifique os dados e tente novamente.`);
    }
  };

  return (
    <div className="">
      <DashboardLayout pageName="Configurações" user={user}>

        <div className="flex justify-end m-5">
          <button
            onClick={() => handleOpenModal()}
            className="block text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            type="button"
          >
            Criar Local
          </button>
          <button
            onClick={() => handleOpenAgendaEventModal()}
            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2"
            type="button"
          >
            Criar Tipo de Agendamento
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
                <p className="mb-4 text-zinc-500 dark:text-zinc-300">Tem certeza que deseja deletar este local?</p>
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={handleCloseDeleteModal}
                    type="button"
                    className="py-2 px-3 text-sm font-medium text-zinc-500 bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-zinc-900 focus:z-10 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-500 dark:hover:text-white dark:hover:bg-zinc-600 dark:focus:ring-zinc-600"
                  >
                    Não, cancele
                  </button>
                  <button
                    onClick={handleDeletePlace}
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


        {isAgendaEventDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
              <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-zinc-800 sm:p-5">
                <button
                  type="button"
                  className="text-zinc-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-zinc-200 hover:text-zinc-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-zinc-600 dark:hover:text-white"
                  onClick={handleCloseAgendaEventDeleteModal}
                >
                  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                  <span className="sr-only">Fechar modal</span>
                </button>
                <svg className="text-zinc-400 dark:text-zinc-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                <p className="mb-4 text-zinc-500 dark:text-zinc-300">Tem certeza que deseja deletar este tipo de agendamento?</p>
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={handleCloseAgendaEventDeleteModal}
                    type="button"
                    className="py-2 px-3 text-sm font-medium text-zinc-500 bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-zinc-900 focus:z-10 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-500 dark:hover:text-white dark:hover:bg-zinc-600 dark:focus:ring-zinc-600"
                  >
                    Não, cancele
                  </button>
                  <button
                    onClick={handleDeleteAgendaEvent}
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
                    {isEditMode ? 'Atualizar Local' : 'Adicionar Local'}
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
                      <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Nome do local" required />
                    </div>
                    <div>
                      <label htmlFor="addressCep" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">CEP</label>
                      <input type="text" name="addressCep" id="addressCep" value={formData.addressCep} onChange={handleChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="CEP do local" required />
                    </div>
                    <div>
                      <label htmlFor="address" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Endereço</label>
                      <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Endereço do local" required />
                    </div>
                    <div>
                      <label htmlFor="addressNumber" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Número</label>
                      <input type="text" name="addressNumber" id="addressNumber" value={formData.addressNumber} onChange={handleChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Número do local" required />
                    </div>
                    <div>
                      <label htmlFor="addressDistrict" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Bairro</label>
                      <input type="text" name="addressDistrict" id="addressDistrict" value={formData.addressDistrict} onChange={handleChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Bairro do local" required />
                    </div>
                    <div>
                      <label htmlFor="addressCity" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Cidade</label>
                      <input type="text" name="addressCity" id="addressCity" value={formData.addressCity} onChange={handleChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Cidade do local" required />
                    </div>
                    <div>
                      <label htmlFor="addressState" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Estado</label>
                      <input type="text" name="addressState" id="addressState" value={formData.addressState} onChange={handleChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Estado do local" required />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="addressComplement" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Complemento</label>
                      <textarea id="addressComplement" name="addressComplement" value={formData.addressComplement} onChange={handleChange} rows="4" className="block p-2.5 w-full text-sm text-zinc-900 bg-zinc-50 rounded-lg border border-zinc-300 focus:ring-green-500 focus:border-green-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Complemento do local"></textarea>
                    </div>
                  </div>
                  <button type="submit" className="text-white inline-flex items-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                    <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                    </svg>
                    {isEditMode ? 'Atualizar Local' : 'Adicionar Local'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {isAgendaEventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
              <div className="relative p-4 bg-white rounded-lg shadow dark:bg-zinc-800 sm:p-5">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-zinc-600">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {isAgendaEventEditMode ? 'Atualizar Tipo de Agendamento' : 'Adicionar Tipo de Agendamento'}
                  </h3>
                  <button type="button" className="text-zinc-400 bg-transparent hover:bg-zinc-200 hover:text-zinc-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-zinc-600 dark:hover:text-white" onClick={handleCloseAgendaEventModal}>
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                    <span className="sr-only">Fechar modal</span>
                  </button>
                </div>
                <form onSubmit={handleAgendaEventSubmit}>
                  <div className="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Nome</label>
                      <input type="text" name="name" id="name" value={agendaEventFormData.name} onChange={handleAgendaEventChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nome do tipo de agendamento" required />
                    </div>
                    <div>
                      <label htmlFor="duration" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Duração (minutos)</label>
                      <input type="number" name="duration" id="duration" value={agendaEventFormData.duration} onChange={handleAgendaEventChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Duração do tipo de agendamento" required />
                    </div>
                    <div>
                      <label htmlFor="paymentMethod" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Método de Pagamento</label>
                      <input type="text" name="paymentMethod" id="paymentMethod" value={agendaEventFormData.paymentMethod} onChange={handleAgendaEventChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Método de pagamento" required />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="description" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Descrição</label>
                      <textarea id="description" name="description" value={agendaEventFormData.description} onChange={handleAgendaEventChange} rows="4" className="block p-2.5 w-full text-sm text-zinc-900 bg-zinc-50 rounded-lg border border-zinc-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Descrição do tipo de agendamento"></textarea>
                    </div>
                  </div>
                  <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                    </svg>
                    {isAgendaEventEditMode ? 'Atualizar Tipo de Agendamento' : 'Adicionar Tipo de Agendamento'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}



        <div className="overflow-x-auto">
          <h1 className="text-2xl font-bold mb-2">Locais</h1>
          <table className="min-w-full divide-y-2 divide-zinc-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Nome</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">CEP</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Endereço</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Número</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Bairro</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Cidade</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Estado</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {places.map((place) => (
                <tr key={place.id}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">{place.name}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{place.addressCep}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{place.address}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{place.addressNumber}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{place.addressDistrict}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{place.addressCity}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{place.addressState}</td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <button
                      onClick={() => handleOpenModal(place)}
                      className="inline-block rounded bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(place)}
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

        <div className="overflow-x-auto mt-20">
          <h1 className="text-2xl font-bold mb-2">Tipo de agendamento</h1>
          <table className="min-w-full divide-y-2 divide-zinc-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Nome</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Duração</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Método de Pagamento</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Descrição</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {agendaEvents.map((event) => (
                <tr key={event.id}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">{event.name}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{event.duration}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{event.paymentMethod}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{event.description}</td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <button
                      onClick={() => handleOpenAgendaEventModal(event)}
                      className="inline-block rounded bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleOpenAgendaEventDeleteModal(event)}
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