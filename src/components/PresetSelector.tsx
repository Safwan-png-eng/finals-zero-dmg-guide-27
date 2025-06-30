
interface PresetSelectorProps {
  currentPreset: string;
  onPresetChange: (preset: string) => void;
}

const PresetSelector = ({ currentPreset, onPresetChange }: PresetSelectorProps) => {
  const presets = [
    {
      id: 'neon-city',
      name: 'Neon City',
      description: 'Cyberpunk vibes',
      gradient: 'linear-gradient(135deg, #0f0f23 0%, #2d1b69 50%, #0f0f23 100%)',
      accent: '#00ff88'
    },
    {
      id: 'fire-storm',
      name: 'Fire Storm',
      description: 'Intense action',
      gradient: 'linear-gradient(135deg, #1a0000 0%, #8b0000 50%, #ff4500 100%)',
      accent: '#ff4500'
    },
    {
      id: 'ice-cold',
      name: 'Ice Cold',
      description: 'Frozen battleground',
      gradient: 'linear-gradient(135deg, #0a0a2e 0%, #1e3a8a 50%, #3b82f6 100%)',
      accent: '#3b82f6'
    },
    {
      id: 'toxic-green',
      name: 'Toxic',
      description: 'Chemical warfare',
      gradient: 'linear-gradient(135deg, #0d1b0d 0%, #228b22 50%, #32cd32 100%)',
      accent: '#32cd32'
    },
    {
      id: 'royal-purple',
      name: 'Royal',
      description: 'Premium feel',
      gradient: 'linear-gradient(135deg, #1a0033 0%, #4c1d95 50%, #8b5cf6 100%)',
      accent: '#8b5cf6'
    }
  ];

  return (
    <div className="space-y-3">
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onPresetChange(preset.id)}
          className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
            currentPreset === preset.id
              ? 'border-white scale-105 shadow-lg'
              : 'border-white/20 hover:border-white/40 hover:scale-102'
          }`}
          style={{ background: preset.gradient }}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="font-semibold text-white text-sm">{preset.name}</h3>
              <p className="text-white/70 text-xs">{preset.description}</p>
            </div>
            <div
              className="w-4 h-4 rounded-full border-2 border-white/50"
              style={{ backgroundColor: preset.accent }}
            />
          </div>
        </button>
      ))}
    </div>
  );
};

export default PresetSelector;
