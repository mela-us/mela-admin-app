import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
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
        const resData = await LevelService.getLevels();
        if (isMounted) {
          setLevels(resData.data || []);
        }
      } catch (error) {
        if (isMounted) {
          let msg = '';
          if (error.response && error.response.data) {
            msg = error.response.data.message;
          } else {
            msg = error.message;
          }
          toast.error({
            title: 'Lỗi lấy cấp độ',
            description: msg || 'Có lỗi xảy ra khi lấy danh sách cấp độ.',
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
      isMounted = false; // cleanup
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
