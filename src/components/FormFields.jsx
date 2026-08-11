import React from 'react';

export const FormInput = ({
  label,
  name,
  register,
  error,
  type = 'text',
  placeholder,
  className = '',
  ...rest
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        {...rest}
        className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && (
        <span className="text-red-500 text-xs mt-1 block font-medium">
          {error.message}
        </span>
      )}
    </div>
  );
};

export const FormTextarea = ({
  label,
  name,
  register,
  error,
  placeholder,
  rows = 4,
  className = '',
  ...rest
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        {...register(name)}
        placeholder={placeholder}
        {...rest}
        className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && (
        <span className="text-red-500 text-xs mt-1 block font-medium">
          {error.message}
        </span>
      )}
    </div>
  );
};

export const FormFileInput = ({
  label,
  accept,
  onChange,
  error,
  placeholder,
  valueText,
  onTextChange,
  previewContent,
  className = '',
}) => {
  const isVideoData = valueText && valueText.startsWith('data:video/');
  const isVideoInput = accept && accept.includes('video') && !accept.includes('image');
  const isVideo = isVideoData || (isVideoInput && !valueText);
  const fileInputId = React.useId();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {/* Hidden File Input */}
        <input
          id={fileInputId}
          type="file"
          accept={accept}
          onChange={onChange}
          className="hidden"
        />
        
        {/* Dropzone container */}
        <label
          htmlFor={fileInputId}
          className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100/80 hover:border-primary/50 transition-all cursor-pointer group text-center min-h-[140px] overflow-hidden"
        >
          {valueText ? (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-100">
              {isVideo ? (
                <video src={valueText} className="w-full h-full object-cover" />
              ) : (
                <img src={valueText} alt="Preview" className="w-full h-full object-cover" />
              )}
              {/* Hover Overlay to click to upload new */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold bg-slate-900/60 px-3 py-1.5 rounded-lg backdrop-blur-xs">
                  Change {isVideo ? 'Video' : 'Photo'}
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                {isVideo ? (
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              
              <p className="text-sm font-semibold text-slate-700">
                Drop your {isVideo ? 'video' : 'image'} here, or <span className="text-primary hover:underline">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1.5 font-medium">
                {isVideo ? 'Supports: MP4, WEBM, MOV' : 'Supports: JPG, JPEG, PNG, WEBP, AVIF'}
              </p>
            </>
          )}
        </label>

        {error && (
          <span className="text-red-500 text-xs mt-1 block font-medium">
            {error.message}
          </span>
        )}
      </div>
    </div>
  );
};
