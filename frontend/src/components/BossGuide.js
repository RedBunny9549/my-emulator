import { BOSS_DATA } from "../data/bossData";

export default function BossGuide() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-[#e8823a]">Boss Guide</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BOSS_DATA.emerald.map(boss => (
          <div key={boss.name} className="bg-[#141417] border border-white/10 rounded-xl p-5 flex gap-4">
            {/* Boss Icon */}
            <img 
              src={`https://play.pokemonshowdown.com/sprites/trainers/${boss.name.toLowerCase().replace(/\s/g, "")}.png`} 
              className="w-20 h-20 object-contain bg-white/5 rounded-lg p-2" 
              alt={boss.name}
              onError={(e) => e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'}
            />
            <div>
              <h2 className="text-xl font-bold text-[#4a9fd4]">{boss.name}</h2>
              <p className="text-sm text-gray-500 mb-2">{boss.title}</p>
              <div className="flex gap-2">
                {boss.team.map(p => (
                  <img key={p} src={`https://img.pokemondb.net/sprites/emerald/normal/${p.toLowerCase()}.png`} className="w-8 h-8" title={p} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
