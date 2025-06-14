"use client"

import type { User } from "@/types/user"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserIcon, BookOpen, MessageSquare, Flame, ChevronLeft, Trophy, Clock, CheckCircle, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UserProfileClient({ user, userStatistic }: { user: User; userStatistic: any }) {
  const router = useRouter()
  const getPerformanceRating = (avgScore: number): string => {
    if (avgScore >= 90) return "Xuất sắc"
    if (avgScore >= 80) return "Giỏi"
    if (avgScore >= 65) return "Khá"
    if (avgScore >= 50) return "Trung bình"
    return "Yếu"
  }

  const handleExit = () => {
    router.push("/users")
  }

  return (
    <div className="space-y-6">
      {/* Back Button and Title */}
      <div className="flex items-center gap-3 mb-10">
        <Button
          onClick={handleExit}
          size="sm"
          variant="ghost"
          className="group flex items-center gap-1 border border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md transition-all"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-500 bg-clip-text text-transparent ml-2">
          Hồ sơ học sinh
        </h2>
      </div>

      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
        <CardContent className="relative z-10 p-8 flex flex-col sm:flex-row items-center gap-6">
          {user.imageUrl ? (
            <img
              src={user.imageUrl || "/assets/placeholder.svg"}
              alt={user.fullName || user.username}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="h-12 w-12 text-gray-500" />
            </div>
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">{user.fullName || user.username}</h1>
            <p className="text-white/90 text-lg">{user.username}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-white/20 text-white cursor-default">
                Xếp loại: {getPerformanceRating(userStatistic.averageScore)}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white cursor-default">
                Điểm TB: {userStatistic.averageScore}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* User Information */}
        <Card className="lg:col-span-3 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
              <UserIcon className="h-5 w-5 text-indigo-500" />
              Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700">
            <p><strong>Họ và tên:</strong> {user.fullName || "Chưa cập nhật"}</p>
            <p><strong>Email:</strong> {user.username}</p>
            <p><strong>Ngày sinh:</strong> {user.birthday ? new Date(user.birthday).toLocaleDateString("vi-VN") : "Chưa cập nhật"}</p>
            <p><strong>Vai trò:</strong> {user.userRole}</p>
            <p><strong>Ngày tham gia:</strong> {new Date(user.createdAt).toLocaleDateString("vi-VN")}</p>
          </CardContent>
        </Card>

        {/* MELA Performance */}
        <Card className="lg:col-span-3 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
              <Flame className="h-5 w-5 text-indigo-500" />
              Hiệu suất học tập
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700">
            <p><strong>Điểm trung bình:</strong> {userStatistic.averageScore || 0}</p>
            <p><strong>Streak hiện tại:</strong> {userStatistic.streak || 0} ngày</p>
            <p><strong>Streak dài nhất:</strong> {userStatistic.longestStreak || 0} ngày</p>
            <p><strong>Số chủ đề đã hỏi:</strong> {userStatistic.totalTopicsAsked || 0}</p>
            <p><strong>Số bài tập đã làm:</strong> {userStatistic.totalExercise || 0}</p>
          </CardContent>
        </Card>

        {/* Learning History */}
        <Card className="lg:col-span-6 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              Lịch sử học tập
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userStatistic.learningHistory?.length > 0 ? (
              <div className="space-y-4">
                {userStatistic.learningHistory.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-indigo-100 rounded-full">
                        {item.status === "Hoàn thành" ? (
                          <CheckCircle className="h-5 w-5 text-indigo-600" />
                        ) : (
                          <PlayCircle className="h-5 w-5 text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Hoàn thành: {new Date(item.completedAt).toLocaleDateString("vi-VN")} • {item.duration}
                        </p>
                        <p className="text-sm text-gray-600">Tiến độ: {item.progress}%</p>
                      </div>
                    </div>
                    <Badge
                      variant={item.status === "Hoàn thành" ? "default" : "secondary"}
                      className={
                        item.status === "Hoàn thành"
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-white"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Chưa có lịch sử học tập</p>
            )}
          </CardContent>
        </Card>

        {/* Chat History */}
        <Card className="lg:col-span-6 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
              <MessageSquare className="h-5 w-5 text-indigo-500" />
              Lịch sử trò chuyện AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userStatistic.chatHistory?.length > 0 ? (
              <div className="space-y-4">
                {userStatistic.chatHistory.map((chat: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{chat.title}</p>
                        <p className="text-sm text-gray-600">Chủ đề: {chat.topic}</p>
                        <p className="text-sm text-gray-600">
                          Tin nhắn gần nhất: {chat.lastMessage}
                        </p>
                        <p className="text-sm text-gray-600">
                          Thời gian: {new Date(chat.startedAt).toLocaleDateString("vi-VN")} • {chat.messages} tin nhắn
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={chat.status === "Hoàn thành" ? "default" : "secondary"}
                      className={
                        chat.status === "Hoàn thành"
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-white"
                      }
                    >
                      {chat.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Chưa có lịch sử trò chuyện</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
