import { DifficultQuestionsListClient } from "./difficult-questions-list-client"

const getDifficultQuestionData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return {
    data: [
      {
        id: "q1",
        content: "Tìm giá trị lớn nhất của hàm số f(x) = x³ - 3x² + 3 trên đoạn [-1, 3]",
        errorRate: 78,
        attempts: 245,
        level: "Lớp 12",
        topic: "Giải tích",
        lecture: {
          id: "l1",
          name: "Giải tích hàm số",
        },
        exercise: {
          id: "e1",
          name: "Cực trị của hàm số",
        },
        solution:
          "Để tìm giá trị lớn nhất của hàm số, ta cần tìm đạo hàm f'(x) = 3x² - 6x. Giải f'(x) = 0 ta được x = 0 hoặc x = 2. Kiểm tra các điểm tới hạn và biên của đoạn [-1, 3], ta có f(-1) = 1, f(0) = 3, f(2) = -1, f(3) = 3. Vậy giá trị lớn nhất là 3 tại x = 0 và x = 3.",
        hint: "Sử dụng đạo hàm để tìm điểm tới hạn, sau đó kiểm tra giá trị tại các điểm tới hạn và biên của đoạn.",
        terms: ["Đạo hàm", "Cực trị", "Điểm tới hạn", "Giá trị lớn nhất"],
      },
      {
        id: "q2",
        content: "Một cửa hàng có 48 chiếc bánh chia đều vào các hộp, mỗi hộp đựng 6 chiếc bánh. Hỏi có tất cả bao nhiêu hộp?",
        errorRate: 60,
        attempts: 520,
        level: "Lớp 2",
        topic: "Số học",
        lecture: {
          id: "l2",
          name: "Chia một số cho một số",
        },
        exercise: {
          id: "e2",
          name: "Giải bài toán bằng phép chia",
        },
        solution: "Số hộp là: 48 : 6 = 8 (hộp). Vậy có tất cả 8 hộp.",
        hint: "Muốn tìm số hộp, hãy lấy tổng số bánh chia cho số bánh trong mỗi hộp.",
        terms: ["Phép chia", "Chia đều", "Tìm số nhóm"],
      },
      {
        id: "q3",
        content: "Tính diện tích hình phẳng giới hạn bởi đường cong y = x² và đường thẳng y = 4",
        errorRate: 65,
        attempts: 312,
        level: "Lớp 12",
        topic: "Giải tích",
        lecture: {
          id: "l3",
          name: "Tích phân",
        },
        exercise: {
          id: "e3",
          name: "Ứng dụng tích phân",
        },
        solution:
          "Đường cong y = x² và đường thẳng y = 4 cắt nhau tại hai điểm có hoành độ là -2 và 2 (giải x² = 4). Diện tích cần tính là S = ∫₍₋₂₎^2 (4 - x²) dx = [4x - x³/3]₍₋₂₎^2 = (8 - 8/3) - (-8 - (-8/3)) = 8 - 8/3 + 8 + 8/3 = 16.",
        hint: "Sử dụng tích phân để tính diện tích giữa hai đường cong.",
        terms: ["Tích phân", "Diện tích", "Đường cong"],
      },
      {
        id: "q4",
        content: "Một người thợ xây dựng có một mảnh đất hình chữ nhật dùng để làm sân chơi cho học sinh. Ban đầu, người đó định lát toàn bộ sân bằng gạch vuông loại lớn, mỗi viên có diện tích 1 m². Tuy nhiên, để tiết kiệm chi phí, người thợ quyết định chỉ lát phần diện tích nằm bên dưới đường parabol y = -x² + 8x (với x tính bằng mét) và giới hạn trong đoạn từ x = 0 đến x = 8. Người thợ cần tính chính xác bao nhiêu mét vuông gạch để mua. Biết rằng trục Ox là mép cạnh đáy của sân, và trục Oy là tường nhà nên toàn bộ phần sân được xét chỉ nằm trong góc phần tư thứ nhất. Hãy tính diện tích phần sân nằm dưới đường cong đã cho, từ đó xác định diện tích gạch cần mua.",
        errorRate: 86,
        attempts: 132,
        level: "Lớp 9",
        topic: "Đại số",
        lecture: {
          id: "l4",
          name: "Diện tích hình phẳng giới hạn bởi đồ thị hàm số",
        },
        exercise: {
          id: "e4",
          name: "Tính diện tích hình phẳng",
        },
        solution: "Ta cần tính diện tích hình phẳng giới hạn bởi đồ thị hàm số y = -x² + 8x và trục hoành trong đoạn [0,8]. Diện tích này được cho bởi tích phân từ 0 đến 8 của hàm: ∫₀⁸ (-x² + 8x) dx. Tính: ∫₀⁸ (-x² + 8x) dx = [-x³/3 + 4x²]₀⁸ = [-(512/3) + 256] - 0 = 256 - 512/3 = (768 - 512)/3 = 256/3 ≈ 85.33 m². Vậy cần mua khoảng 85.33 mét vuông gạch.",
        hint: "Sử dụng tích phân để tính diện tích hình phẳng nằm dưới đồ thị hàm số trong khoảng cho trước.",
        terms: ["Hàm bậc hai", "Tích phân", "Diện tích hình phẳng", "Đồ thị hàm số", "Toán lớp 9"],
      },
      {
        id: "q5",
        content: "Tính giới hạn lim(x→0) (sin(3x)/x)",
        errorRate: 58,
        attempts: 230,
        level: "Lớp 12",
        topic: "Giải tích",
        lecture: {
          id: "l5",
          name: "Giới hạn hàm số",
        },
        exercise: {
          id: "e5",
          name: "Giới hạn của hàm số lượng giác",
        },
        solution:
          "Sử dụng giới hạn cơ bản lim(x→0) (sin(x)/x) = 1, ta có lim(x→0) (sin(3x)/x) = lim(x→0) (sin(3x)/(3x) · 3) = 3 · lim(x→0) (sin(3x)/(3x)) = 3 · 1 = 3.",
        hint: "Sử dụng giới hạn cơ bản và biến đổi biểu thức.",
        terms: ["Giới hạn", "Hàm số lượng giác", "Giới hạn cơ bản"],
      },
      {
        id: "q6",
        content: "Tìm nghiệm của phương trình 2sin²x - 3sinx + 1 = 0 trong khoảng [0, 2π]",
        errorRate: 56,
        attempts: 285,
        level: "Lớp 11",
        topic: "Lượng giác",
        lecture: {
          id: "l6",
          name: "Phương trình lượng giác",
        },
        exercise: {
          id: "e6",
          name: "Phương trình bậc hai đối với hàm số lượng giác",
        },
        solution:
          "Đặt t = sinx, ta có phương trình 2t² - 3t + 1 = 0. Giải phương trình này, ta được t = 1/2 hoặc t = 1. Vậy sinx = 1/2 hoặc sinx = 1. Từ đó, x = π/6 + 2kπ hoặc x = 5π/6 + 2kπ hoặc x = π/2 + 2kπ. Trong khoảng [0, 2π], ta có các nghiệm x = π/6, x = 5π/6, x = π/2.",
        hint: "Đặt ẩn phụ và giải phương trình bậc hai.",
        terms: ["Phương trình lượng giác", "Phương trình bậc hai", "Hàm số lượng giác"],
      },
      {
        id: "q7",
        content: "Tìm giá trị của biểu thức P = 2^(log₃(x)) khi x = 9",
        errorRate: 54,
        attempts: 210,
        level: "Lớp 10",
        topic: "Đại số",
        lecture: {
          id: "l7",
          name: "Hàm số mũ và logarit",
        },
        exercise: {
          id: "e7",
          name: "Biến đổi biểu thức mũ và logarit",
        },
        solution: "Khi x = 9, ta có P = 2^(log₃(9)). Vì log₃(9) = log₃(3²) = 2, nên P = 2^2 = 4.",
        hint: "Tính giá trị của log₃(9) trước, sau đó tính 2 mũ giá trị đó.",
        terms: ["Logarit", "Hàm số mũ", "Biến đổi biểu thức"],
      },
      {
        id: "q8",
        content: "Tính đạo hàm của hàm số f(x) = x·ln(x²+1)",
        errorRate: 52,
        attempts: 240,
        level: "Lớp 12",
        topic: "Giải tích",
        lecture: {
          id: "l8",
          name: "Đạo hàm",
        },
        exercise: {
          id: "e8",
          name: "Đạo hàm của hàm số phức tạp",
        },
        solution: "Sử dụng quy tắc tích, ta có f'(x) = 1·ln(x²+1) + x·(1/(x²+1))·2x = ln(x²+1) + 2x²/(x²+1).",
        hint: "Sử dụng quy tắc tích và quy tắc chuỗi để tính đạo hàm.",
        terms: ["Đạo hàm", "Quy tắc tích", "Quy tắc chuỗi"],
      },
      {
        id: "q9",
        content: "Giải bất phương trình (x-1)/(x+2) > 0",
        errorRate: 50,
        attempts: 320,
        level: "Lớp 9",
        topic: "Đại số",
        lecture: {
          id: "l9",
          name: "Bất phương trình",
        },
        exercise: {
          id: "e9",
          name: "Bất phương trình phân thức",
        },
        solution:
          "Để bất phương trình có nghĩa, ta cần x ≠ -2. Bất phương trình (x-1)/(x+2) > 0 xảy ra khi tử số và mẫu số cùng dấu. Tức là (x-1) và (x+2) cùng dương hoặc cùng âm. Nếu cùng dương: x > 1 và x > -2, suy ra x > 1. Nếu cùng âm: x < 1 và x < -2, suy ra x < -2. Vậy nghiệm của bất phương trình là x ∈ (-∞, -2) ∪ (1, +∞).",
        hint: "Xét dấu của tử số và mẫu số, nhớ loại trừ giá trị làm mẫu số bằng 0.",
        terms: ["Bất phương trình", "Phân thức", "Dấu của biểu thức"],
      },
      {
        id: "q702",
        content: "Một đội công nhân được giao nhiệm vụ lát một con đường dài 180 mét. Nếu cả đội làm việc theo đúng kế hoạch ban đầu thì sẽ hoàn thành công việc trong 6 ngày. Tuy nhiên, sau 2 ngày đầu làm việc, do có thêm người được điều đến hỗ trợ nên tốc độ làm việc tăng lên, khiến công việc hoàn thành sớm hơn kế hoạch 1 ngày. Biết rằng năng suất làm việc của mỗi người là như nhau và không thay đổi, hãy lập phương trình để tìm số công nhân ban đầu của đội, biết rằng số người được tăng cường sau 2 ngày là 3 người. Giải bài toán và kết luận đội công nhân ban đầu có bao nhiêu người.",
        errorRate: 91,
        attempts: 114,
        level: "Lớp 8",
        topic: "Giải bài toán bằng cách lập phương trình",
        lecture: {
          id: "l702",
          name: "Lập phương trình từ bài toán thực tế",
        },
        exercise: {
          id: "e702",
          name: "Công việc - Năng suất - Thời gian",
        },
        solution: "Gọi số công nhân ban đầu là x (người), năng suất của mỗi người là a mét/ngày. Tổng công việc là 180 mét. Trong 2 ngày đầu, đội làm được: 2·x·a mét. Số công việc còn lại: 180 - 2xa. Từ ngày thứ 3 trở đi, đội có x + 3 người, và họ hoàn thành phần còn lại trong (6 - 2 - 1) = 3 ngày. Phương trình: (x + 3)·a·3 = 180 - 2xa. Giải hệ phương trình với 2 ẩn x và a sẽ tìm được x = 10.",
        hint: "Gọi ẩn là số công nhân ban đầu, thiết lập biểu thức cho khối lượng công việc, rồi lập phương trình tổng quát.",
        terms: ["Lập phương trình", "Năng suất", "Công việc", "Thời gian", "Toán có lời văn"],
      }
    ]
  }
}

export async function DifficultQuestionsList() {
  const { data } = await getDifficultQuestionData();

  return <DifficultQuestionsListClient data={data} />;
}
