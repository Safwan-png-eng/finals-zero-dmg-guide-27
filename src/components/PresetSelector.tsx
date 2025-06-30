
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
      id: 'destruction-zone',
      name: 'Destruction Zone',
      description: 'Urban warfare chaos',
      gradient: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 25%, #ff6b35 50%, #ffaa00 75%, #666 100%)',
      accent: '#ff6b35'
    },
    {
      id: 'finals-arena',
      name: 'THE FINALS Arena',
      description: 'Official tournament style',
      gradient: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 20%, #3d2a78 40%, #ff0080 70%, #00d4ff 100%)',
      accent: '#ff0080'
    },
    {
      id: 'monaco-streets',
      name: 'Monaco Streets',
      description: 'Elegant destruction',
      backgroundImage: '/lovable-uploads/ff01c07f-8a42-4b34-bd5d-814ea69de169.png',
      accent: '#ffd700'
    },
    {
      id: 'urban-battlefield',
      name: 'Urban Battlefield',
      description: 'Street warfare chaos',
      backgroundImage: '/lovable-uploads/2385a088-db61-4395-a7df-433b98126931.png',
      accent: '#ff6b35'
    },
    {
      id: 'smoke-dust',
      name: 'Smoke & Dust',
      description: 'Post-destruction haze',
      gradient: 'linear-gradient(135deg, #2a2520 0%, #5c5247 30%, #8b7355 60%, #d4c4a8 90%, #f0e6d2 100%)',
      accent: '#d4c4a8'
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
      id: 'cyberpunk-pink',
      name: 'Cyberpunk Pink',
      description: 'Neon-soaked future',
      gradient: 'linear-gradient(135deg, #1a0033 0%, #4c0080 30%, #8000ff 60%, #ff00ff 90%, #ff80ff 100%)',
      accent: '#ff00ff'
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
            background: preset.backgroundImage 
              ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${preset.backgroundImage})`
              : preset.gradient,
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
