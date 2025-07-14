import { useEffect, useState } from 'react';
import LevelList from '../../components/common/levels/LevelList';
import Loader from '../../components/Loader';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { LevelService } from '../../services/LevelService';

export default function AdminLevelsPage() {
  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    async function fetchLevels() {
      try {
        if (isMounted) {
          const resData = await LevelService.getLevels();
          setLevels(resData.data || []);
        }
      } catch (error) {
        if (isMounted) {
          const msg = error.response?.data?.message || error.message || 'Error fetching levels';
          toast.error({
            title: 'Fetching Levels Error',
            description: msg,
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    fetchLevels();
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
      <LevelList levels={levels} setLevels={setLevels} />
    </DashboardLayout>
  );
}
