import { useEffect, useState } from 'react';
import UserList from '../../components/common/users/UserList';
import Loader from '../../components/Loader';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { LevelService } from '../../services/LevelService';
import { UserService } from '../../services/UserService';
import { USER_ROLES } from '../../utils/constants';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const roles = USER_ROLES;

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        if (isMounted) {
          const [usersResData, levelsResData] = await Promise.all([
            UserService.getUsers(),
            LevelService.getLevels(),
          ]);
          setUsers(
            usersResData.data?.map((user) => ({
              userId: user.userId,
              username: user.username,
              fullname: user.fullname,
              birthday: user.birthday,
              imageUrl: user.imageUrl,
              levelId: user.levelId,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              userRole: user.userRole,
            })) || [],
          );
          setLevels(
            levelsResData.data?.map((level) => ({
              levelId: level.levelId,
              name: level.name,
            })) || [],
          );
        }
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Error fetching users data';
        if (isMounted) {
          toast.error({
            title: 'User Error',
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
      <UserList users={users} setUsers={setUsers} roles={roles} levels={levels} />
    </DashboardLayout>
  );
}
