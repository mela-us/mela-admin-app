import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Topic {
  topicId: string
  name: string
  imageUrl: string
}

interface TopicCardProps {
  topic: Topic
  onEdit: () => void
  onDelete: (id: string) => void
}

export default function TopicCard({ topic, onEdit, onDelete }: TopicCardProps) {
  return (
    <Card className="overflow-hidden border-t-4 border-t-blue-500 transition-all duration-300 hover:shadow-xl rounded-xl">
      <div className="relative h-64 w-full">
        <Image
          src={topic.imageUrl || "/assets/placeholder.svg"}
          alt={topic.name}
          fill
          className="object-cover transition-opacity duration-300 hover:opacity-90"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/assets/placeholder.svg"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <CardContent className="p-5 bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{topic.name}</h3>
          <div className="flex space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
            >
              <Pencil className="h-5 w-5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa chủ đề "{topic.name}"? Hành động này không thể hoàn tác và có thể ảnh hưởng đến các bài học và bài luyện tập liên quan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:bg-gray-100">Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(topic.topicId)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
