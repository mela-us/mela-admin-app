import { useMemo, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  ImageIcon,
  Italic,
  Plus,
  Sigma,
  Underline,
  X,
} from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { ScrollArea } from '../../ui/scroll-area';
import { Separator } from '../../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

export default function MathEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  height = 'h-32',
  uploadedImages,
  onImageUpload,
}) {
  const [activeTab, setActiveTab] = useState('edit');
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
  const [isLatexPopoverOpen, setIsLatexPopoverOpen] = useState(false);
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  const latexFormulas = [
    { name: 'Phân số', formula: '\\frac{a}{b}' },
    { name: 'Căn bậc hai', formula: '\\sqrt{x}' },
    { name: 'Căn bậc n', formula: '\\sqrt[n]{x}' },
    { name: 'Số mũ', formula: 'x^{n}' },
    { name: 'Chỉ số dưới', formula: 'x_{i}' },
    { name: 'Tổng', formula: '\\sum_{i=1}^{n} x_i' },
    { name: 'Tích', formula: '\\prod_{i=1}^{n} x_i' },
    { name: 'Giới hạn', formula: '\\lim_{x \\to a} f(x)' },
    { name: 'Đạo hàm', formula: '\\frac{d}{dx}f(x)' },
    { name: 'Tích phân', formula: '\\int_{a}^{b} f(x) dx' },
    { name: 'Ma trận', formula: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    { name: 'Hệ phương trình', formula: '\\begin{cases} a + b = c \\\\ d + e = f \\end{cases}' },
    { name: 'Logarit', formula: '\\log_{a}(b)' },
    { name: 'Góc', formula: '\\angle ABC' },
    { name: 'Tam giác', formula: '\\triangle ABC' },
    { name: 'Độ', formula: '90^{\\circ}' },
    { name: 'Vô cùng', formula: '\\infty' },
    { name: 'Thuộc', formula: 'a \\in A' },
    { name: 'Không thuộc', formula: 'a \\notin A' },
    { name: 'Tập hợp', formula: '\\{x \\in X | P(x)\\}' },
    { name: 'Hợp', formula: 'A \\cup B' },
    { name: 'Giao', formula: 'A \\cap B' },
    { name: 'Tập rỗng', formula: '\\emptyset' },
    { name: 'Tập số thực', formula: '\\mathbb{R}' },
    { name: 'Tập số nguyên', formula: '\\mathbb{Z}' },
    { name: 'Tập số tự nhiên', formula: '\\mathbb{N}' },
    { name: 'Tập số hữu tỉ', formula: '\\mathbb{Q}' },
    { name: 'Tập số phức', formula: '\\mathbb{C}' },
    { name: 'Ước lượng', formula: '\\approx' },
    { name: 'Bằng', formula: '=' },
    { name: 'Khác', formula: '\\neq' },
    { name: 'Nhỏ hơn', formula: '<' },
    { name: 'Lớn hơn', formula: '>' },
    { name: 'Nhỏ hơn hoặc bằng', formula: '\\leq' },
    { name: 'Lớn hơn hoặc bằng', formula: '\\geq' },
    { name: 'Tương đương', formula: '\\equiv' },
    { name: 'Cộng trừ', formula: '\\pm' },
    { name: 'Nhân', formula: '\\times' },
    { name: 'Chia', formula: '\\div' },
    { name: 'Dấu suy ra', formula: '\\Rightarrow' },
    { name: 'Dấu tương đương', formula: '\\Leftrightarrow' },
    { name: 'Dấu mũ', formula: '\\hat{a}' },
    { name: 'Dấu gạch ngang', formula: '\\bar{a}' },
    { name: 'Dấu gạch dưới', formula: '\\underline{a}' },
    { name: 'Dấu ngã', formula: '\\tilde{a}' },
    { name: 'Dấu vec-tơ', formula: '\\vec{a}' },
  ];

  const previewHtml = useMemo(() => {
    if (activeTab !== 'preview') return '';

    let html = value;
    html = html.replace(/<latex>(.*?)<\/latex>/g, (match, latex) => {
      try {
        const rendered = katex.renderToString(latex, {
          displayMode: false,
          throwOnError: false,
        });
        return `<span class="inline-block">${rendered}</span>`;
      } catch (error) {
        return `<div class="inline-block px-2 py-1 bg-red-100 text-red-800 rounded font-mono">Error: ${error.message}</div>`;
      }
    });

    html = html.replace(/<br>/g, '<br />');
    return html;
  }, [value, activeTab]);

  const insertText = (before, after = '') => {
    if (!editorRef.current) return;

    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    setTimeout(() => {
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const insertLatex = (formula) => {
    insertText(`<latex>${formula}</latex>`);
  };

  const insertHtmlTag = (openTag, closeTag) => {
    insertText(openTag, closeTag);
  };

  const handleImageSelect = async (e) => {
    if (
      e.target.files &&
      e.target.files.length > 0 &&
      VALID_IMAGE_TYPES.includes(e.target.files[0].type) &&
      e.target.files[0].size <= MAX_FILE_SIZE
    ) {
      const file = e.target.files[0];
      const imageUrl = await onImageUpload(file);
      if (imageUrl) {
        insertText(`<img src='${imageUrl}'>`);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="border rounded-md shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between border-b px-3 bg-gray-50">
          <TabsList className="grid w-48 grid-cols-2 bg-gray-200/70">
            <TabsTrigger value="edit" className="data-[state=active]:bg-violet-300/80">
              Soạn thảo
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-violet-300/80">
              Xem trước
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="max-w-[calc(100%-200px)]">
            <div className="flex items-center space-x-2 py-2">
              <div className="flex items-center space-x-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => insertText('<b>', '</b>')} className="h-9 w-9">
                        <Bold className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>In đậm</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => insertText('<i>', '</i>')} className="h-9 w-9">
                        <Italic className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>In nghiêng</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => insertText('<u>', '</u>')} className="h-9 w-9">
                        <Underline className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Gạch chân</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => insertText('<br>')} className="h-9 w-9">
                        <span className="text-sm font-bold">BR</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Xuống dòng</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center space-x-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => insertHtmlTag('<div style="text-align: left;">', '</div>')}
                        className="h-9 w-9"
                      >
                        <AlignLeft className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Căn trái</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => insertHtmlTag('<div style="text-align: center;">', '</div>')}
                        className="h-9 w-9"
                      >
                        <AlignCenter className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Căn giữa</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => insertHtmlTag('<div style="text-align: right;">', '</div>')}
                        className="h-9 w-9"
                      >
                        <AlignRight className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Căn phải</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center space-x-1">
                <Popover open={isLatexPopoverOpen}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-9 w-9 ${isLatexPopoverOpen ? 'bg-red-500/50 hover:bg-red-500/80' : 'hover:bg-gray-200'}`}
                            onClick={() => {
                              setIsLatexPopoverOpen((prev) => !prev);
                              setIsImagePopoverOpen(false);
                            }}
                          >
                            <Sigma className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Công thức toán học</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <PopoverContent className="w-[300px] p-0" align="start" sideOffset={5}>
                    <div className="p-3 border-b">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">Chèn công thức</h4>
                          <p className="text-xs text-muted-foreground">Chọn hoặc nhập trực tiếp công thức</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsLatexPopoverOpen(false)}
                          className="w-8 h-8 mt-1 text-gray-900"
                        >
                          <X className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                    <div
                      onWheel={(e) => {
                        e.stopPropagation();
                      }}
                      className="max-h-[200px] overflow-y-auto"
                    >
                      <div className="p-2">
                        {latexFormulas.map((item) => (
                          <Button
                            key={item.name}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-between h-auto py-2 px-3 mb-1"
                            onClick={() => insertLatex(item.formula)}
                          >
                            <span className="text-muted-foreground text-sm">{item.name}</span>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: katex.renderToString(item.formula, { throwOnError: false }),
                              }}
                              className="text-blue-700"
                            />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover open={isImagePopoverOpen}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setIsImagePopoverOpen((prev) => !prev);
                              setIsLatexPopoverOpen(false);
                            }}
                            className={`h-9 w-9 ${isImagePopoverOpen ? 'bg-red-500/50 hover:bg-red-500/80' : 'hover:bg-gray-200'}`}
                          >
                            <ImageIcon className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Chèn ảnh</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <PopoverContent className="w-[350px] p-0" align="start" sideOffset={5}>
                    <Tabs defaultValue="upload" className="w-full">
                      <div className="p-3 border-b">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-sm">Chèn hình ảnh</h4>
                            <p className="text-xs text-muted-foreground">Tải lên hoặc chọn hình ảnh đã tải</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsImagePopoverOpen(false)}
                            className="w-8 h-8 mt-1 text-gray-900"
                          >
                            <X className="w-6 h-6" />
                          </Button>
                        </div>
                        <TabsList className="mt-2 grid w-full grid-cols-2">
                          <TabsTrigger value="upload">Tải lên</TabsTrigger>
                          <TabsTrigger value="gallery">Kho ảnh ({uploadedImages.length})</TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value="upload" className="p-3 space-y-3">
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            className="w-full h-32 border-dashed flex flex-col gap-2"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Chọn hình ảnh để tải lên</span>
                          </Button>
                          <Input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            accept={VALID_IMAGE_TYPES.join(',')}
                            className="hidden"
                            title="add images"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          Hỗ trợ các định dạng: JPG, PNG, SVG, JPEG
                        </p>
                      </TabsContent>

                      <TabsContent value="gallery" className="p-0">
                        <div
                          onWheel={(e) => {
                            e.stopPropagation();
                          }}
                          className="max-h-[180px] overflow-y-auto"
                        >
                          {uploadedImages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                              <ImageIcon className="h-8 w-8 mb-2 opacity-30" />
                              <p className="text-sm">Chưa có hình ảnh nào</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2 p-3">
                              {uploadedImages.map((url) => (
                                <div key={url} className="relative group border rounded-md overflow-hidden bg-gray-50">
                                  <div className="aspect-square w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => insertText(`<img src='${url}'>`)}
                                      className="w-20 h-7 text-xs gap-1"
                                    >
                                      <Plus className="h-4 w-4" />
                                      Chèn
                                    </Button>
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                                    <p className="text-white text-xs truncate">
                                      {url?.split('/').pop()?.substring(0, 12) || 'image'}...
                                    </p>
                                  </div>
                                  <div className="absolute top-1 right-1">
                                    <Badge className="bg-green-500 text-white h-5 px-1.5">
                                      <Check className="h-3 w-3" />
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </ScrollArea>
        </div>

        <TabsContent value="edit" className="p-0 m-0">
          <textarea
            ref={editorRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full ${height} p-3 focus:outline-none resize-none font-mono text-sm`}
          />
        </TabsContent>

        <TabsContent value="preview" className="p-0 m-0">
          <div
            ref={previewRef}
            className={`w-full ${height} p-3 overflow-auto bg-gray-50 [&_img]:max-w-[300px] [&_img]:max-h-[300px] [&_img]:object-contain [&_img]:inline-block [&_img]:align-bottom`}
            style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
