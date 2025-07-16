import { useState } from 'react';
import UserTable from './UserTable';
import { ArrowDownAZ, ArrowUpZA, Plus, Search, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { UserService } from '../../../services/UserService';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Input } from '../../ui/input';

export default function UserList({ users, setUsers, roles, levels }) {
  const { state } = useAuth();
  const { userRole, levelId: userLevelId } = state.user;
  const [sortField, setSortField] = useState('username');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState(
    userRole.toUpperCase() === 'CONTRIBUTOR' ? 'USER' : 'all',
  );
  const [selectedLevelFilter, setSelectedLevelFilter] = useState(
    userRole.toUpperCase() === 'CONTRIBUTOR' ? userLevelId : 'all',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  const handleDeleteUser = async (id) => {
    try {
      setIsLoading(true);
      const resData = await UserService.deleteUser(id);
      const { message } = resData;
      setUsers(users.filter((user) => user.userId !== id));
      toast.success({
        title: 'Delete User Success',
        description: message,
      });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error deleting user';
      toast.error({
        title: 'Delete User Error',
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelName = (id) => {
    const level = levels?.find((level) => level.levelId === id);
    return level ? level.name : 'Chưa có cấp độ';
  };

  const filteredUsers = users
    .filter((user) => {
      const roleMatch =
        userRole.toUpperCase() === 'CONTRIBUTOR'
          ? user.userRole.toUpperCase() === 'USER'
          : selectedRoleFilter === 'all' || user.userRole === selectedRoleFilter;
      const levelMatch =
        userRole.toUpperCase() === 'CONTRIBUTOR'
          ? user.levelId === userLevelId
          : selectedLevelFilter === 'all' || user.levelId === selectedLevelFilter;
      const searchMatch =
        searchQuery === '' ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.fullname || '')?.toLowerCase().includes(searchQuery.toLowerCase());
      return roleMatch && levelMatch && searchMatch;
    })
    .sort((a, b) => {
      if (sortField === 'username') {
        const aValue = (a.username || '').toLowerCase();
        const bValue = (b.username || '').toLowerCase();
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (sortField === 'fullname') {
        const aValue = (a.fullname || '').toLowerCase();
        const bValue = (b.fullname || '').toLowerCase();
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (sortField === 'createdAt') {
        const aValue = new Date(a.createdAt || 0).getTime();
        const bValue = new Date(b.createdAt || 0).getTime();
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

  const clearFilters = () => {
    setSelectedRoleFilter(userRole.toUpperCase() === 'CONTRIBUTOR' ? 'USER' : 'all');
    setSelectedLevelFilter(userRole.toUpperCase() === 'CONTRIBUTOR' ? userLevelId : 'all');
    setSearchQuery('');
    setSortField('username');
    setSortOrder('asc');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-row justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg shadow-lg">
            <Users className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-700">Quản lý người dùng</h2>
            <p className="text-gray-600 text-sm">Tổng cộng {users?.length || 0} người dùng</p>
          </div>
        </div>
        {userRole.toUpperCase() === 'ADMIN' && (
          <Button
            asChild
            className="button-bg-color text-white font-medium px-5 py-2 rounded-3xl shadow transition-all duration-200"
          >
            <Link to="/users/add">
              <Plus className="mr-2 h-5 w-5" /> Thêm mới
            </Link>
          </Button>
        )}
      </div>

      <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-md">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo họ tên hoặc tên đăng nhập..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 border-gray-300 rounded-lg bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-10 px-4 text-sm font-medium transition-all duration-200 ${
                  selectedRoleFilter === 'all' && userRole.toUpperCase() !== 'CONTRIBUTOR'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'ring-2 ring-blue-500 bg-blue-50 text-blue-700'
                }`}
              >
                {selectedRoleFilter === 'all' ? 'Vai trò' : selectedRoleFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup className="scroll-max-h-60 overflow-y-auto max-h-60">
                {userRole.toUpperCase() !== 'CONTRIBUTOR' && (
                  <>
                    <DropdownMenuItem onClick={() => setSelectedRoleFilter('all')} className="cursor-pointer">
                      <span>Tất cả vai trò</span>
                    </DropdownMenuItem>
                  </>
                )}
                {roles
                  ?.filter((role) => userRole.toUpperCase() !== 'CONTRIBUTOR' || role.value === 'USER')
                  .map((role) => (
                    <DropdownMenuItem
                      key={role.value}
                      onClick={() => setSelectedRoleFilter(role.value)}
                      className="cursor-pointer"
                    >
                      <span>{role.label}</span>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-10 px-4 text-sm font-medium transition-all duration-200 ${
                  selectedLevelFilter === 'all' && userRole.toUpperCase() !== 'CONTRIBUTOR'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'ring-2 ring-blue-500 bg-blue-50 text-blue-700'
                }`}
              >
                {selectedLevelFilter === 'all' ? 'Cấp độ' : getLevelName(selectedLevelFilter)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup className="scroll-max-h-60 overflow-y-auto max-h-60">
                {userRole.toUpperCase() !== 'CONTRIBUTOR' && (
                  <>
                    <DropdownMenuItem onClick={() => setSelectedLevelFilter('all')} className="cursor-pointer">
                      <span>Tất cả cấp độ</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLevelFilter(null)} className="cursor-pointer">
                      <span>Chưa có cấp độ</span>
                    </DropdownMenuItem>
                  </>
                )}
                {levels
                  ?.filter((level) => userRole.toUpperCase() !== 'CONTRIBUTOR' || level.levelId === userLevelId)
                  .map((level) => (
                    <DropdownMenuItem
                      key={level.levelId}
                      onClick={() => setSelectedLevelFilter(level.levelId)}
                      className="cursor-pointer"
                    >
                      <span>{level.name}</span>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? (
                  <ArrowDownAZ className="mr-2 h-4 w-4 text-indigo-500" />
                ) : (
                  <ArrowUpZA className="mr-2 h-4 w-4 text-indigo-500" />
                )}
                <span>Sắp xếp</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleSort('username', 'asc')} className="cursor-pointer">
                  <ArrowDownAZ className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>Username A-Z</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('username', 'desc')} className="cursor-pointer">
                  <ArrowUpZA className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>Username Z-A</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('createdAt', 'asc')} className="cursor-pointer">
                  <ArrowDownAZ className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>Cũ nhất</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('createdAt', 'desc')} className="cursor-pointer">
                  <ArrowUpZA className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>Mới nhất</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('fullname', 'asc')} className="cursor-pointer">
                  <ArrowDownAZ className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>Họ tên A-Z</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('fullname', 'desc')} className="cursor-pointer">
                  <ArrowUpZA className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>Họ tên Z-A</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {(searchQuery ||
          (selectedRoleFilter !== 'all' &&
            selectedLevelFilter !== 'all' &&
            userRole.toUpperCase() !== 'CONTRIBUTOR')) && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Đang lọc theo </span>
              {searchQuery && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Tìm kiếm &quot;{searchQuery}&quot;
                </Badge>
              )}
              {selectedRoleFilter !== 'all' && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Vai trò &quot;{selectedRoleFilter}&quot;
                </Badge>
              )}
              {selectedLevelFilter !== 'all' && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  Cấp độ &quot;{getLevelName(selectedLevelFilter)}&quot;
                </Badge>
              )}
              <span className="text-sm text-gray-500">({filteredUsers?.length || 0} kết quả)</span>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>

      <UserTable users={filteredUsers} levels={levels} onDelete={handleDeleteUser} isLoading={isLoading} />
    </div>
  );
}
