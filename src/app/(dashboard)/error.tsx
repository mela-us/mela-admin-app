"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-50 px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-rose-50 border border-red-300 rounded-xl shadow-xl p-8 max-w-lg w-full text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full shadow-inner">
            <AlertCircle className="text-red-600 w-10 h-10" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-red-600 mb-2">Đã xảy ra lỗi</h2>
        <p className="text-gray-700">
          Không thể tải dữ liệu dashboard. Vui lòng thử lại sau hoặc liên hệ với quản trị viên nếu sự cố vẫn tiếp diễn.
        </p>

        <Button
          onClick={() => reset()}
          className="mt-6 px-6 py-2 text-white bg-red-500 hover:bg-red-600 transition-colors duration-300 rounded-full"
        >
          Thử lại
        </Button>
      </motion.div>
    </div>
  )
}
