import { Era } from './types';

export const ERAS: Era[] = [
  {
    id: 'ancient-egypt',
    name: 'Ancient Egypt',
    description: 'Pharaohs, pyramids, and golden sands.',
    prompt: 'Ancient Egypt, wearing royal Egyptian robes and gold jewelry, standing in front of the Great Sphinx and Pyramids with warm desert lighting.',
    icon: '🏛️',
    color: 'from-yellow-600 to-amber-800'
  },
  {
    id: 'victorian-london',
    name: 'Victorian London',
    description: 'Cobblestone streets, fog, and top hats.',
    prompt: 'Victorian London, wearing elegant 19th-century formal attire, standing on a foggy cobblestone street with gas lamps and Big Ben in the background.',
    icon: '🎩',
    color: 'from-gray-700 to-gray-900'
  },
  {
    id: 'roaring-20s',
    name: 'Roaring 20s',
    description: 'Jazz, glitz, and Art Deco glamour.',
    prompt: 'The Roaring 1920s, wearing a Great Gatsby style suit or flapper dress, at a lavish Art Deco party with champagne and jazz musicians in the background.',
    icon: '🎷',
    color: 'from-purple-600 to-indigo-900'
  },
  {
    id: 'cyberpunk-2077',
    name: 'Cyberpunk 2077',
    description: 'Neon lights, high-tech, and dystopian vibes.',
    prompt: 'Cyberpunk future city, wearing futuristic tech-wear with glowing neon accents, standing in a rainy street filled with holograms and flying cars.',
    icon: '🦾',
    color: 'from-pink-500 to-cyan-600'
  },
  {
    id: 'wild-west',
    name: 'Wild West',
    description: 'Cowboys, saloons, and dusty frontiers.',
    prompt: 'The Wild West, wearing cowboy gear with a leather hat and vest, standing outside a wooden saloon in a dusty frontier town at high noon.',
    icon: '🤠',
    color: 'from-orange-700 to-red-900'
  },
  {
    id: 'medieval-knight',
    name: 'Medieval Kingdom',
    description: 'Castles, armor, and epic quests.',
    prompt: 'Medieval era, wearing shining silver plate armor or royal velvet robes, standing in the courtyard of a massive stone castle with banners flying.',
    icon: '⚔️',
    color: 'from-slate-600 to-slate-800'
  },
  {
    id: 'space-explorer',
    name: 'Deep Space',
    description: 'Astronauts, alien worlds, and starlight.',
    prompt: 'Sci-fi deep space, wearing a high-tech sleek spacesuit, standing on the surface of an alien planet with ringed planets and a colorful nebula in the sky.',
    icon: '🚀',
    color: 'from-blue-700 to-violet-900'
  },
  {
    id: 'prehistoric',
    name: 'Prehistoric',
    description: 'Dinosaurs, jungles, and survival.',
    prompt: 'Prehistoric era, wearing rugged fur clothing, standing in a lush primeval jungle with a friendly triceratops in the background.',
    icon: '🦕',
    color: 'from-green-700 to-emerald-900'
  }
];

export const API_MODELS = {
  EDIT: 'gemini-2.5-flash-image', // Used for "Time Travel" transformation and text editing
  ANALYZE: 'gemini-3-pro-preview', // Used for image analysis
};