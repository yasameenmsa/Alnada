import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { Video, X } from 'lucide-react';
import Button from '../../../ui/Button';
import { uploadToCloudinary } from '../../../../services/cloudinary'; // Import Cloudinary upload function
import { FileType } from '../../../../types'; // Import FileType enum
import Spinner from '../../../ui/Spinner'; // Correct import path for Spinner component

interface MediaFile {
  url: string;
  uploaded_at: string;
  caption_ar?: string;
  caption_en?: string;
}

interface UploadVideoProps {
  mainVideo: MediaFile;
  videos: MediaFile[];
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>, isMain?: boolean) => Promise<void>;
  onRemoveVideo: (index: number, isMain?: boolean) => void;
  onUpdateCaption?: (type: 'video', index: number, lang: 'ar' | 'en', value: string) => void;
  loading: boolean;
}

const UploadVideo: React.FC<UploadVideoProps> = ({
  mainVideo,
  videos,
  onVideoUpload: onVideoUploadProp,
  onRemoveVideo: onRemoveVideoProp,
  onUpdateCaption: onUpdateCaptionProp,
  loading,
}) => {
  const { language } = useLanguage();
  const [mainVideoState, setMainVideoState] = useState(mainVideo);
  const [videosState, setVideosState] = useState(videos);
  const [uploadProgress, setUploadProgress] = useState<number>(0); // Progress state

  // Sync internal state with props
  useEffect(() => {
    setMainVideoState(mainVideo);
  }, [mainVideo]);

  useEffect(() => {
    setVideosState(videos);
  }, [videos]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain?: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
  
    try {
      for (const file of Array.from(files)) {
        // Simulate progress (if Cloudinary SDK doesn't support progress events)
        const totalSize = file.size;
        let uploadedSize = 0;
  
        const interval = setInterval(() => {
          uploadedSize += 1024 * 1024; // Simulate 1MB chunks
          const progress = Math.min((uploadedSize / totalSize) * 100, 100);
          setUploadProgress(progress);
  
          if (progress >= 100) {
            clearInterval(interval);
            setUploadProgress(0); // Reset progress after upload
          }
        }, 100);
  
        // Upload the file to Cloudinary
        const videoUrl = await uploadToCloudinary(file, FileType.Video);
  
        // Update the state (mainVideo or videos) with the new video URL
        if (isMain) {
          setMainVideoState({ url: videoUrl, uploaded_at: new Date().toISOString() });
        } else {
          setVideosState((prev) => [...prev, { url: videoUrl, uploaded_at: new Date().toISOString() }]);
        }
      }
  
      // Call the prop function
      await onVideoUploadProp(e, isMain);
    } catch (error) {
      console.error('Error uploading video:', error);
      setUploadProgress(0); // Reset progress on error
    }
  };

  const handleRemoveVideo = async (index: number, isMain?: boolean) => {
    try {
      const videoToRemove = isMain ? mainVideoState : videosState[index];
      if (!videoToRemove?.url) return;

      // Remove the video from the state
      if (isMain) {
        setMainVideoState({ url: '', uploaded_at: '' });
      } else {
        setVideosState((prev) => prev.filter((_, i) => i !== index));
      }

      // Call the prop function
      await onRemoveVideoProp(index, isMain);
    } catch (error) {
      console.error('Error removing video:', error);
    }
  };

  const handleUpdateCaption = (type: 'video', index: number, lang: 'ar' | 'en', value: string) => {
    if (type === 'video') {
      setVideosState((prev) =>
        prev.map((video, i) =>
          i === index
            ? {
                ...video,
                [`caption_${lang}`]: value,
              }
            : video
        )
      );
    }
    // Call the prop function if it exists
    if (onUpdateCaptionProp) {
      onUpdateCaptionProp(type, index, lang, value);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {language === 'ar' ? 'الفيديوهات' : 'Videos'}
      </h3>

      {/* Main Video */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'الفيديو الرئيسي' : 'Main Video'}
        </label>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById('mainVideo')?.click()}
            disabled={loading}
          >
            {loading ? (
              <Spinner className="h-5 w-5 ml-2" />
            ) : (
              <>
                <Video className="h-5 w-5 ml-2" />
                {language === 'ar' ? 'اختر فيديو' : 'Choose Video'}
              </>
            )}
          </Button>
          <input
            id="mainVideo"
            type="file"
            accept="video/*"
            onChange={(e) => handleVideoUpload(e, true)}
            className="hidden"
          />
          {mainVideoState.url && (
            <div className="relative">
              <video
                src={mainVideoState.url}
                className="h-20 w-20 object-cover rounded-lg"
                controls
              />
              <button
                type="button"
                onClick={() => handleRemoveVideo(0, true)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        {/* Progress Bar */}
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Additional Videos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'فيديوهات إضافية' : 'Additional Videos'}
        </label>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById('additionalVideos')?.click()}
            disabled={loading}
          >
            {loading ? (
              <Spinner className="h-5 w-5 ml-2" />
            ) : (
              <>
                <Video className="h-5 w-5 ml-2" />
                {language === 'ar' ? 'اختر فيديوهات' : 'Choose Videos'}
              </>
            )}
          </Button>
          <input
            id="additionalVideos"
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            multiple
            className="hidden"
          />
        </div>
        {/* Progress Bar */}
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {videosState.map((video, index) => (
            <div key={index} className="relative">
              <video
                src={video.url}
                className="h-20 w-20 object-cover rounded-lg"
                controls
              />
              <button
                type="button"
                onClick={() => handleRemoveVideo(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
              {onUpdateCaptionProp && (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    value={video.caption_ar || ''}
                    onChange={(e) => handleUpdateCaption('video', index, 'ar', e.target.value)}
                    placeholder={language === 'ar' ? 'وصف (عربي)' : 'Caption (Arabic)'}
                    className="w-full text-sm px-2 py-1 border rounded"
                  />
                  <input
                    type="text"
                    value={video.caption_en || ''}
                    onChange={(e) => handleUpdateCaption('video', index, 'en', e.target.value)}
                    placeholder={language === 'ar' ? 'وصف (إنجليزي)' : 'Caption (English)'}
                    className="w-full text-sm px-2 py-1 border rounded"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;