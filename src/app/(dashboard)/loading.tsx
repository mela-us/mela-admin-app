"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-gray-100">
      <div className="bg-gradient-to-br from-blue-50 via-indigo-200 to-purple-300 rounded-2xl shadow-[0_0_30px_rgba(100,100,255,0.2)] border border-indigo-400/70 p-10 w-[90%] max-w-md flex flex-col items-center">
        {/* Spinner layers */}
        <div className="relative mb-6">
          <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-500 border-r-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 border-4 border-purple-100 border-b-purple-500 border-l-indigo-400 rounded-full animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
        </div>

        {/* Floating elements */}
        <div className="relative w-48 h-36 mb-4">
          <motion.div className="absolute top-0 left-0 w-2 h-2 bg-blue-400 rounded-full"
            animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute top-5 right-8 w-3 h-3 bg-purple-400 rounded-full"
            animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />
          <motion.div className="absolute bottom-10 left-10 w-4 h-4 bg-indigo-400 rounded-full"
            animate={{ y: [0, -12, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} />
          <motion.div className="absolute bottom-5 right-5 w-2 h-2 bg-blue-300 rounded-full"
            animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }} />
        </div>

        {/* Loading text */}
        <div className="relative">
          <h3 className="text-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Đang tải dữ liệu
          </h3>
          <motion.div
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </div>

        <p className="mt-2 text-sm text-gray-600">Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  )
}
