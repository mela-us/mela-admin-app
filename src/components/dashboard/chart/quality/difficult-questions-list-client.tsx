"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, BookOpen, ChevronDown, ChevronUp, FileText, HelpCircle, Lightbulb, Users, BookOpenText, Omega } from "lucide-react"

interface DifficultQuestion {
  id: string
  content: string
  errorRate: number
  attempts: number
  level: string
  topic: string
  lecture: {
    id: string
    name: string
  }
  exercise: {
    id: string
    name: string
  }
  solution?: string
  hint?: string
  terms?: string[]
}

interface Props {
  data: DifficultQuestion[]
}

export function DifficultQuestionsListClient({ data }: Props) {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null)
  const questions = data;

  const toggleExpand = (questionId: string) => {
    setExpandedQuestionId(expandedQuestionId === questionId ? null : questionId)
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-2 text-blue-600">Top 10 câu hỏi sai nhiều nhất</CardTitle>
        <CardDescription>Các câu hỏi trên hệ thống có tỉ lệ làm sai cao nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {questions.map((question, index) => {
            const isExpanded = expandedQuestionId === question.id
            const contentPreview = question.content.length > 125 ? question.content.substring(0, 125) + "..." : question.content
            return (
              <div
                key={question.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer border border-gray-200"
                onClick={() => toggleExpand(question.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="font-bold bg-purple-200 text-purple-800 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="font-bold text-gray-800 line-clamp-1">{contentPreview}</div>
                    <div className="flex flex-wrap gap-2 py-1">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-2 py-1">
                        {question.level}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-2 py-1">
                        {question.topic}
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-2 py-1">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {question.lecture.name}
                      </Badge>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-2 py-1">
                        <FileText className="h-3 w-3 mr-1" />
                        {question.exercise.name}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-red-500 font-base">Tỉ lệ sai: {question.errorRate}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-blue-500 font-base">{question.attempts.toLocaleString()} lượt làm</span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t-1 border-gray-300 animate-in duration-300 bg-gray-50 p-4 rounded-md border">
                        <div className="space-y-5 py-2">
                          <div className="flex items-start gap-2">
                            <HelpCircle className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0 min-w-[16px]" />
                            <div className="w-full">
                              <h4 className="text-sm font-medium mb-2 text-gray-900">Đề bài</h4>
                              <p className="text-sm text-gray-700">{question.content}</p>
                            </div>
                          </div>
                          {question.solution && (
                            <div className="border-t border-gray-200 pt-3">
                              <div className="flex items-start gap-2">
                                <BookOpenText className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0 min-w-[16px]" />
                                <div className="w-full">
                                  <h4 className="text-sm font-medium mb-2 text-gray-900">Lời giải</h4>
                                  <p className="text-sm text-gray-700">{question.solution}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          {question.hint && (
                            <div className="border-t border-gray-200 pt-3">
                              <div className="flex items-start gap-2">
                                <Lightbulb className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0 min-w-[16px]" />
                                <div className="w-full">
                                  <h4 className="text-sm font-medium mb-2 text-gray-900">Gợi ý</h4>
                                  <p className="text-sm text-gray-700">{question.hint}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          {question.terms && question.terms.length > 0 && (
                            <div className="border-t border-gray-200 pt-3">
                              <div className="flex items-start gap-2">
                                <Omega className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0 min-w-[16px]" />
                                <div className="w-full">
                                  <h4 className="text-sm font-medium mb-2 text-gray-900">Thuật ngữ liên quan</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {question.terms.map((term, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs font-normal bg-pink-100 text-pink-600 px-2 py-1">
                                        {term}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toggleExpand(question.id); }}>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
