import { useEffect, useState } from 'react';
import { ChevronLeft, BarChart3 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import { Button } from '../../components/ui/button';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { LevelService } from '../../services/LevelService';
import { UserReportService } from '../../services/UserReportService';
import { UserService } from '../../services/UserService';
import UserProfileCard from '../../components/common/users/UserProfileCard';
import UserExerciseOverview from '../../components/common/users/UserExerciseOverview';
import UserSkillsRadar from '../../components/common/users/UserSkillsRadar';
import ContributorStats from '../../components/common/users/ContributorStats';
import ContributorTopicChart from '../../components/common/users/ContributorTopicChart';

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [levels, setLevels] = useState([]);
  const [skills, setSkills] = useState([]);
  const [tokens, setTokens] = useState(0);
  const [streak, setStreak] = useState({ streakDays: 0, longestStreak: 0 });
  const [exerciseStats, setExerciseStats] = useState(null);
  const [lectureContributions, setLectureContributions] = useState(null);
  const [exerciseContributions, setExerciseContributions] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        if (isMounted) {
          const [userRes, levelsRes] = await Promise.all([
            UserService.getUserInfo(id),
            LevelService.getLevels(),
          ]);
          setUser(userRes.data || null);
          setLevels([...(levelsRes.data || [])]);

          if (userRes.data?.userRole?.toUpperCase() === 'USER') {
            const [skillsRes, tokensRes, streakRes, exerciseStatsRes] = await Promise.all([
              UserReportService.getUserSkills(id),
              UserReportService.getUserTokens(id),
              UserReportService.getUserStreak(id),
              UserReportService.getUserExerciseStats(id),
            ]);
            setSkills(skillsRes.detailedStats || []);
            setTokens(tokensRes.token || 0);
            setStreak({
              streakDays: streakRes.streakDays || 0,
              longestStreak: streakRes.longestStreak || 0,
            });
            setExerciseStats(exerciseStatsRes.data || null);
          } else if (userRes.data?.userRole?.toUpperCase() === 'CONTRIBUTOR') {
            const [lectureRes, exerciseRes] = await Promise.all([
              UserReportService.getLectureContributions(id),
              UserReportService.getExerciseContributions(id),
            ]);
            setLectureContributions(lectureRes.data || null);
            setExerciseContributions(exerciseRes.data || null);
          }
        }
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Error fetching user data';
        if (isMounted) {
          toast.error({
            title: 'Fetch Error',
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
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-10">
          <Button
            onClick={() => navigate('/users')}
            size="sm"
            variant="ghost"
            className="group flex items-center gap-1 border border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md transition-all"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent ml-2">
            Thông tin người dùng
          </h2>
        </div>

        <UserProfileCard user={user} levels={levels} tokens={tokens} streak={streak} />
        {user.userRole?.toUpperCase() === 'USER' && (
          <>
            <UserExerciseOverview exerciseStats={exerciseStats} />
            <UserSkillsRadar skills={skills} />
          </>
        )}
        {user.userRole?.toUpperCase() === 'CONTRIBUTOR' && (
          <>
            <ContributorStats
              lectureContributions={lectureContributions}
              exerciseContributions={exerciseContributions}
            />
            <ContributorTopicChart
              lectureContributions={lectureContributions}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
