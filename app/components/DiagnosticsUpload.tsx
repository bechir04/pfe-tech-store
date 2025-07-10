import React, { useRef } from 'react';

export type DiagnosticsData = {
  reportUrl?: string;
  summary?: string;
};

type Props = {
  value: DiagnosticsData;
  onChange: (data: DiagnosticsData) => void;
};

export default function DiagnosticsUpload({ value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...value, reportUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">Rapport de diagnostic (PDF/Image)</label>
      <input
        type="file"
        accept="application/pdf,image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="block w-full border border-gray-300 rounded px-2 py-1"
      />
      {value.reportUrl && (
        <div className="mt-2">
          {value.reportUrl.startsWith('data:application/pdf') ? (
            <a href={value.reportUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Voir le PDF</a>
          ) : (
            <img src={value.reportUrl} alt="Diagnostic" className="max-h-32 rounded" />
          )}
        </div>
      )}
      <label className="block font-medium mt-2">Résumé du diagnostic</label>
      <textarea
        className="w-full border border-gray-300 rounded px-2 py-1"
        rows={3}
        value={value.summary || ''}
        onChange={e => onChange({ ...value, summary: e.target.value })}
        placeholder="Ex: Batterie 95%, écran sans rayures, testé le 2024-05-01..."
      />
    </div>
  );
} 