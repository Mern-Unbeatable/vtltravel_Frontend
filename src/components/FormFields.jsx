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
  onRemoveFile,
  previewContent,
  className = '',
  multiple = false,
}) => {
  const isVideoData = valueText && typeof valueText === 'string' && valueText.startsWith('data:video/');
  const isVideoInput = accept && accept.includes('video') && !accept.includes('image');
  const isVideo = isVideoData || (isVideoInput && !valueText);
  const fileInputId = React.useId();

  const isMultiple = Array.isArray(valueText);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
          {label}
        </label>
      )}
      <div className="space-y-2">
        <input
          id={fileInputId}
          type="file"
          accept={accept}
          onChange={onChange}
          multiple={multiple}
          className="hidden"
        />

        {isMultiple && valueText.length > 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-slate-50 p-4">
            <div className="grid max-h-[320px] grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
              {valueText.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  <img
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {onRemoveFile ? (
                    <button
                      type="button"
                      onClick={() => onRemoveFile(idx)}
                      className="absolute right-1.5 top-1.5 z-10 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-red-600"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
              <label
                htmlFor={fileInputId}
                className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 text-slate-500 transition-all hover:border-primary/50 hover:bg-slate-100"
              >
                <span className="text-xl font-bold">+</span>
                <span className="text-[10px] font-semibold uppercase">Add</span>
              </label>
            </div>
          </div>
        ) : (
          <label
            htmlFor={fileInputId}
            className="relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-slate-50 text-center transition-all hover:border-primary/50 hover:bg-slate-100/80 group"
          >
            {!isMultiple && valueText ? (
              <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-slate-100">
                {isVideo ? (
                  <video src={valueText} className="h-full w-full object-cover" />
                ) : (
                  <img
                    src={valueText}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="rounded-lg bg-slate-900/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-xs">
                    Change {isVideo ? 'Video' : 'Photo'}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary transition-transform group-hover:scale-105">
                  {isVideo ? (
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Drop your {isVideo ? 'video' : 'image'} here, or{' '}
                  <span className="text-primary hover:underline">browse</span>
                </p>
                <p className="mt-1.5 text-xs font-medium text-gray-400">
                  {isVideo
                    ? 'Supports: MP4, WEBM, MOV'
                    : 'Supports: JPG, JPEG, PNG, WEBP, AVIF'}
                </p>
              </>
            )}
          </label>
        )}

        {error && (
          <span className="mt-1 block text-xs font-medium text-red-500">
            {error.message}
          </span>
        )}
      </div>
    </div>
  );
};
