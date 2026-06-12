export default function SkillSlider({ label, name, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-sm font-medium text-gray-700 capitalize">{label}</span>
      <input
        type="range" min={0} max={10} step={1}
        value={value}
        onChange={e => onChange(name, Number(e.target.value))}
        className="flex-1 accent-blue-600"
      />
      <span className="w-6 text-center text-sm font-bold text-blue-600">{value}</span>
    </div>
  )
}
