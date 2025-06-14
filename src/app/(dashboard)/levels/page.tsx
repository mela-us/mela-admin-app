import type React from "react"

import { BarChart3 } from "lucide-react"
import LevelList from "@/components/levels/level-list"

async function getLevels() {
  // const res = await fetchWithAuth(`${process.env.BACKEND_URL}/api/levels`, {
  //   cache: "no-store",
  // })
  // if (!res.ok) {
  //   throw new Error("Failed to fetch levels")
  // }
  // return res.json()
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    data: [
      {
        levelId: "a7e03165-05fc-4e82-b69b-2874aa006caf",
        name: "Lớp 1",
        imageUrl: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/levels/images/Lop1.png"
      },
      {
        levelId: "cba0ad0e-1f70-412c-a710-a2fef4582ff2",
        name: "Lớp 2",
        imageUrl: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/levels/images/Lop2.png"
      },
      {
        levelId: "29c90036-403f-46ff-bf64-18de1553a7f4",
        name: "Lớp 3",
        imageUrl: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/levels/images/Lop3.png"
      },
      {
        levelId: "df127251-4fd9-44f7-8700-d1b648a1efc5",
        name: "Lớp 4",
        imageUrl: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/levels/images/Lop4.png"
      },
      {
        levelId: "c9dcb3d7-c80c-4431-afd7-c727c8e5ee5b",
        name: "Lớp 5",
        imageUrl: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/levels/images/Lop5.png"
      },
      {
        levelId: "0f29791a-f7c6-4c6c-9031-850d21f11d32",
        name: "Lớp 6",
        imageUrl: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/levels/images/Lop6.png"
      },
      {
        levelId: "6667b3ca-5f14-4736-b369-b9355144a90b",
        name: "Lớp 7",
        imageUrl: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/levels/images/Lop7.png"
      },
      {
        levelId: "64875f62-262a-4b6d-b94f-484aa30f5f46",
        name: "Lớp 8",
        imageUrl: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/levels/images/Lop8.png"
      },
      {
        levelId: "0f647e26-bfa7-4730-8f76-b508160170d8",
        name: "Lớp 9",
        imageUrl: "https://mela-storage-dev.s3.ap-southeast-1.amazonaws.com/levels/images/Lop9.png"
      }
    ]
  }
}

export default async function LevelsPage() {
  const { data } = await getLevels()

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-400 relative rounded-xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Quản lý cấp độ</h1>
          <p className="text-blue-100 max-w-2xl">
            Quản lý các cấp độ học tập trong hệ thống MELA.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20">
          <BarChart3 size={180} />
        </div>
      </div>

      {/* Level List Component */}
      <LevelList data={data} />
    </div>
  )
}
