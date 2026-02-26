import { useState, useEffect, useMemo } from 'react';
import { Copy, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FIELDS } from './constants';

const BRAND_COLORS = {
  primary: '#00C2FF',
  dark: '#220D4E',
  accent: '#7B5EA7',
  textSecondary: '#6b7280',
  border: '#e2e8f0',
};

export default function App() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [freeTextError, setFreeTextError] = useState('');

  // Initialize form data with empty strings
  useEffect(() => {
    const initialData: Record<string, string> = {};
    FIELDS.forEach((field) => {
      initialData[field.id] = '';
    });
    setFormData(initialData);
  }, []);

  const handleInputChange = (id: string, value: string) => {
    if (id === 'freeText') {
      if (value.includes(' ')) {
        setFreeTextError('No spaces allowed');
      } else if (value.length > 30) {
        setFreeTextError('Max 30 characters');
      } else {
        setFreeTextError('');
      }
    }
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    const initialData: Record<string, string> = {};
    FIELDS.forEach((field) => {
      initialData[field.id] = '';
    });
    setFormData(initialData);
    setFreeTextError('');
  };

  const completedFieldsCount = useMemo(() => {
    return FIELDS.filter((field) => {
      const val = formData[field.id];
      if (field.id === 'freeText') {
        return val && val.trim() !== '' && !val.includes(' ') && val.length <= 30;
      }
      return val && val !== '';
    }).length;
  }, [formData]);

  const isComplete = completedFieldsCount === FIELDS.length;

  const campaignName = useMemo(() => {
    const parts = FIELDS.map((field) => {
      const val = formData[field.id] || '';
      if (field.id === 'freeText') {
        return `Ft[${val}]`;
      }
      return val;
    });
    return parts.join('_');
  }, [formData]);

  const copyToClipboard = async () => {
    if (!isComplete) return;
    try {
      await navigator.clipboard.writeText(campaignName);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-aurora py-12 px-4 sm:px-6">
      <main className="max-w-[860px] mx-auto">
        {/* Main Form Card */}
        <div className="bg-white/85 backdrop-blur-xl rounded-[20px] shadow-[0_8px_40px_rgba(34,13,78,0.10)] overflow-hidden border border-white/20">
          {/* Header Area */}
          <div className="p-10 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/AppsFlyer_logo.svg/2560px-AppsFlyer_logo.svg.png" 
                    alt="AppsFlyer" 
                    className="h-8 w-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'inline';
                    }}
                  />
                  <span className="hidden text-[26px] font-bold" style={{ color: BRAND_COLORS.dark }}>AppsFlyer</span>
                  <h1 className="text-[26px] font-bold tracking-tight" style={{ color: BRAND_COLORS.primary }}>
                    Campaign Name Builder
                  </h1>
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[200px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold" style={{ color: BRAND_COLORS.dark }}>
                    {completedFieldsCount} / {FIELDS.length} fields completed
                  </span>
                </div>
                <div className="w-full h-[6px] bg-[#e9f0f5] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(to right, ${BRAND_COLORS.primary}, ${BRAND_COLORS.accent})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedFieldsCount / FIELDS.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
            <div className="h-px bg-slate-100 w-full" />
          </div>

          {/* Form Content */}
          <div className="px-10 pb-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {FIELDS.map((field) => (
              <div key={field.id} className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold uppercase tracking-[0.05em]" style={{ color: BRAND_COLORS.dark }}>
                  {field.label}
                </label>
                {field.type === 'dropdown' ? (
                  <div className="relative group">
                    <select
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={`w-full h-[48px] px-4 rounded-[10px] border-[1.5px] bg-white text-[15px] text-[#1a1a2e] transition-all outline-none appearance-none cursor-pointer hover:border-[#00C2FF] focus:border-[#00C2FF] focus:ring-[3px] focus:ring-[#00C2FF]/15 ${
                        !formData[field.id] ? 'border-l-[3px] border-l-[#00C2FF] border-[#e2e8f0]' : 'border-[#e2e8f0]'
                      }`}
                    >
                      <option value="">Select...</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder="Enter text..."
                      className={`w-full h-[48px] px-4 rounded-[10px] border-[1.5px] bg-white text-[15px] text-[#1a1a2e] transition-all outline-none hover:border-[#00C2FF] focus:border-[#00C2FF] focus:ring-[3px] focus:ring-[#00C2FF]/15 ${
                        freeTextError ? 'border-red-500 focus:ring-red-500' : (!formData[field.id] ? 'border-l-[3px] border-l-[#00C2FF] border-[#e2e8f0]' : 'border-[#e2e8f0]')
                      }`}
                    />
                    <AnimatePresence>
                      {freeTextError && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute -bottom-5 left-0 flex items-center gap-1 text-red-500 text-[11px] font-medium"
                        >
                          <AlertCircle size={10} />
                          {freeTextError}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Output Section - Sticky on Desktop */}
          <div className="md:sticky md:bottom-0 md:z-20 border-t border-[#220D4E]/10 bg-white/90 backdrop-blur-md">
            <div className="p-10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ color: BRAND_COLORS.dark }}>
                  Campaign Name Preview
                </h2>
                <button
                  onClick={resetForm}
                  className="flex items-center gap-2 px-6 py-3 rounded-[10px] border-[1.5px] text-sm font-semibold transition-all hover:bg-[#220D4E]/5"
                  style={{ borderColor: BRAND_COLORS.dark, color: BRAND_COLORS.dark }}
                >
                  <RotateCcw size={16} />
                  Reset Form
                </button>
              </div>

              <div
                className="relative p-6 rounded-[12px] min-h-[80px] flex items-center justify-center break-all transition-all duration-300 shadow-inner"
                style={{
                  background: 'linear-gradient(135deg, #220D4E, #3d1a7a)',
                }}
              >
                <p
                  className={`text-center font-mono text-base font-medium leading-relaxed ${
                    isComplete ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {isComplete ? campaignName : 'Complete all fields to see the final name'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={copyToClipboard}
                  disabled={!isComplete}
                  className={`w-full h-[54px] rounded-[10px] flex items-center justify-center gap-3 font-bold text-base transition-all relative overflow-hidden ${
                    isComplete ? 'hover:bg-[#3d1a7a] hover:-translate-y-px shadow-lg' : 'opacity-40 cursor-not-allowed'
                  }`}
                  style={{
                    backgroundColor: BRAND_COLORS.dark,
                    color: 'white',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="copied"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3"
                      >
                        <Check size={20} />
                        ✓ Copied!
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3"
                      >
                        <Copy size={20} />
                        Copy to Clipboard
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
              
              {!isComplete && (
                <p className="text-center text-[13px] font-medium" style={{ color: BRAND_COLORS.textSecondary }}>
                  Please complete all fields to generate your campaign name
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
