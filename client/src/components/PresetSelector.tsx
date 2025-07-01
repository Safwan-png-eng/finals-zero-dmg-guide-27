interface PresetSelectorProps {
  currentPreset: string;
  onPresetChange: (preset: string) => void;
}

const PresetSelector = ({ currentPreset, onPresetChange }: PresetSelectorProps) => {
  // Only one preset: Las Vegas, and allow dynamic image upload
  const presets = [
    {
      id: 'las-vegas',
      name: 'Las Vegas',
      description: 'Custom Las Vegas themed backgrounds',
      // No static background, will use uploaded images
      accent: '#FFD700'
    }
  ];

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onPresetChange(preset.id)}
          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
            currentPreset === preset.id
              ? 'border-white scale-105 shadow-lg'
              : 'border-white/20 hover:border-white/40 hover:scale-102'
          }`}
          style={{ 
            background: '#222',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="font-bold text-white text-sm">{preset.name}</h3>
              <p className="text-white/80 text-xs font-medium">{preset.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-5 h-5 rounded-full border-2 border-white/60 shadow-lg"
                style={{ 
                  backgroundColor: preset.accent,
                  boxShadow: `0 0 15px ${preset.accent}60`
                }}
              />
              {currentPreset === preset.id && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default PresetSelector;
