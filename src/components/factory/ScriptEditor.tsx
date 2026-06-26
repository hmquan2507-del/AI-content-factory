import { Textarea } from "@/components/ui/Textarea";

type ScriptEditorProps = {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function ScriptEditor({ value, disabled, onChange }: ScriptEditorProps) {
  return (
    <div>
      <p className="text-sm font-bold text-slate-200">Script editor</p>
      <p className="mt-1 text-xs text-slate-500">Có thể sửa trực tiếp trước khi tạo voice hoặc lưu vào kho.</p>
      <div className="mt-3">
        <Textarea id="script-editor" label="Kịch bản voice-over" value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} rows={10} className="leading-7" />
      </div>
    </div>
  );
}
