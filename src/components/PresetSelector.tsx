
interface PresetSelectorProps {
  currentPreset: string;
  onPresetChange: (preset: string) => void;
}

const PresetSelector = ({ currentPreset, onPresetChange }: PresetSelectorProps) => {
  const presets = [
    {
      id: 'neon-city',
      name: 'Neon City',
      description: 'Cyberpunk arena vibes',
      gradient: 'linear-gradient(135deg, #0a0a0f 0%, #2d1b69 35%, #6b46c1 75%, #3b1d4f 100%)',
      accent: '#00ff88'
    },
    {
      id: 'fire-storm',
      name: 'Fire Storm',
      description: 'Explosive destruction',
      gradient: 'linear-gradient(135deg, #0f0000 0%, #8b0000 50%, #dc2626 85%, #ff4500 100%)',
      accent: '#ff4500'
    },
    {
      id: 'ice-cold',
      name: 'Ice Cold',
      description: 'Frozen battleground',
      gradient: 'linear-gradient(135deg, #020617 0%, #1e3a8a 60%, #3b82f6 75%, #93c5fd 100%)',
      accent: '#3b82f6'
    },
    {
      id: 'toxic-green',
      name: 'Toxic Zone',
      description: 'Chemical warfare arena',
      gradient: 'linear-gradient(135deg, #0d1b0d 0%, #16a34a 60%, #22c55e 75%, #86efac 100%)',
      accent: '#32cd32'
    },
    {
      id: 'royal-purple',
      name: 'Royal Arena',
      description: 'Premium tournament feel',
      gradient: 'linear-gradient(135deg, #1a0033 0%, #6b46c1 45%, #a855f7 75%, #d8b4fe 100%)',
      accent: '#8b5cf6'
    }
  ];

  return (
    <div className="space-y-3">
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onPresetChange(preset.id)}
          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
            currentPreset === preset.id
              ? 'border-white scale-105 shadow-lg'
              : 'border-white/20 hover:border-white/40 hover:scale-102'
          }`}
          style={{ background: preset.gradient }}
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
