import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { addDays, parseISO, format } from 'date-fns';
import { isAfter, isSameDay } from 'date-fns';
  import Cookies from 'js-cookie';

export default function DoctorDashboard({ user }) {
  const [attendances, setAttendances] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleOpenViewModal = (attendance) => {
    setSelectedAttendance(attendance);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedAttendance(null);
  };

  const fetchAttendances = async () => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error('Token não encontrado. Faça login novamente.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/attendances/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (typeof data === 'string' && data === "Você não tem nenhum atendimento") {
          setAttendances([]);
          toast.info(data);
        } else {
          setAttendances(data);
        }
      } else {
        toast.error('Erro ao buscar atendimentos. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao buscar atendimentos. Verifique os dados e tente novamente.');
    }
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
    fetchAttendances();
    fetchPatients();
  }, []);

  const handleOpenAttendanceModal = (attendance) => {
    setSelectedAttendance(attendance);
    setIsAttendanceModalOpen(true);
  };

  const handleCloseAttendanceModal = () => {
    setIsAttendanceModalOpen(false);
    setSelectedAttendance(null);
  };

  const handleAttendanceChange = (e) => {
    const { name, value } = e.target;
    setSelectedAttendance((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const handleFinalizeAttendance = async () => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error('Token não encontrado. Faça login novamente.');
      return;
    }
  
    try {
      const updatedAttendance = {
        ...selectedAttendance,
        done: true,
        startDate: format(addDays(parseISO(selectedAttendance.startDate), 1), 'yyyy-MM-dd'),
        endDate: format(addDays(parseISO(selectedAttendance.endDate), 1), 'yyyy-MM-dd'),
      };
  
      const response = await fetch(`http://localhost:8080/attendances/${selectedAttendance.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedAttendance),
      });
  
      if (response.ok) {
        toast.success('Atendimento finalizado com sucesso!');
        await fetchAttendances(); 
        handleCloseViewModal(); 
      } else {
        toast.error('Erro ao finalizar atendimento. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.log(error);
      toast.error('Erro ao finalizar atendimento. Verifique os dados e tente novamente.');
    }
  };

  

const groupAttendancesByDate = (attendances) => {
  const grouped = attendances.reduce((acc, attendance) => {
    const date = format(parseISO(attendance.startDate), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(attendance);
    return acc;
  }, {});

  return Object.keys(grouped).sort().reduce((acc, date) => {
    acc[date] = grouped[date];
    return acc;
  }, {});
};

const upcomingAttendances = attendances.filter(attendance => {
  const today = new Date();
  const attendanceDate = parseISO(attendance.startDate);
  return isAfter(attendanceDate, today) || isSameDay(attendanceDate, today);
});

const groupedAttendances = groupAttendancesByDate(upcomingAttendances);

return (
  <div>
    <h1 className='text-3xl font-bold'>Bem-vindo, Dr. {user.name}</h1>
    {user.doctor.specialty ? (
      <p>Especialidade: {user.doctor.specialty.name}</p>
    ) : (
      <p>Especialidade não informada</p>
    )}

    <div className="overflow-x-auto mt-10">
      <h1 className="text-2xl font-bold mb-2">Atendimentos</h1>
      {Object.keys(groupedAttendances).length === 0 ? (
        <p className="text-zinc-700">Você não tem nenhum atendimento.</p>
      ) : (
        Object.keys(groupedAttendances).map(date => (
          <div key={date}>
            <h2 className="text-xl font-semibold mb-2">{format(parseISO(date), 'dd MMMM yyyy')}</h2>
            <table className="min-w-full divide-y-2 divide-zinc-200 bg-white text-sm mb-5">
              <thead className="ltr:text-left rtl:text-right">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Paciente</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Data de Início</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Data de Término</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-zinc-900">Status</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {groupedAttendances[date].map(attendance => {
                  const patient = patients.find(p => p.id === attendance.patientId);
                  return (
                    <tr key={attendance.id}>
                      <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{patient ? patient.name : 'Desconhecido'}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{attendance.startDate || ''}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-zinc-700">{attendance.endDate || ''}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-zinc-700">
                        {attendance.done ? (
                          <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">Finalizado</span>
                        ) : (
                          <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">Pendente</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2">
                        <button
                          onClick={() => handleOpenViewModal(attendance)}
                          className="inline-block rounded bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 ml-2"
                        >
                          Detalhar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>

    {isViewModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
          <div className="relative p-4 bg-white rounded-lg shadow dark:bg-zinc-800 sm:p-5">
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-zinc-600">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Detalhes do Atendimento e Paciente
              </h3>
              <button type="button" className="text-zinc-400 bg-transparent hover:bg-zinc-200 hover:text-zinc-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-zinc-600 dark:hover:text-white" onClick={handleCloseViewModal}>
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 111.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                <span className="sr-only">Fechar modal</span>
              </button>
            </div>
            <div className="grid gap-4 mb-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Nome</label>
                <input type="text" name="name" id="name" value={selectedAttendance && patients.find(p => p.id === selectedAttendance.patientId)?.name || ''} readOnly className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="cpf" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">CPF</label>
                <input type="text" name="cpf" id="cpf" value={selectedAttendance && patients.find(p => p.id === selectedAttendance.patientId)?.cpf || ''} readOnly className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">E-mail</label>
                <input type="email" name="email" id="email" value={selectedAttendance && patients.find(p => p.id === selectedAttendance.patientId)?.email || ''} readOnly className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="cellphone" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Telefone</label>
                <input type="text" name="cellphone" id="cellphone" value={selectedAttendance && patients.find(p => p.id === selectedAttendance.patientId)?.cellphone || ''} readOnly className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="bornDate" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Data de Nascimento</label>
                <input type="date" name="bornDate" id="bornDate" value={selectedAttendance && patients.find(p => p.id === selectedAttendance.patientId)?.bornDate || ''} readOnly className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="bloodType" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Tipo Sanguíneo</label>
                <input type="text" name="bloodType" id="bloodType" value={selectedAttendance && patients.find(p => p.id === selectedAttendance.patientId)?.bloodType || ''} readOnly className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="observation" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Observações</label>
                <textarea id="observation" name="observation" value={selectedAttendance && patients.find(p => p.id === selectedAttendance.patientId)?.observation || ''} readOnly rows="4" className="block p-2.5 w-full text-sm text-zinc-900 bg-zinc-50 rounded-lg border border-zinc-300 focus:ring-green-500 focus:border-green-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"></textarea>
              </div>
            </div>
            <div className="grid gap-4 mb-4 sm:grid-cols-2">
              <div>
                <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Data de Início</label>
                <input type="date" name="startDate" id="startDate" value={selectedAttendance?.startDate || ''} readOnly className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Data de Término</label>
                <input type="date" name="endDate" id="endDate" value={selectedAttendance?.endDate || ''} readOnly className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="attendanceObservation" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Observações do Atendimento</label>
                <textarea id="attendanceObservation" name="observation" value={selectedAttendance?.observation || ''} onChange={handleAttendanceChange} rows="4" className="block p-2.5 w-full text-sm text-zinc-900 bg-zinc-50 rounded-lg border border-zinc-300 focus:ring-green-500 focus:border-green-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"></textarea>
              </div>
              <div>
                <label htmlFor="status" className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Status</label>
                <input type="text" name="status" id="status" value={selectedAttendance?.done ? 'Finalizado' : 'Pendente'} readOnly className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
              </div>
            </div>
            {!selectedAttendance?.done && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleFinalizeAttendance}
                  className="inline-block rounded bg-green-700 px-4 py-2 text-xs font-medium text-white hover:bg-green-800"
                >
                  Finalizar Atendimento
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
);
}