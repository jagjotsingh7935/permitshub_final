import { useId, useState } from 'react'
import { Check } from 'lucide-react'

/** A tick-as-you-go list. State stays in the browser tab and is never stored or sent. */
export function Checklist({ title, items, note }: { title: string; items: string[]; note?: string }) {
  const [checked, setChecked] = useState<number[]>([])
  const statusId = useId()
  function toggle(index: number) {
    setChecked(current => (current.includes(index) ? current.filter(item => item !== index) : [...current, index]))
  }
  return (
    <fieldset className="checklist" aria-describedby={statusId}>
      <legend>{title}</legend>
      <div className="checklist__items">
        {items.map((item, index) => (
          <label key={item} className={`checklist__item ${checked.includes(index) ? 'is-checked' : ''}`}>
            <input type="checkbox" checked={checked.includes(index)} onChange={() => toggle(index)} />
            <span className="checklist__box" aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
            <span>{item}</span>
          </label>
        ))}
      </div>
      <p className="checklist__status" id={statusId} aria-live="polite">
        {checked.length} of {items.length} ready{note ? `. ${note}` : ''}
      </p>
    </fieldset>
  )
}
