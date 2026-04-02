import ExperienceCard from "./ExperienceCard.jsx";

export default function ExperienceList({ experiences, editingIndex, onEdit, onDelete, onMove, onAdd, onChange }) {
  return (
    <div>
      {experiences.map((item, index) => (
        <ExperienceCard
          key={item.id}
          item={item}
          isEditing={editingIndex === index}
          onEdit={() => onEdit(index)}
          onDelete={() => onDelete(index)}
          onMove={() => onMove(index)}
          onChange={(nextItem) => onChange(index, nextItem)}
        />
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center rounded-[12px] border-2 border-dashed border-[#6366F1] px-5 py-4 text-[16px] font-semibold text-[#6366F1]"
      >
        + Add more experience
      </button>
    </div>
  );
}
