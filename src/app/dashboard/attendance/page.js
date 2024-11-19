'use client'
import DashboardLayout from "../dashboardLayout"
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { addDays, parseISO, format } from 'date-fns';

export default function Dashboard() {
  const [attendances, setAttendances] = useState([]);

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
const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
const [isAttendanceEditMode, setIsAttendanceEditMode] = useState(false);
const [attendanceFormData, setAttendanceFormData] = useState({
  patientId: '',
  userId: '',
  placeId: '',
  agendaEventId: '',
  done: false,
  startDate: '',
  endDate: '',
  observation: '',
});
const [isAttendanceDeleteModalOpen, setIsAttendanceDeleteModalOpen] = useState(false);
const [selectedAttendance, setSelectedAttendance] = useState(null);
const [users, setUsers] = useState([]);
const [patients, setPatients] = useState([]);
const [places, setPlaces] = useState([]);
const [agendaEvents, setAgendaEvents] = useState([]);

const handleOpenAttendanceModal = (attendance = null) => {
  if (attendance) {
    setAttendanceFormData(attendance);
    setIsAttendanceEditMode(true);
  } else {
    setAttendanceFormData({
      patientId: '',
      userId: '',
      placeId: '',
      agendaEventId: '',
      done: false,
      startDate: '',
      endDate: '',
      observation: '',
    });
    setIsAttendanceEditMode(false);
  }
  setIsAttendanceModalOpen(true);
};

const handleCloseAttendanceModal = () => {
  setIsAttendanceModalOpen(false);
};

const handleOpenAttendanceDeleteModal = (attendance) => {
  setSelectedAttendance(attendance);
  setIsAttendanceDeleteModalOpen(true);
};

const handleCloseAttendanceDeleteModal = () => {
  setIsAttendanceDeleteModalOpen(false);
  setSelectedAttendance(null);
};

const fetchRelatedData = async () => {
  const token = Cookies.get('token');
  if (!token) {
    toast.error('Token não encontrado. Faça login novamente.');
    return;
  }

  try {
    const [doctorsResponse, patientsResponse, placesResponse, agendaEventsResponse] = await Promise.all([
      fetch('http://localhost:8080/users/doctors', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }),
      fetch('http://localhost:8080/patients', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }),
      fetch('http://localhost:8080/places', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }),
      fetch('http://localhost:8080/agenda-events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }),
    ]);

    if (doctorsResponse.ok && patientsResponse.ok && placesResponse.ok && agendaEventsResponse.ok) {
      const [doctorsData, patientsData, placesData, agendaEventsData] = await Promise.all([
        doctorsResponse.json(),
        patientsResponse.json(),
        placesResponse.json(),
        agendaEventsResponse.json(),
      ]);

      setUsers(doctorsData);
      setPatients(patientsData);
      setPlaces(placesData);
      setAgendaEvents(agendaEventsData);
    } else {
      toast.error('Erro ao buscar dados relacionados. Verifique os dados e tente novamente.');
    }
  } catch (error) {
    toast.error('Erro ao buscar dados relacionados. Verifique os dados e tente novamente.');
  }
};

const fetchAttendances = async () => {
  const token = Cookies.get('token');
  if (!token) {
    toast.error('Token não encontrado. Faça login novamente.');
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/attendances', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setAttendances(data);
    } else {
      toast.error('Erro ao buscar atendimentos. Verifique os dados e tente novamente.');
    }
  } catch (error) {
    toast.error('Erro ao buscar atendimentos. Verifique os dados e tente novamente.');
  }
};

const handleAttendanceChange = (e) => {
  const { name, value } = e.target;
  setAttendanceFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};



const handleAttendanceSubmit = async (e) => {
  e.preventDefault();
  const token = Cookies.get('token');
  if (!token) {
    toast.error('Token não encontrado. Faça login novamente.');
    return;
  }

  try {
    let updatedFormData = { ...attendanceFormData };

    
    updatedFormData = {
      ...attendanceFormData,
      startDate: format(addDays(parseISO(attendanceFormData.startDate), 1), 'yyyy-MM-dd'),
      endDate: format(addDays(parseISO(attendanceFormData.endDate), 1), 'yyyy-MM-dd'),
    };

    const method = isAttendanceEditMode ? 'PUT' : 'POST';
    const url = isAttendanceEditMode ? `http://localhost:8080/attendances/${attendanceFormData.id}` : 'http://localhost:8080/attendances';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedFormData),
    });

    if (response.ok) {
      toast.success(`Atendimento ${isAttendanceEditMode ? 'atualizado' : 'adicionado'} com sucesso!`);
      await fetchAttendances(); 
      handleCloseAttendanceModal();
    } else {
      toast.error(`Erro ao ${isAttendanceEditMode ? 'atualizar' : 'adicionar'} atendimento. Verifique os dados e tente novamente.`);
    }
  } catch (error) {
    console.log(error);
    toast.error(`Erro ao ${isAttendanceEditMode ? 'atualizar' : 'adicionar'} atendimento. Verifique os dados e tente novamente.`);
  }
};
const handleDeleteAttendance = async () => {
  const token = Cookies.get('token');
  if (!token) {
    toast.error('Token não encontrado. Faça login novamente.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/attendances/${selectedAttendance.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      toast.success('Atendimento deletado com sucesso!');
      await fetchAttendances();
      handleCloseAttendanceDeleteModal();
    } else {
      toast.error('Erro ao deletar atendimento. Verifique os dados e tente novamente.');
    }
  } catch (error) {
    console.log(error);
    toast.error('Erro ao deletar atendimento. Verifique os dados e tente novamente.');
  }
};

useEffect(() => {
  fetchRelatedData();
  fetchAttendances();
}, []);


  
  return (

    <div className="">
      <DashboardLayout pageName="Atendimentos" user={user}>
      <div className="flex justify-end m-5">
  <button
    onClick={() => handleOpenAttendanceModal()}
    className="block text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
    type="button"
  >
    Criar Atendimento
  </button>
</div>
      
      {isAttendanceModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
      <div className="relative p-4 bg-white rounded-lg shadow dark:bg-zinc-800 sm:p-5">
        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-zinc-600">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {isAttendanceEditMode ? 'Atualizar Atendimento' : 'Adicionar Atendimento'}
          </h3>
          <button type="button" className="text-zinc-400 bg-transparent hover:bg-zinc-200 hover:text-zinc-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-zinc-600 dark:hover:text-white" onClick={handleCloseAttendanceModal}>
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
            <span className="sr-only">Fechar modal</span>
          </button>
        </div>
        <form onSubmit={handleAttendanceSubmit}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2">
            <div>
              <label htmlFor="patientId" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Paciente</label>
              <select id="patientId" name="patientId" value={attendanceFormData.patientId} onChange={handleAttendanceChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="">Selecione o paciente</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>{patient.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="userId" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Médico</label>
              <select id="userId" name="userId" value={attendanceFormData.userId} onChange={handleAttendanceChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="">Selecione o Médico</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="placeId" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Local</label>
              <select id="placeId" name="placeId" value={attendanceFormData.placeId} onChange={handleAttendanceChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="">Selecione o local</option>
                {places.map((place) => (
                  <option key={place.id} value={place.id}>{place.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="agendaEventId" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Tipo de Agendamento</label>
              <select id="agendaEventId" name="agendaEventId" value={attendanceFormData.agendaEventId} onChange={handleAttendanceChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="">Selecione o tipo de agendamento</option>
                {agendaEvents.map((event) => (
                  <option key={event.id} value={event.id}>{event.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Data de Início</label>
              <input type="date" name="startDate" id="startDate" value={attendanceFormData.startDate} onChange={handleAttendanceChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            </div>
            <div>
              <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Data de Término</label>
              <input type="date" name="endDate" id="endDate" value={attendanceFormData.endDate} onChange={handleAttendanceChange} className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="observation" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Observações</label>
              <textarea id="observation" name="observation" value={attendanceFormData.observation} onChange={handleAttendanceChange} rows="4" className="block p-2.5 w-full text-sm text-zinc-900 bg-zinc-50 rounded-lg border border-zinc-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Observações sobre o atendimento"></textarea>
            </div>
          </div>
          <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
            </svg>
            {isAttendanceEditMode ? 'Atualizar Atendimento' : 'Adicionar Atendimento'}
          </button>
        </form>
      </div>
    </div>
  </div>
)}

{isAttendanceDeleteModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="relative p-4 w-full max-w-md h-full md:h-auto">
      <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-zinc-800 sm:p-5">
        <button
          type="button"
          className="text-zinc-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-zinc-200 hover:text-zinc-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-zinc-600 dark:hover:text-white"
          onClick={handleCloseAttendanceDeleteModal}
        >
          <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
          <span className="sr-only">Fechar modal</span>
        </button>
        <svg className="text-zinc-400 dark:text-zinc-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
        </svg>
        <p className="mb-4 text-zinc-500 dark:text-zinc-300">Tem certeza que deseja deletar este atendimento?</p>
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={handleCloseAttendanceDeleteModal}
            type="button"
            className="py-2 px-3 text-sm font-medium text-zinc-500 bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-zinc-900 focus:z-10 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-500 dark:hover:text-white dark:hover:bg-zinc-600 dark:focus:ring-zinc-600"
          >
            Não, cancele
          </button>
          <button
            onClick={handleDeleteAttendance}
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

<div className="overflow-x-auto mt-5">
  <h1 className="text-2xl font-bold mb-2">Atendimentos</h1>
  <table className="min-w-full divide-y-2 divide-zinc-200 bg-white text-sm">
    <thead className="ltr:text-left rtl:text-right">
      <tr>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Paciente</th>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Médico</th>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Local</th>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Tipo de Agendamento</th>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Data de Início</th>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Data de Término</th>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Observações</th>
        <th className="px-4 py-2"></th>
      </tr>
    </thead>

    <tbody className="divide-y divide-zinc-200">
      {attendances.map((attendance) => {
        const patient = patients.find(p => p.id === attendance.patientId);
        const doctor = users.find(u => u.id === attendance.userId);
        const place = places.find(p => p.id === attendance.placeId);
        const agendaEvent = agendaEvents.find(a => a.id === attendance.agendaEventId);

        return (
          <tr key={attendance.id}>
            <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{patient ? patient.name : 'Desconhecido'}</td>
            <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{doctor ? doctor.name : 'Desconhecido'}</td>
            <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{place ? place.name : 'Desconhecido'}</td>
            <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{agendaEvent ? agendaEvent.name : 'Desconhecido'}</td>
            <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{attendance.startDate}</td>
            <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{attendance.endDate}</td>
            <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{attendance.observation}</td>
            <td className="whitespace-nowrap px-4 py-2">
              <button
                onClick={() => handleOpenAttendanceModal(attendance)}
                className="inline-block rounded bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-700"
              >
                Editar
              </button>
              <button
                onClick={() => handleOpenAttendanceDeleteModal(attendance)}
                className="inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 ml-2"
              >
                Deletar
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>




      </DashboardLayout>
    </div>
  )
}