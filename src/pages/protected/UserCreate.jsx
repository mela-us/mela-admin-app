import { useEffect, useState } from 'react';
import UserForm from '../../components/common/users/UserForm';
import Loader from '../../components/Loader';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { LevelService } from '../../services/LevelService';

export default function AddUserPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const { toast } = useToast();

  const roles = [
    { value: 'USER', label: 'USER' },
    { value: 'CONTRIBUTOR', label: 'CONTRIBUTOR' },
  ];

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        if (isMounted) {
          const levelsResData = await LevelService.getLevels();
          setLevels([...(levelsResData.data || [])]);
        }
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Error fetching data';
        if (isMounted) {
          toast.error({
            title: 'Fetch Data Error',
            description: msg,
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <UserForm mode="add" roles={roles} levels={levels} />
    </DashboardLayout>
  );
}
