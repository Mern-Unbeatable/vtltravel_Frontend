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
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
          {label}
        </label>
      )}
      <div className="space-y-2">
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
        />
        {onTextChange && (
          <input
            type="text"
            value={valueText || ''}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={placeholder || 'Or paste URL...'}
            className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        )}
        {error && (
          <span className="text-red-500 text-xs mt-1 block font-medium">
            {error.message}
          </span>
        )}
        {previewContent && <div className="mt-2">{previewContent}</div>}
      </div>
    </div>
  );
};
