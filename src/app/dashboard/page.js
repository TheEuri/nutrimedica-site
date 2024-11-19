'use client'
import DashboardLayout from "./dashboardLayout";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import DoctorDashboard from './doctorDashboard';
import ReceptionistDashboard from './receptionistDashboard';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="">
      <DashboardLayout pageName="Início" user={user}>
        {user && user.doctor ? (
          <DoctorDashboard user={user} />
        ) : (
          <ReceptionistDashboard user={user} />
        )}
      </DashboardLayout>
    </div>
  );
}