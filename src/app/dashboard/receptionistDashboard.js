import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ReceptionistDashboard({ user }) {
  const [statistics, setStatistics] = useState(null);

  const fetchStatistics = async () => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error('Token não encontrado. Faça login novamente.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/attendances/statistics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      } else {
        toast.error('Erro ao buscar estatísticas. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao buscar estatísticas. Verifique os dados e tente novamente.');
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const handleCardClick = () => {
    window.location.href = '/dashboard/attendance';
  };

  const data = {
    labels: ['Total de Atendimentos', 'Atendimentos Pendentes', 'Atendimentos Concluídos'],
    datasets: [
      {
        label: '# de Atendimentos',
        data: statistics ? [statistics.totalAttendances, statistics.pendingAttendances, statistics.completedAttendances] : [0, 0, 0],
        backgroundColor: ['#3b82f6', '#fbbf24', '#10b981'],
        borderColor: ['#3b82f6', '#fbbf24', '#10b981'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Bem-vindo, {user.name}</h1>
      <p>Recepcionista</p>

      {statistics && (
        <div>
          <h2 className="text-2xl font-bold mb-4 mt-10">Essa semana:</h2>
          <div className="grid gap-4 mt-5 sm:grid-cols-2 lg:grid-cols-3">
            <article onClick={handleCardClick} className="cursor-pointer flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6">
              <span className="rounded-full bg-purple-100 p-3 text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4zm0 6c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              </span>

              <div>
                <p className="text-2xl font-medium text-gray-900">{statistics.totalAttendancesThisWeek}</p>
                <p className="text-sm text-gray-500">Atendimentos Esta Semana</p>
              </div>
            </article>

            <article onClick={handleCardClick} className="cursor-pointer flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6">
              <span className="rounded-full bg-red-100 p-3 text-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4zm0 6c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
              </span>

              <div>
                <p className="text-2xl font-medium text-gray-900">{statistics.totalAttendancesToday}</p>
                <p className="text-sm text-gray-500">Atendimentos Hoje</p>
              </div>
            </article>
          </div>

          <h2 className="text-2xl font-bold mb-4 mt-10">Totais:</h2>
          <div className="grid gap-4 mt-5 sm:grid-cols-2 lg:grid-cols-3">
            <article onClick={handleCardClick} className="cursor-pointer flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6">
              <span className="rounded-full bg-blue-100 p-3 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4zm0 6c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              </span>

              <div>
                <p className="text-2xl font-medium text-gray-900">{statistics.totalAttendances}</p>
                <p className="text-sm text-gray-500">Total de Atendimentos</p>
              </div>
            </article>

            <article onClick={handleCardClick} className="cursor-pointer flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6">
              <span className="rounded-full bg-yellow-100 p-3 text-yellow-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4zm0 6c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              </span>

              <div>
                <p className="text-2xl font-medium text-gray-900">{statistics.pendingAttendances}</p>
                <p className="text-sm text-gray-500">Atendimentos Pendentes</p>
              </div>
            </article>

            <article onClick={handleCardClick} className="cursor-pointer flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6">
              <span className="rounded-full bg-green-100 p-3 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4zm0 6c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              </span>

              <div>
                <p className="text-2xl font-medium text-gray-900">{statistics.completedAttendances}</p>
                <p className="text-sm text-gray-500">Atendimentos Concluídos</p>
              </div>
            </article>

           
          </div>
        </div>
      )}

      {statistics && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Gráfico de Atendimentos</h2>
          <div className="w-64 h-64 mx-auto">
            <Pie data={data} />
          </div>
        </div>
      )}
    </div>
  );
}