import React from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface ProjectBudgetProps {
  budget: {
    amount: number;
    currency: string;
  };
  onChange: (field: string, value: any) => void;
}

const ProjectBudget: React.FC<ProjectBudgetProps> = ({
  budget,
  onChange,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'ar' ? 'الميزانية' : 'Budget'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'المبلغ' : 'Amount'}*
          </label>
          <input
            type="number"
            required
            value={budget.amount}
            onChange={(e) => onChange('budget', {
              ...budget,
              amount: parseFloat(e.target.value)
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'العملة' : 'Currency'}*
          </label>
          <select
            value={budget.currency}
            onChange={(e) => onChange('budget', {
              ...budget,
              currency: e.target.value
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="YER">YER</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProjectBudget;