import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';

function MyComponent() {
  const { toast } = useToast();

  const handleSuccess = () => {
    toast.success({
      title: 'Thành công!',
      description: 'Dữ liệu đã được lưu thành công.',
    });
  };

  const handleError = () => {
    toast.error({
      title: 'Lỗi!',
      description: 'Có lỗi xảy ra khi lưu dữ liệu.',
    });
  };

  const handleWarning = () => {
    toast.warning({
      title: 'Cảnh báo!',
      description: 'Hành động này không thể hoàn tác.',
    });
  };

  const handleInfo = () => {
    toast.info({
      title: 'Thông tin',
      description: 'Đây là thông tin quan trọng.',
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success Toast</button>
      <button onClick={handleError}>Show Error Toast</button>
      <button onClick={handleWarning}>Show Warning Toast</button>
      <button onClick={handleInfo}>Show Info Toast</button>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <MyComponent />
      Xin chao<br></br>
      Xin chao<br></br>
      Xin chao<br></br>
    </DashboardLayout>
  );
}
