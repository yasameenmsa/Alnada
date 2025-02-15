// import React, { useState } from 'react';
// import { useLanguage } from '../../../contexts/LanguageContext';
// import { useProjects } from '../../../hooks/useProjects';
// import { uploadToCloudinary } from '../../../services/cloudinary';
// import { Image, Loader, X, Plus, Minus, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
// import Button from '../../ui/Button';
// import ErrorMessage from '../../ErrorMessage';
// import type { Database } from '../../../types/supabase';

// type ProjectInsert = Database['public']['Tables']['projects']['Insert'];

// interface ProjectFormProps {
//   onSuccess: () => void;
//   initialData?: ProjectInsert;
// }

// const ProjectForm: React.FC<ProjectFormProps> = ({ onSuccess, initialData }) => {
//   const { language } = useLanguage();
//   const { createProject, updateProject } = useProjects();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [formData, setFormData] = useState<ProjectInsert>(
//     initialData || {
//       title_ar: '',
//       title_en: '',
//       description_ar: '',
//       description_en: '',
//       objectives_ar: [],
//       objectives_en: [],
//       achievements_ar: [],
//       achievements_en: [],
//       beneficiaries_ar: [],
//       beneficiaries_en: [],
//       duration_ar: '',
//       duration_en: '',
//       locations: [],
//       start_date: '',
//       end_date: '',
//       budget: {
//         amount: 0,
//         currency: 'USD'
//       },
//       funding_source_ar: [],
//       funding_source_en: [],
//       status: 'Planned',
//       project_phases: [],
//       main_image: {
//         url: '',
//         uploaded_at: ''
//       },
//       images: [],
//       main_video: {
//         url: '',
//         uploaded_at: ''
//       },
//       videos: [],
//       main_file: {
//         url: '',
//         uploaded_at: ''
//       },
//       files: [],
//       beneficiaries_breakdown: {
//         total: 0,
//         women: 0,
//         men: 0,
//         children: 0,
//         elderly: 0,
//         disabled: 0
//       },
//       published: false,
//       user_id: ''
//     }
//   );

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       setLoading(true);
//       if (!formData.main_image.url) {
//         throw new Error(language === 'ar' ? 'الصورة الرئيسية مطلوبة' : 'Main image is required');
//       }
//       const result = initialData
//         ? await updateProject(initialData.id!, formData)
//         : await createProject(formData);
//       if (!result.success) {
//         throw new Error(result.error);
//       }
//       onSuccess();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
//     const files = e.target.files;
//     if (!files?.length) return;
//     try {
//       setLoading(true);
//       setError(null);
//       const uploadedUrl = await uploadToCloudinary(files[0]);
//       if (isMain) {
//         setFormData((prev) => ({
//           ...prev,
//           main_image: {
//             url: uploadedUrl,
//             uploaded_at: new Date().toISOString(),
//           },
//         }));
//       } else {
//         setFormData((prev) => ({
//           ...prev,
//           images: [
//             ...(prev.images || []),
//             {
//               url: uploadedUrl,
//               uploaded_at: new Date().toISOString(),
//               caption_ar: '',
//               caption_en: '',
//             },
//           ],
//         }));
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to upload image');
//     } finally {
//       setLoading(false);
//       e.target.value = '';
//     }
//   };

//   const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
//     const files = e.target.files;
//     if (!files?.length) return;
//     try {
//       setLoading(true);
//       setError(null);
//       const uploadedUrl = await uploadToCloudinary(files[0]);
//       if (isMain) {
//         setFormData((prev) => ({
//           ...prev,
//           main_video: {
//             url: uploadedUrl,
//             uploaded_at: new Date().toISOString(),
//           },
//         }));
//       } else {
//         setFormData((prev) => ({
//           ...prev,
//           videos: [
//             ...(prev.videos || []),
//             {
//               url: uploadedUrl,
//               uploaded_at: new Date().toISOString(),
//               caption_ar: '',
//               caption_en: '',
//             },
//           ],
//         }));
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to upload video');
//     } finally {
//       setLoading(false);
//       e.target.value = '';
//     }
//   };

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
//     const files = e.target.files;
//     if (!files?.length) return;
//     try {
//       setLoading(true);
//       setError(null);
//       const uploadedUrl = await uploadToCloudinary(files[0], 'document');
//       if (isMain) {
//         setFormData((prev) => ({
//           ...prev,
//           main_file: {
//             url: uploadedUrl,
//             uploaded_at: new Date().toISOString(),
//           },
//         }));
//       } else {
//         setFormData((prev) => ({
//           ...prev,
//           files: [
//             ...(prev.files || []),
//             {
//               url: uploadedUrl,
//               uploaded_at: new Date().toISOString(),
//               description_ar: '',
//               description_en: '',
//             },
//           ],
//         }));
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to upload file');
//     } finally {
//       setLoading(false);
//       e.target.value = '';
//     }
//   };

//   const addLocation = () => {
//     setFormData((prev) => ({
//       ...prev,
//       locations: [
//         ...(prev.locations as any[]),
//         {
//           name_ar: '',
//           name_en: '',
//           coordinates: { lat: '', lng: '' },
//         },
//       ],
//     }));
//   };

//   const updateLocation = (index: number, field: string, value: string) => {
//     setFormData((prev) => {
//       const locations = [...(prev.locations as any[])];
//       if (field === 'lat' || field === 'lng') {
//         locations[index].coordinates[field] = value;
//       } else {
//         locations[index][field] = value;
//       }
//       return { ...prev, locations };
//     });
//   };

//   const addPhase = () => {
//     setFormData((prev) => ({
//       ...prev,
//       project_phases: [
//         ...(prev.project_phases as any[]),
//         {
//           name_ar: '',
//           name_en: '',
//           start_date: '',
//           end_date: '',
//           status: 'Planned',
//         },
//       ],
//     }));
//   };

//   const updatePhase = (index: number, field: string, value: string) => {
//     setFormData((prev) => {
//       const phases = [...(prev.project_phases as any[])];
//       phases[index][field] = value;
//       return { ...prev, project_phases: phases };
//     });
//   };

//   const addObjective = (language: 'ar' | 'en') => {
//     setFormData((prev) => ({
//       ...prev,
//       [`objectives_${language}`]: [...(prev[`objectives_${language}`] as string[]), ''],
//     }));
//   };

//   const updateObjective = (language: 'ar' | 'en', index: number, value: string) => {
//     setFormData((prev) => {
//       const objectives = [...(prev[`objectives_${language}`] as string[])];
//       objectives[index] = value;
//       return { ...prev, [`objectives_${language}`]: objectives };
//     });
//   };

//   const removeObjective = (language: 'ar' | 'en', index: number) => {
//     setFormData((prev) => {
//       const objectives = [...(prev[`objectives_${language}`] as string[])];
//       objectives.splice(index, 1);
//       return { ...prev, [`objectives_${language}`]: objectives };
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-8">
//       {error && <ErrorMessage message={error} />}

//       {/* Basic Information */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Title Fields */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}*
//           </label>
//           <input
//             type="text"
//             required
//             value={formData.title_ar}
//             onChange={(e) => setFormData((prev) => ({ ...prev, title_ar: e.target.value }))}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}*
//           </label>
//           <input
//             type="text"
//             required
//             value={formData.title_en}
//             onChange={(e) => setFormData((prev) => ({ ...prev, title_en: e.target.value }))}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//           />
//         </div>

//         {/* Description Fields */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}*
//           </label>
//           <textarea
//             required
//             rows={4}
//             value={formData.description_ar}
//             onChange={(e) => setFormData((prev) => ({ ...prev, description_ar: e.target.value }))}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}*
//           </label>
//           <textarea
//             required
//             rows={4}
//             value={formData.description_en}
//             onChange={(e) => setFormData((prev) => ({ ...prev, description_en: e.target.value }))}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//           />
//         </div>
//       </div>

//       {/* Objectives */}
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {language === 'ar' ? 'الأهداف (عربي)' : 'Objectives (Arabic)'}*
//           </label>
//           {formData.objectives_ar.map((objective, index) => (
//             <div key={index} className="flex items-center gap-2 mb-2">
//               <input
//                 type="text"
//                 value={objective}
//                 onChange={(e) => updateObjective('ar', index, e.target.value)}
//                 className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//               />
//               <button
//                 type="button"
//                 onClick={() => removeObjective('ar', index)}
//                 className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
//               >
//                 <Minus className="h-5 w-5" />
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() => addObjective('ar')}
//             className="flex items-center text-primary hover:text-primary/80"
//           >
//             <Plus className="h-5 w-5 mr-1" />
//             {language === 'ar' ? 'إضافة هدف' : 'Add Objective'}
//           </button>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {language === 'ar' ? 'الأهداف (إنجليزي)' : 'Objectives (English)'}*
//           </label>
//           {formData.objectives_en.map((objective, index) => (
//             <div key={index} className="flex items-center gap-2 mb-2">
//               <input
//                 type="text"
//                 value={objective}
//                 onChange={(e) => updateObjective('en', index, e.target.value)}
//                 className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//               />
//               <button
//                 type="button"
//                 onClick={() => removeObjective('en', index)}
//                 className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
//               >
//                 <Minus className="h-5 w-5" />
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() => addObjective('en')}
//             className="flex items-center text-primary hover:text-primary/80"
//           >
//             <Plus className="h-5 w-5 mr-1" />
//             {language === 'ar' ? 'إضافة هدف' : 'Add Objective'}
//           </button>
//         </div>
//       </div>

//       {/* Project Timeline */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {language === 'ar' ? 'تاريخ البداية' : 'Start Date'}*
//           </label>
//           <input
//             type="date"
//             required
//             value={formData.start_date}
//             onChange={(e) => setFormData((prev) => ({ ...prev, start_date: e.target.value }))}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {language === 'ar' ? 'تاريخ النهاية' : 'End Date'}*
//           </label>
//           <input
//             type="date"
//             required
//             value={formData.end_date}
//             onChange={(e) => setFormData((prev) => ({ ...prev, end_date: e.target.value }))}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//           />
//         </div>
//       </div>

//       {/* Project Status */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           {language === 'ar' ? 'حالة المشروع' : 'Project Status'}*
//         </label>
//         <select
//           value={formData.status}
//           onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))}
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//         >
//           <option value="Planned">{language === 'ar' ? 'مخطط' : 'Planned'}</option>
//           <option value="Ongoing">{language === 'ar' ? 'جاري' : 'Ongoing'}</option>
//           <option value="Completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
//         </select>
//       </div>

//       {/* Budget */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {language === 'ar' ? 'المبلغ' : 'Amount'}*
//           </label>
//           <input
//             type="number"
//             required
//             value={formData.budget.amount}
//             onChange={(e) => setFormData((prev) => ({
//               ...prev,
//               budget: { ...prev.budget, amount: parseFloat(e.target.value) }
//             }))}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {language === 'ar' ? 'العملة' : 'Currency'}*
//           </label>
//           <select
//             value={formData.budget.currency}
//             onChange={(e) => setFormData((prev) => ({
//               ...prev,
//               budget: { ...prev.budget, currency: e.target.value }
//             }))}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//           >
//             <option value="USD">USD</option>
//             <option value="EUR">EUR</option>
//             <option value="YER">YER</option>
//           </select>
//         </div>
//       </div>

//       {/* Beneficiaries Breakdown */}
//       <div>
//         <h3 className="text-lg font-medium mb-4">
//           {language === 'ar' ? 'تفاصيل المستفيدين' : 'Beneficiaries Breakdown'}
//         </h3>
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           {Object.entries(formData.beneficiaries_breakdown).map(([key, value]) => (
//             <div key={key}>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 {language === 'ar' ? key : key}
//               </label>
//               <input
//                 type="number"
//                 min="0"
//                 value={value}
//                 onChange={(e) => setFormData((prev) => ({
//                   ...prev,
//                   beneficiaries_breakdown: {
//                     ...prev.beneficiaries_breakdown,
//                     [key]: parseInt(e.target.value)
//                   }
//                 }))}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Project Phases */}
//       <div>
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-medium">
//             {language === 'ar' ? 'مراحل المشروع' : 'Project Phases'}
//           </h3>
//           <button
//             type="button"
//             onClick={addPhase}
//             className="flex items-center text-primary hover:text-primary/80"
//           >
//             <Plus className="h-5 w-5 mr-1" />
//             {language === 'ar' ? 'إضافة مرحلة' : 'Add Phase'}
//           </button>
//         </div>
//         <div className="space-y-4">
//           {formData.project_phases.map((phase, index) => (
//             <div key={index} className="border border-gray-200 rounded-lg p-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <input
//                   type="text"
//                   placeholder={language === 'ar' ? 'اسم المرحلة (عربي)' : 'Phase Name (Arabic)'}
//                   value={phase.name_ar}
//                   onChange={(e) => updatePhase(index, 'name_ar', e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//                 />
//                 <input
//                   type="text"
//                   placeholder={language === 'ar' ? 'اسم المرحلة (إنجليزي)' : 'Phase Name (English)'}
//                   value={phase.name_en}
//                   onChange={(e) => updatePhase(index, 'name_en', e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//                 />
//                 <input
//                   type="date"
//                   value={phase.start_date}
//                   onChange={(e) => updatePhase(index, 'start_date', e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//                 />
//                 <input
//                   type="date"
//                   value={phase.end_date}
//                   onChange={(e) => updatePhase(index, 'end_date', e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//                 />
//                 <select
//                   value={phase.status}
//                   onChange={(e) => updatePhase(index, 'status', e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//                 >
//                   <option value="Planned">{language === 'ar' ? 'مخطط' : 'Planned'}</option>
//                   <option value="In Progress">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</option>
//                   <option value="Completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
//                 </select>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Locations */}
//       <div>
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-medium">
//             {language === 'ar' ? 'المواقع' : 'Locations'}
//           </h3>
//           <button
//             type="button"
//             onClick={addLocation}
//             className="flex items-center text-primary hover:text-primary/80"
//           >
//             <Plus className="h-5 w-5 mr-1" />
//             {language === 'ar' ? 'إضافة موقع' : 'Add Location'}
//           </button>
//         </div>
//         <div className="space-y-4">
//           {formData.locations.map((location, index) => (
//             <div key={index} className="border border-gray-200 rounded-lg p-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <input
//                   type="text"
//                   placeholder={language === 'ar' ? 'اسم الموقع (عربي)' : 'Location Name (Arabic)'}
//                   value={location.name_ar}
//                   onChange={(e) => updateLocation(index, 'name_ar', e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//                 />
//                 <input
//                   type="text"
//                   placeholder={language === 'ar' ? 'اسم الموقع (إنجليزي)' : 'Location Name (English)'}
//                   value={location.name_en}
//                   onChange={(e) => updateLocation(index, 'name_en', e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//                 />
//                 <input
//                   type="text"
//                   placeholder={language === 'ar' ? 'خط العرض' : 'Latitude'}
//                   value={location.coordinates.lat}
//                   onChange={(e) => updateLocation(index, 'lat', e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//                 />
//                 <input
//                   type="text"
//                   placeholder={language === 'ar' ? 'خط الطول' : 'Longitude'}
//                   value={location.coordinates.lng}
//                   onChange={(e) => updateLocation(index, 'lng', e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Media Uploads */}
//       <div className="space-y-6">
//         {/* Main Image */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {language === 'ar' ? 'الصورة الرئيسية' : 'Main Image'}*
//           </label>
//           <div className="flex items-center space-x-4 rtl:space-x-reverse">
//             <Button
//               type="button"
//               variant="secondary"
//               onClick={() => document.getElementById('mainImage')?.click()}
//               disabled={loading}
//             >
//               <Image className="h-5 w-5 ml-2" />
//               {language === 'ar' ? 'اختر صورة' : 'Choose Image'}
//             </Button>
//             <input
//               id="mainImage"
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleImageUpload(e, true)}
//               className="hidden"
//             />
//             {formData.main_image.url && (
//               <div className="relative">
//                 <img
//                   src={formData.main_image.url}
//                   alt="Main"
//                   className="h-20 w-20 object-cover rounded-lg"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setFormData((prev) => ({ ...prev, main_image: { url: '', uploaded_at: '' } }))}
//                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Additional Images */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {language === 'ar' ? 'صور إضافية' : 'Additional Images'}
//           </label>
//           <div className="flex items-center space-x-4 rtl:space-x-reverse">
//             <Button
//               type="button"
//               variant="secondary"
//               onClick={() => document.getElementById('additionalImages')?.click()}
//               disabled={loading}
//             >
//               <Image className="h-5 w-5 ml-2" />
//               {language === 'ar' ? 'اختر صور' : 'Choose Images'}
//             </Button>
//             <input
//               id="additionalImages"
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               multiple
//               className="hidden"
//             />
//           </div>
//           <div className="grid grid-cols-4 gap-4 mt-4">
//             {formData.images.map((image, index) => (
//               <div key={index} className="relative">
//                 <img
//                   src={image.url}
//                   alt={`Additional ${index + 1}`}
//                   className="h-20 w-20 object-cover rounded-lg"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setFormData((prev) => ({
//                       ...prev,
//                       images: prev.images.filter((_, i) => i !== index)
//                     }));
//                   }}
//                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Published Toggle */}
//       <div className="flex items-center">
//         <input
//           type="checkbox"
//           id="published"
//           checked={formData.published}
//           onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
//           className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
//         />
//         <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
//           {language === 'ar' ? 'نشر المشروع' : 'Publish Project'}
//         </label>
//       </div>

//       {/* Submit Button */}
//       <Button
//         type="submit"
//         disabled={loading}
//         className="w-full"
//       >
//         {loading ? (
//           <Loader className="h-5 w-5 animate-spin" />
//         ) : (
//           language === 'ar' ? 'حفظ المشروع' : 'Save Project'
//         )}
//       </Button>
//     </form>
//   );
// };

// export default ProjectForm;
