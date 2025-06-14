import type { User } from "@/types/user"
import { UserProfileClient } from "@/components/users/user-profile";

// Mock user data
const mockUser: User = {
  userId: "0083eff5-53f6-44dd-b43e-5c1ad11519d6",
  username: "nths4@gmail.com",
  imageUrl: "https://avatars.githubusercontent.com/u/12345678?v=4",
  fullName: "Nguyen Thi Hoa Sen",
  createdAt: "2024-12-16T17:59:43.670+00:00",
  updatedAt: "2025-01-10T09:30:00.000+00:00",
  birthday: "2008-05-15",
  userRole: "STUDENT",
}

// Mock MELA-specific data with expanded learning and chat history
const mockuserStatistic = {
  averageScore: 88,
  learningHistory: [
    {
      lectureId: "1",
      sectionId: "1",
      name: "Số và chữ số",
      completedAt: "2024-12-17T10:00:00.000+00:00",
      duration: "30 phút",
      progress: 100,
      status: "Hoàn thành",
    },
    {
      lectureId: "2",
      sectionId: "1",
      name: "Phép cộng trong phạm vi 10",
      completedAt: "2024-12-18T14:30:00.000+00:00",
      duration: "25 phút",
      progress: 100,
      status: "Hoàn thành",
    },
    {
      lectureId: "3",
      sectionId: "2",
      name: "Phép trừ trong phạm vi 10",
      completedAt: "2025-01-05T15:00:00.000+00:00",
      duration: "35 phút",
      progress: 100,
      status: "Hoàn thành",
    },
    {
      lectureId: "4",
      sectionId: "2",
      name: "Hình học cơ bản",
      completedAt: "2025-01-10T09:00:00.000+00:00",
      duration: "40 phút",
      progress: 80,
      status: "Đang học",
    },
    {
      lectureId: "5",
      sectionId: "3",
      name: "Đo lường độ dài",
      completedAt: "2025-01-12T11:00:00.000+00:00",
      duration: "28 phút",
      progress: 100,
      status: "Hoàn thành",
    },
    {
      lectureId: "6",
      sectionId: "3",
      name: "So sánh số",
      completedAt: "2025-01-15T13:30:00.000+00:00",
      duration: "32 phút",
      progress: 90,
      status: "Đang học",
    },
  ],
  exerciseHistory: [
    {
      exerciseId: "1",
      lectureId: "1",
      score: 90,
      startedAt: "2024-12-17T10:30:00.000+00:00",
      completedAt: "2024-12-17T10:45:00.000+00:00",
      questions: [
        { questionId: "q1", isCorrect: true },
        { questionId: "q2", isCorrect: false },
        { questionId: "q3", isCorrect: true },
      ],
    },
    {
      exerciseId: "2",
      lectureId: "2",
      score: 85,
      startedAt: "2024-12-18T14:50:00.000+00:00",
      completedAt: "2024-12-18T15:10:00.000+00:00",
      questions: [
        { questionId: "q4", isCorrect: true },
        { questionId: "q5", isCorrect: true },
        { questionId: "q6", isCorrect: false },
      ],
    },
  ],
  chatHistory: [
    {
      conversationId: "chat1",
      title: "Hỏi về phép cộng",
      topic: "Số học",
      startedAt: "2024-12-17T11:00:00.000+00:00",
      messages: 5,
      lastMessage: "Làm thế nào để cộng hai số có nhớ?",
      status: "Hoàn thành",
    },
    {
      conversationId: "chat2",
      title: "Giải bài tập phép trừ",
      topic: "Số học",
      startedAt: "2025-01-05T16:00:00.000+00:00",
      messages: 3,
      lastMessage: "Bài tập 8 - 3 = ?",
      status: "Hoàn thành",
    },
    {
      conversationId: "chat3",
      title: "Hiểu về hình tam giác",
      topic: "Hình học",
      startedAt: "2025-01-10T10:00:00.000+00:00",
      messages: 7,
      lastMessage: "Tam giác có mấy cạnh?",
      status: "Đang mở",
    },
    {
      conversationId: "chat4",
      title: "Đo lường đơn vị cm",
      topic: "Đo lường",
      startedAt: "2025-01-12T12:00:00.000+00:00",
      messages: 4,
      lastMessage: "1 mét bằng bao nhiêu cm?",
      status: "Hoàn thành",
    },
    {
      conversationId: "chat5",
      title: "So sánh số lớn hơn",
      topic: "Số học",
      startedAt: "2025-01-15T14:00:00.000+00:00",
      messages: 6,
      lastMessage: "Số nào lớn hơn: 15 hay 12?",
      status: "Đang mở",
    },
  ],
  streak: 7,
  longestStreak: 12,
  totalTopicsAsked: 8,
  totalExercise: 120,
  recentAchievements: [
    { id: "ach1", name: "Hoàn thành 5 bài học", earnedAt: "2025-01-05" },
    { id: "ach2", name: "Streak 7 ngày", earnedAt: "2025-01-10" },
    { id: "ach3", name: "Hoàn thành 10 bài tập", earnedAt: "2025-01-12" },
  ],
  performanceTrend: [
    { month: "Tháng 11/2024", score: 82 },
    { month: "Tháng 12/2024", score: 85 },
    { month: "Tháng 1/2025", score: 88 },
  ],
  recommendations: [
    "Tập trung cải thiện kỹ năng giải bài tập phép trừ (điểm yếu trong bài tập gần đây).",
    "Xem lại bài giảng 'Phép trừ trong phạm vi 10' để củng cố kiến thức.",
    "Thử thách bản thân với bài tập nâng cao trong chủ đề Hình học.",
    "Tiếp tục duy trì streak học tập hàng ngày.",
  ],
}

async function getUser(userId: string): Promise<{ user: User | null; userStatistic: any }> {
  const user = mockUser
  const userStatistic = mockuserStatistic || {}
  return { user, userStatistic }
}

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const userParams = await params
  const { user, userStatistic } = await getUser(userParams.id)

  if (!user) {
    throw Error("Không tìm thấy người dùng")
  }

  return <UserProfileClient user={user} userStatistic={userStatistic} />
}
