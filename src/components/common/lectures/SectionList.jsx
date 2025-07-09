import { useCallback, useEffect, useRef, useState } from 'react';
import SectionItem from './SectionItem';
import { CirclePlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';

function SectionList({ sections, onChange }) {
  const [openSections, setOpenSections] = useState({});
  const sectionRefs = useRef([]);

  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, sections.length);
  }, [sections.length]);

  const handleToggleSection = useCallback((ordinalNumber) => {
    setOpenSections((prev) => ({
      ...prev,
      [ordinalNumber]: !prev[ordinalNumber],
    }));
  }, []);

  const handleMoveSection = useCallback(
    (fromIndex, toIndex) => {
      if (fromIndex === toIndex) return;

      const newSections = [...sections];
      const [movedItem] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, movedItem);

      const updatedSections = newSections.map((section, i) => ({
        ...section,
        ordinalNumber: i + 1,
      }));

      onChange(updatedSections);
    },
    [sections, onChange],
  );

  const handleMoveUp = useCallback(
    (index) => {
      if (index > 0) {
        handleMoveSection(index, index - 1);
      }
    },
    [handleMoveSection],
  );

  const handleMoveDown = useCallback(
    (index) => {
      if (index < sections.length - 1) {
        handleMoveSection(index, index + 1);
      }
    },
    [handleMoveSection, sections.length],
  );

  const handleAddSection = useCallback(() => {
    const newSection = {
      ordinalNumber: sections.length + 1,
      name: '',
      sectionType: 'PDF',
      content: null,
      url: null,
      file: null,
      fileName: null,
    };
    onChange([...sections, newSection]);
    setOpenSections((prev) => ({ ...prev, [newSection.ordinalNumber]: false }));
  }, [sections, onChange]);

  const handleRemoveSection = useCallback(
    (index) => {
      const section = sections[index];
      if (section.isNewFile && section.url) {
        URL.revokeObjectURL(section.url);
      }
      const updatedSections = sections
        .filter((_, i) => i !== index)
        .map((section, idx) => ({ ...section, ordinalNumber: idx + 1 }));
      onChange(updatedSections);

      setOpenSections((prev) => {
        const newOpenSections = { ...prev };
        delete newOpenSections[sections[index].ordinalNumber];
        return newOpenSections;
      });
    },
    [sections, onChange],
  );

  const handleUpdateSection = useCallback(
    (index, updatedSection) => {
      const updatedSections = [...sections];
      updatedSections[index] = updatedSection;
      onChange(updatedSections);
    },
    [sections, onChange],
  );

  return (
    <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
      <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
        <CardTitle className="text-xl font-bold text-gray-700/90">Danh sách section</CardTitle>
        <CardDescription className="text-gray-700/90">Nhập thông tin cho các section</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {sections.length === 0 ? (
          <p className="text-indigo-600/70 text-sm mb-4">Chưa có section. Hãy thêm section và điền đầy đủ thông tin.</p>
        ) : (
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div
                key={section.ordinalNumber}
                ref={(el) => {
                  sectionRefs.current[index] = el;
                }}
              >
                <SectionItem
                  section={section}
                  index={index}
                  isOpen={!!openSections[section.ordinalNumber]}
                  isFirst={index === 0}
                  isLast={index === sections.length - 1}
                  onToggle={() => handleToggleSection(section.ordinalNumber)}
                  onUpdate={(updatedSection) => handleUpdateSection(index, updatedSection)}
                  onRemove={() => handleRemoveSection(index)}
                  onMoveUp={() => handleMoveUp(index)}
                  onMoveDown={() => handleMoveDown(index)}
                />
              </div>
            ))}
          </div>
        )}
        <div
          className="group relative border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50/30 transition-all cursor-pointer mt-4"
          onClick={handleAddSection}
        >
          <div className="flex items-center justify-center py-6 px-4">
            <div className="flex items-center space-x-2 text-gray-500 group-hover:text-pink-600">
              <CirclePlus className="h-5 w-5" />
              <span className="text-sm font-medium">Thêm section mới</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SectionList;
