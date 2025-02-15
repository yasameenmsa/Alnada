import React from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface BeneficiariesBreakdownProps {
  breakdown: {
    total: number;
    women: number;
    men: number;
    children: number;
    elderly: number;
    disabled: number;
  };
  onChange: (field: string, value: any) => void;
}

const BeneficiariesBreakdown: React.FC<BeneficiariesBreakdownProps> = ({
  breakdown,
  onChange,
}) => {
  const { language } = useLanguage();

  const handleChange = (key: string, value: string) => {
    onChange('beneficiaries_breakdown', {
      ...breakdown,
      [key]: parseInt(value) || 0
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'ar' ? 'تفاصيل المستفيدين' : 'Beneficiaries Breakdown'}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(breakdown).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'ar' ? getArabicLabel(key) : getEnglishLabel(key)}
            </label>
            <input
              type="number"
              min="0"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

function getArabicLabel(key: string): string {
  const labels: Record<string, string> = {
    total: 'الإجمالي',
    women: 'النساء',
    men: 'الرجال',
    children: 'الأطفال',
    elderly: 'كبار السن',
    disabled: 'ذوي الإعاقة'
  };
  return labels[key] || key;
}

function getEnglishLabel(key: string): string {
  const labels: Record<string, string> = {
    total: 'Total',
    women: 'Women',
    men: 'Men',
    children: 'Children',
    elderly: 'Elderly',
    disabled: 'Disabled'
  };
  return labels[key] || key;
}

export default BeneficiariesBreakdown;