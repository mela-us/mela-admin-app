import type React from "react"

import { BarChart3 } from "lucide-react"
import TopicList from "@/components/topics/topic-list"

async function getTopics() {
  // const res = await fetchWithAuth(`${process.env.BACKEND_URL}/api/topics`, {
  //   cache: "no-store",
  // })
  // if (!res.ok) {
  //   throw new Error("Failed to fetch topics")
  // }
  // return res.json()
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    data: [
      {
        topicId: "0af2634d-1f55-457b-b933-e0ad8749d133",
        name: "Hình học",
        imageUrl: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/topics/images/HinhHoc.png"
      },
      {
        topicId: "11980eac-fdc5-4e4e-bb47-b069532b0f54",
        name: "Tổ hợp",
        imageUrl: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/topics/images/ToHop.png"
      },
      {
        topicId: "a59ba7ff-15e4-4f8f-bd18-07a7f35c1788",
        name: "Tư duy",
        imageUrl: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/topics/images/TuDuy.png"
      },
      {
        topicId: "3ce16420-f9a5-4e1c-ae3a-e97124f03206",
        name: "Đại số",
        imageUrl: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/topics/images/DaiSo.png"
      },
      {
        topicId: "206eb409-4078-40b1-9024-185b2c360645",
        name: "Số học",
        imageUrl: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/topics/images/SoHoc.png"
      },
      {
        topicId: "c7679a40-4fdc-48d7-bfef-d4ec39872860",
        name: "Xác suất và thống kê",
        imageUrl: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/topics/images/XacSuatThongKe.png"
      }
    ]
  }
}

export default async function TopicsPage() {
  const { data } = await getTopics()

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-400 relative rounded-xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Quản lý chủ đề</h1>
          <p className="text-blue-100 max-w-2xl">
            Quản lý các chủ đề toán học trong hệ thống MELA.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20">
          <BarChart3 size={180} />
        </div>
      </div>

      {/* Topic List Component */}
      <TopicList data={data} />
    </div>
  )
}
