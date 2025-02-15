import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SearchBar from '../components/SearchBar';
import Section from '../components/layout/Section';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';

const Projects = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const transformedData = data?.map(project => ({
          ...project,
          title: {
            ar: project.title_ar,
            en: project.title_en
          },
          description: {
            ar: project.description_ar,
            en: project.description_en
          }
        })) || [];
        
        setProjects(transformedData);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter(project => 
      project.title[language].toLowerCase().includes(query) ||
      project.description[language].toLowerCase().includes(query)
    );
  }, [projects, searchQuery, language]);

  if (loading) {
    return (
      <Section>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <div className="text-center text-red-500 py-8">
          {language === 'ar' ? 'حدث خطأ أثناء تحميل المشاريع' : 'Error loading projects'}
          <br />
          <small className="text-gray-500">{error}</small>
        </div>
      </Section>
    );
  }

  // Default image if main_image_url is not available
  const defaultImage = 'https://res.cloudinary.com/dh1lgpmm4/image/upload/v1737982974/NadaFoundation/project-placeholder.jpg';

  return (
    <Section>
      <PageHeader
        title={t('projects.title')}
        subtitle={t('projects.subtitle')}
      >
        <SearchBar 
          onSearch={setSearchQuery} 
          placeholder={t('search.projects')}
        />
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Card key={project.id}>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.main_image_url || defaultImage}
                  alt={project.title[language]}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = defaultImage;
                  }}
                />
              </div>
              <CardHeader>
                <h3 className="text-xl font-bold mb-2">{project.title[language]}</h3>
                <p className="text-gray-600 line-clamp-3">{project.description[language]}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 ml-2" />
                    <span>{new Date(project.start_date).toLocaleDateString(language === 'ar' ? 'ar-YE' : 'en-US')}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Target className="h-5 w-5 ml-2" />
                    <span>{project.status === 'ongoing' ? 
                      (language === 'ar' ? 'جاري' : 'Ongoing') : 
                      (language === 'ar' ? 'مكتمل' : 'Completed')}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between items-center">
                  <Badge
                    variant={project.status === 'ongoing' ? 'success' : 'default'}
                  >
                    {project.status === 'ongoing' ? 
                      (language === 'ar' ? 'جاري' : 'Ongoing') : 
                      (language === 'ar' ? 'مكتمل' : 'Completed')}
                  </Badge>
                  <Link to={`/projects/${project.id}`}>
                    <Button variant="primary">
                      {t('projects.details')}
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">
            {t('search.no_results')}
          </div>
        )}
      </div>
    </Section>
  );
};

export default Projects;