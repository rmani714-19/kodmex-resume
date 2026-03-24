import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillsTagInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  minItems?: number;
  placeholder?: string;
  className?: string;
}

export function SkillsTagInput({ skills, onChange, minItems = 3, placeholder = "Type a skill and press Enter...", className }: SkillsTagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newSkill = inputValue.trim();
      if (newSkill && !skills.includes(newSkill)) {
        onChange([...skills, newSkill]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && skills.length > 0) {
      onChange(skills.slice(0, -1));
    }
  };

  const removeSkill = (indexToRemove: number) => {
    onChange(skills.filter((_, index) => index !== indexToRemove));
  };

  const isValid = skills.length >= minItems;

  return (
    <div className={cn("space-y-2", className)}>
      <div 
        className={cn(
          "flex flex-wrap gap-2 p-2 border rounded-xl bg-card min-h-[48px] items-center transition-all duration-300",
          !isValid && skills.length > 0 ? "border-destructive/50" : "border-border",
          "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm"
        )}
      >
        {skills.map((skill, index) => (
          <span 
            key={index} 
            className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full text-xs font-medium"
          >
            {skill}
            <button 
              type="button"
              onClick={() => removeSkill(index)}
              className="text-primary hover:text-primary/70 focus:outline-none transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none min-w-[120px] text-sm text-foreground placeholder:text-muted-foreground"
          placeholder={skills.length === 0 ? placeholder : "Add more..."}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className={cn(
          "transition-colors",
          !isValid ? "text-destructive" : "text-success"
        )}>
          {skills.length} / {minItems} required
        </span>
      </div>
    </div>
  );
}
