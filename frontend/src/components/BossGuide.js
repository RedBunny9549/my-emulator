import { BOSS_DATA } from "../data/bossData";

export default function BossGuide() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-emerald-500 mb-8">Boss Guide</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BOSS_DATA.emerald.map(boss => (
          <div key={boss.name} className="bg-[#16161A] border border-white/10 rounded-3xl p-6 flex gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl p-2 border border-emerald-500/20">
                <img 
                  src={`https://play.pokemonshowdown.com/sprites/trainers/${boss.name.toLowerCase().replace(/\s/g, "")}.png`} 
                  className="w-full h-full object-contain" 
                  alt={boss.name}
                  onError={(e) => e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'}
                />
              </div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">{boss.title}</span>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-black text-white mb-4 uppercase">{boss.name}</h2>
              <div className="flex flex-wrap gap-2">
                {boss.team.map(p => (
                  <img 
                    key={p} 
                    src={`https://img.pokemondb.net/sprites/emerald/normal/${p.toLowerCase()}.png`} 
                    className="w-8 h-8 pixelated" 
                    title={p} 
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
