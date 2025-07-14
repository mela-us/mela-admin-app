import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserForm from '../../components/common/users/UserForm';
import Loader from '../../components/Loader';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { LevelService } from '../../services/LevelService';
import { UserService } from '../../services/UserService';

export default function EditUserPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
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
          const [userResData, levelsResData] = await Promise.all([
            UserService.getUserInfo(id),
            LevelService.getLevels(),
          ]);
          setUser(userResData.data || null);
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
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-10">
          <div className="text-purple-600 text-lg">Không tìm thấy người dùng</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <UserForm mode="edit" user={user} roles={roles} levels={levels} />
    </DashboardLayout>
  );
}
