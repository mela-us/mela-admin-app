import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CirclePlus } from "lucide-react";
import type { Section } from "@/types/lecture";
import SectionItem from "./section-item";

interface Props {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

export default function SectionList({ sections, onChange }: Props) {
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // useEffect(() => {
  //   if (sections.length > 0 && Object.keys(openSections).length === 0) {
  //     setOpenSections({ [sections[0].ordinalNumber]: true });
  //   }
  // }, [sections]);

  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, sections.length);
  }, [sections.length]);

  const handleToggleSection = useCallback((ordinalNumber: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [ordinalNumber]: !prev[ordinalNumber],
    }));
  }, []);

  const handleMoveSection = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newSections = [...sections];
    const [movedItem] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedItem);

    const updatedSections = newSections.map((section, i) => ({
      ...section,
      ordinalNumber: i + 1,
    }));

    onChange(updatedSections);
  }, [sections, onChange]);

  const handleMoveUp = useCallback((index: number) => {
    if (index > 0) {
      handleMoveSection(index, index - 1);
    }
  }, [handleMoveSection]);

  const handleMoveDown = useCallback((index: number) => {
    if (index < sections.length - 1) {
      handleMoveSection(index, index + 1);
    }
  }, [handleMoveSection, sections.length]);

  const handleAddSection = useCallback(() => {
    const newSection: Section = {
      ordinalNumber: sections.length + 1,
      name: "",
      sectionType: "PDF",
      content: null,
      url: null,
      file: null,
      fileName: null,
    };
    onChange([...sections, newSection]);
    setOpenSections((prev) => ({ ...prev, [newSection.ordinalNumber]: false }));
  }, [sections, onChange]);

  const handleRemoveSection = useCallback((index: number) => {
    const section = sections[index];
    if (section.isNewFile) {
      console.log(`Deleting file from store: ${section.url}`);
      // delete from temporary storage
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
  }, [sections, onChange]);

  const handleUpdateSection = useCallback((index: number, updatedSection: Section) => {
    const updatedSections = [...sections];
    updatedSections[index] = updatedSection;
    onChange(updatedSections);
  }, [sections, onChange]);

  return (
    <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
      <CardHeader className="bg-indigo-300/50 border-b border-indigo-200 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold text-gray-800/90 pb-1">Danh sách section</CardTitle>
          <CardDescription className="text-gray-700/90">Nhập thông tin cho các section thuộc lecture</CardDescription>
        </div>
        <Button
          onClick={handleAddSection}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md shadow transition-all duration-200"
        >
          <CirclePlus className="h-4 w-4 mr-2" />
          Thêm section
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {sections.length === 0 ? (
          <p className="text-indigo-600/70 text-sm">Chưa có section. Hãy thêm section và điền đầy đủ thông tin.</p>
        ) : (
          <motion.div
            className="space-y-4"
            layout
          >
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
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
