import React, { useState } from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useProjects } from '../../../../hooks/useProjects';
import { uploadToCloudinary } from '../../../../services/cloudinary';
import { Loader } from 'lucide-react';
import Button from '../../../ui/Button';
import ErrorMessage from '../../../ErrorMessage';
import type { Database } from '../../../../types/supabase';
import { FileType } from '../../../../types';
import {
  BasicInformation,
  MediaUpload,
  ProjectTimeline,
  ProjectBudget,
  ProjectObjectives,
  ProjectLocations,
  ProjectPhases,
  BeneficiariesBreakdown
} from './index';

type ProjectInsert = Database['public']['Tables']['projects']['Insert'];

interface ProjectFormProps {
  onSuccess: () => void;
  initialData?: ProjectInsert & { id?: string };
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSuccess, initialData }) => {
  const { language } = useLanguage();
  const { createProject, updateProject } = useProjects();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectInsert>(
    initialData || {
      title_ar: '',
      title_en: '',
      description_ar: '',
      description_en: '',
      objectives_ar: [],
      objectives_en: [],
      achievements_ar: [],
      achievements_en: [],
      beneficiaries_ar: [],
      beneficiaries_en: [],
      duration_ar: '',
      duration_en: '',
      locations: [],
      start_date: '',
      end_date: '',
      budget: {
        amount: 0,
        currency: 'USD'
      },
      funding_source_ar: [],
      funding_source_en: [],
      status: 'Planned',
      project_phases: [],
      main_image: {
        url: '',
        uploaded_at: ''
      },
      images: [],
      main_video: {
        url: '',
        uploaded_at: ''
      },
      videos: [],
      main_file: {
        url: '',
        uploaded_at: ''
      },
      files: [],
      beneficiaries_breakdown: {
        total: 0,
        women: 0,
        men: 0,
        children: 0,
        elderly: 0,
        disabled: 0
      },
      published: false,
      user_id: ''
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      setLoading(true);

      if (!formData.main_image.url) {
        throw new Error(language === 'ar' ? 'الصورة الرئيسية مطلوبة' : 'Main image is required');
      }

      const result = initialData 
        ? await updateProject(initialData.id!, formData)
        : await createProject(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      setLoading(true);
      setError(null);

      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      if (isMain) {
        setFormData(prev => ({
          ...prev,
          main_image: {
            url: uploadedUrls[0],
            uploaded_at: new Date().toISOString()
          }
        }));
      } else {
        setFormData((prev: ProjectInsert) => ({
          ...prev,
          images: [
            ...(prev.images || []),
            ...uploadedUrls.map((url: string) => ({
              url,
              uploaded_at: new Date().toISOString(),
              caption_ar: '',
              caption_en: ''
            }))
          ]
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      setLoading(true);
      setError(null);

      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      if (isMain) {
        setFormData(prev => ({
          ...prev,
          main_video: {
            url: uploadedUrls[0],
            uploaded_at: new Date().toISOString()
          }
        }));
      } else {
        setFormData((prev: ProjectInsert) => ({
          ...prev,
          videos: [
            ...(prev.videos || []),
            ...uploadedUrls.map((url: string) => ({
              url,
              uploaded_at: new Date().toISOString(),
              caption_ar: '',
              caption_en: ''
            }))
          ]
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload video');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      setLoading(true);
      setError(null);

      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file, 'raw' as FileType));
      const uploadedUrls = await Promise.all(uploadPromises);

      if (isMain) {
        setFormData(prev => ({
          ...prev,
          main_file: {
            url: uploadedUrls[0],
            uploaded_at: new Date().toISOString()
          }
        }));
      } else {
        setFormData((prev: ProjectInsert) => ({
          ...prev,
          files: [
            ...(prev.files || []),
            ...uploadedUrls.map((url: string) => ({
              url,
              uploaded_at: new Date().toISOString(),
              description_ar: '',
              description_en: ''
            }))
          ]
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setLoading(false);
      e.target.value = '';
    }


  };  const handleRemoveImage = (index: number, isMain: boolean = false) => {
    if (isMain) {
      setFormData(prev => ({
        ...prev,
        main_image: { url: '', uploaded_at: '' }
      }));
    } else {
      setFormData((prev: ProjectInsert) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const handleRemoveVideo = (index: number, isMain: boolean = false) => {
    if (isMain) {
      setFormData(prev => ({
        ...prev,
        main_video: { url: '', uploaded_at: '' }
      }));
    } else {
      setFormData((prev: ProjectInsert) => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== index)
      }));
    }
  };

  const handleRemoveFile = (index: number, isMain: boolean = false) => {
    if (isMain) {
      setFormData(prev => ({
        ...prev,
        main_file: { url: '', uploaded_at: '' }
      }));
    } else {
      setFormData((prev: ProjectInsert) => ({
        ...prev,
        files: prev.files.filter((_, i) => i !== index)
      }));
    }
  };

  const handleUpdateCaption = (type: 'image' | 'video', index: number, lang: 'ar' | 'en', value: string) => {
    setFormData((prev: ProjectInsert) => {
      const items = type === 'image' ? [...prev.images] : [...prev.videos];
      items[index] = {
        ...items[index],
        [`caption_${lang}`]: value
      };
      return {
        ...prev,
        [type === 'image' ? 'images' : 'videos']: items
      };
    });
  };

  const handleUpdateDescription = (index: number, lang: 'ar' | 'en', value: string) => {
    setFormData((prev: ProjectInsert) => {
      const files = [...prev.files];
      files[index] = {
        ...files[index],
        [`description_${lang}`]: value
      };
      return {
        ...prev,
        files
      };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <ErrorMessage message={error} />}

      <BasicInformation
        title_ar={formData.title_ar}
        title_en={formData.title_en}
        description_ar={formData.description_ar}
        description_en={formData.description_en}
        onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
      />

      
      <ProjectObjectives
        objectives_ar={formData.objectives_ar}
        objectives_en={formData.objectives_en}
        onAddObjective={(lang) => {
          setFormData(prev => ({
            ...prev,
            [`objectives_${lang}`]: [...prev[`objectives_${lang}`], '']
          }));
        }}
        onUpdateObjective={(lang, index, value) => {
          setFormData(prev => {
            const objectives = [...prev[`objectives_${lang}`]];
            objectives[index] = value;
            return {
              ...prev,
              [`objectives_${lang}`]: objectives
            };
          });
        }}
        onRemoveObjective={(lang, index) => {
          setFormData(prev => ({
            ...prev,
            [`objectives_${lang}`]: prev[`objectives_${lang}`].filter((_, i) => i !== index)
          }));
        }}
      />

      <ProjectTimeline
        start_date={formData.start_date}
        end_date={formData.end_date}
        status={formData.status}
        onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
      />

      <ProjectBudget
        budget={formData.budget}
        onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
      />

      <ProjectLocations
        locations={formData.locations}
        onAddLocation={() => {
          setFormData(prev => ({
            ...prev,
            locations: [
              ...prev.locations,
              {
                name_ar: '',
                name_en: '',
                coordinates: { lat: '', lng: '' }
              }
            ]
          }));
        }}
        onUpdateLocation={(index, field, value) => {
          setFormData(prev => {
            const locations = [...prev.locations];
            (locations[index] as any)[field] = value;
            return { ...prev, locations };
          });
        }}
      />

      <ProjectPhases
        phases={formData.project_phases}
        onAddPhase={() => {
          setFormData(prev => ({
            ...prev,
            project_phases: [
              ...prev.project_phases,
              {
                name_ar: '',
                name_en: '',
                start_date: '',
                end_date: '',
                status: 'Planned'
              }
            ]
          }));
        }}
        onUpdatePhase={(index, field, value) => {
          setFormData(prev => {
            const phases = [...prev.project_phases];
            (phases[index] as any)[field] = value;
            return { ...prev, project_phases: phases };
          });
        }}
      />

      <BeneficiariesBreakdown
        breakdown={formData.beneficiaries_breakdown}
        onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
      />

      <MediaUpload
        mainImage={formData.main_image}
        images={formData.images}
        mainVideo={formData.main_video}
        videos={formData.videos}
        mainFile={formData.main_file}
        files={formData.files}
        onImageUpload={handleImageUpload}
        onVideoUpload={handleVideoUpload}
        onFileUpload={handleFileUpload}
        onRemoveImage={handleRemoveImage}
        onRemoveVideo={handleRemoveVideo}
        onRemoveFile={handleRemoveFile}
        onUpdateCaption={handleUpdateCaption}
        onUpdateDescription={handleUpdateDescription}
        loading={loading}
      />

      {/* Published Toggle */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="published"
          checked={formData.published}
          onChange={e => setFormData(prev => ({ ...prev, published: e.target.checked }))}
          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
          {language === 'ar' ? 'نشر المشروع' : 'Publish Project'}
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <Loader className="h-5 w-5 animate-spin" />
        ) : (
          language === 'ar' ? 'حفظ المشروع' : 'Save Project'
        )}
      </Button>
    </form>
  );
};

export default ProjectForm;