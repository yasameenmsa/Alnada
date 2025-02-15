import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Calendar, Target, CheckCircle, DollarSign, Building } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../services/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Database } from '../types/supabase';

type Project = Database['public']['Tables']['projects']['Row'];

const ProjectDetails = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err instanceof Error ? err.message : 'Error fetching project');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!project) return <div className="text-center py-8">Project not found</div>;

  return (
    <div className="py-12">
      <div className="container">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[400px] rounded-lg overflow-hidden mb-8"
        >
          <img
            src={project.main_image_url || 'https://res.cloudinary.com/dh1lgpmm4/image/upload/v1737982974/NadaFoundation/project-placeholder.jpg'}
            alt={language === 'ar' ? project.title_ar : project.title_en}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center">
            <div className="container">
              <h1 className="text-4xl font-bold text-white mb-4">
                {language === 'ar' ? project.title_ar : project.title_en}
              </h1>
              <p className="text-white/90 max-w-2xl">
                {language === 'ar' ? project.description_ar : project.description_en}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Objectives */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">
                {language === 'ar' ? 'أهداف المشروع' : 'Project Objectives'}
              </h2>
              <ul className="space-y-3">
                {project.objectives?.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary ml-2 mt-1" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Achievements */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-4">
                {language === 'ar' ? 'الإنجازات' : 'Achievements'}
              </h2>
              <ul className="space-y-3">
                {project.achievements?.map((achievement: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary ml-2 mt-1" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">
                {language === 'ar' ? 'معلومات المشروع' : 'Project Information'}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 ml-2" />
                  <span>
                    {language === 'ar' ? 'المستفيدون: ' : 'Beneficiaries: '}
                    {project.beneficiaries}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 ml-2" />
                  <span>
                    {language === 'ar' ? 'المدة: ' : 'Duration: '}
                    {project.duration}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Target className="h-5 w-5 ml-2" />
                  <span>
                    {language === 'ar' ? 'الموقع: ' : 'Location: '}
                    {project.location}
                  </span>
                </div>
                <hr />
                <div>
                  <strong className="block mb-1">
                    {language === 'ar' ? 'تاريخ البداية:' : 'Start Date:'}
                  </strong>
                  <span className="text-gray-600">
                    {new Date(project.start_date).toLocaleDateString(language === 'ar' ? 'ar-YE' : 'en-US')}
                  </span>
                </div>
                {project.end_date && (
                  <div>
                    <strong className="block mb-1">
                      {language === 'ar' ? 'تاريخ النهاية:' : 'End Date:'}
                    </strong>
                    <span className="text-gray-600">
                      {new Date(project.end_date).toLocaleDateString(language === 'ar' ? 'ar-YE' : 'en-US')}
                    </span>
                  </div>
                )}
                <div>
                  <strong className="block mb-1">
                    {language === 'ar' ? 'الميزانية:' : 'Budget:'}
                  </strong>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-5 w-5 ml-2" />
                    <span>{project.budget} {language === 'ar' ? 'دولار' : 'USD'}</span>
                  </div>
                </div>
                <div>
                  <strong className="block mb-1">
                    {language === 'ar' ? 'الجهة المانحة:' : 'Donor:'}
                  </strong>
                  <div className="flex items-center text-gray-600">
                    <Building className="h-5 w-5 ml-2" />
                    <span>{project.donor}</span>
                  </div>
                </div>
                <div>
                  <strong className="block mb-1">
                    {language === 'ar' ? 'حالة المشروع:' : 'Project Status:'}
                  </strong>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    project.status === 'ongoing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status === 'ongoing' 
                      ? (language === 'ar' ? 'جاري' : 'Ongoing')
                      : (language === 'ar' ? 'مكتمل' : 'Completed')}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;