// Mock data for development

export interface Section {
  ordinal_number: number;
  name: string;
  section_type: "PDF" | "TEXT" | "VIDEO";
  content: string | null;
  url: string | null;
}

export interface Lecture {
  _id: string;
  level_id: string;
  topic_id: string;
  name: string;
  ordinal_number: number;
  description: string;
  sections: Section[];
}

export interface Level {
  _id: string;
  name: string;
  description?: string;
}

export interface Topic {
  _id: string;
  name: string;
  description?: string;
}

// Mock data
const mockLevels: Level[] = [
  {
    _id: "level1",
    name: "Cơ bản",
    description: "Dành cho người mới bắt đầu"
  },
  {
    _id: "level2",
    name: "Trung bình",
    description: "Dành cho người đã có kiến thức nền tảng"
  },
  {
    _id: "level3",
    name: "Nâng cao",
    description: "Dành cho người học muốn nâng cao kiến thức"
  }
];

const mockTopics: Topic[] = [
  {
    _id: "topic1",
    name: "Đại số",
    description: "Các bài học về đại số"
  },
  {
    _id: "topic2",
    name: "Hình học",
    description: "Các bài học về hình học"
  },
  {
    _id: "topic3",
    name: "Giải tích",
    description: "Các bài học về giải tích"
  }
];

const mockLectures: Lecture[] = [
  {
    _id: "lecture1",
    level_id: "level1",
    topic_id: "topic1",
    name: "Phương trình bậc nhất",
    ordinal_number: 1,
    description: "Giới thiệu về phương trình bậc nhất và cách giải",
    sections: [
      {
        ordinal_number: 1,
        name: "Khái niệm phương trình bậc nhất",
        section_type: "TEXT",
        content: "<p>Phương trình bậc nhất có dạng: $ax + b = 0$ với $a \\neq 0$</p><p>Nghiệm của phương trình là: $x = -\\frac{b}{a}$</p><img src=\"https://example.com/images/equation.png\" alt=\"Phương trình bậc nhất\" />",
        url: null
      },
      {
        ordinal_number: 2,
        name: "Ví dụ minh họa",
        section_type: "PDF",
        content: null,
        url: "https://example.com/pdfs/phuong-trinh-bac-nhat.pdf"
      }
    ]
  },
  {
    _id: "lecture2",
    level_id: "level1",
    topic_id: "topic2",
    name: "Định lý Pytago",
    ordinal_number: 1,
    description: "Giới thiệu về định lý Pytago và ứng dụng",
    sections: [
      {
        ordinal_number: 1,
        name: "Định lý Pytago",
        section_type: "TEXT",
        content: "<p>Trong tam giác vuông, bình phương độ dài cạnh huyền bằng tổng bình phương độ dài hai cạnh góc vuông.</p><p>$c^2 = a^2 + b^2$</p><img src=\"https://example.com/images/pytago.png\" alt=\"Định lý Pytago\" />",
        url: null
      }
    ]
  },
  {
    _id: "lecture3",
    level_id: "level2",
    topic_id: "topic3",
    name: "Đạo hàm cơ bản",
    ordinal_number: 1,
    description: "Khái niệm đạo hàm và cách tính đạo hàm của một số hàm cơ bản",
    sections: [
      {
        ordinal_number: 1,
        name: "Khái niệm đạo hàm",
        section_type: "TEXT",
        content: "<p>Đạo hàm của hàm số $f(x)$ tại điểm $x_0$ được định nghĩa là:</p><p>$f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}$</p>",
        url: null
      },
      {
        ordinal_number: 2,
        name: "Bảng đạo hàm",
        section_type: "PDF",
        content: null,
        url: "https://example.com/pdfs/bang-dao-ham.pdf"
      },
      {
        ordinal_number: 3,
        name: "Video hướng dẫn",
        section_type: "VIDEO",
        content: null,
        url: "https://example.com/videos/dao-ham.mp4"
      }
    ]
  }
];

// API functions
export async function getLectures(): Promise<Lecture[]> {
  // Mock implementation - in real scenario, this would call the backend API
  return Promise.resolve(mockLectures);
}

export async function getLectureById(id: string): Promise<Lecture | undefined> {
  const lecture = mockLectures.find(lecture => lecture._id === id);
  return Promise.resolve(lecture);
}

export async function getTopics(): Promise<Topic[]> {
  // Mock implementation
  return Promise.resolve(mockTopics);
}

export async function getLevels(): Promise<Level[]> {
  // Mock implementation
  return Promise.resolve(mockLevels);
}

export async function createLecture(lectureData: Omit<Lecture, "_id">): Promise<Lecture> {
  // Mock implementation - in real scenario, this would call the backend API to create a new lecture
  console.log("Creating new lecture:", lectureData);

  // For demonstration, we'll just add an ID and return
  const newLecture: Lecture = {
    _id: `lecture${mockLectures.length + 1}`,
    ...lectureData
  };

  return Promise.resolve(newLecture);
}

export async function updateLecture(id: string, lectureData: Partial<Lecture>): Promise<Lecture> {
  // Mock implementation - in real scenario, this would call the backend API to update the lecture
  console.log(`Updating lecture ${id}:`, lectureData);

  const lectureIndex = mockLectures.findIndex(lecture => lecture._id === id);
  if (lectureIndex === -1) {
    throw new Error(`Lecture with ID ${id} not found`);
  }

  const updatedLecture: Lecture = {
    ...mockLectures[lectureIndex],
    ...lectureData
  };

  return Promise.resolve(updatedLecture);
}

export async function deleteLecture(id: string): Promise<void> {
  // Mock implementation - in real scenario, this would call the backend API to delete the lecture
  console.log(`Deleting lecture ${id}`);
  return Promise.resolve();
}

// Function to get pre-signed URLs for file uploads
export async function getPresignedUrls(files: { fileName: string, fileType: string }[]): Promise<{ presignedUrl: string, fileUrl: string }[]> {
  // Mock implementation - in real scenario, this would call the backend API to get pre-signed URLs
  console.log("Getting pre-signed URLs for files:", files);

  const urls = files.map(file => ({
    presignedUrl: `https://mock-presigned-url.com/${file.fileName}`,
    fileUrl: `https://mock-storage.com/${file.fileName}`
  }));

  return Promise.resolve(urls);
}
