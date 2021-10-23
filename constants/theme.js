const COLORS_DEFAULT = {
  name: 'Cyan',
  primary: '#60a3bc',
  primaryDark: '#3c6382',
  secondary: '#82ccdd',
  _primary: '#60a3bc',
  _secondary: '#2f3C4e',
  _accent: '#fca311',
  _base: '#f5f5f5',
  _white: '#ffffff',
  _text: '#191a1a',
  _success: '#43a047',
  _warning: '#ff9800',
  _error: '#d32f2f',
  _clickable: '#0654ba',
  _hightLight: '#fffde7'
}

const COLORS = [
  COLORS_DEFAULT,
  {
    name: 'Green',
    primary: '#7cb342',
    primaryDark: '#008A00',
    secondary: '#A4C400',
    _primary: '#7cb342',
    _secondary: '#2f3C4e',
    _accent: '#fca311',
    _base: '#f5f5f5',
    _white: '#ffffff',
    _text: '#191a1a',
    _success: '#43a047',
    _warning: '#ff9800',
    _error: '#d32f2f',
    _clickable: '#0654ba',
    _hightLight: '#fffde7'
  },
  {
    name: 'Navy',
    primary: '#0f536e',
    primaryDark: '#082a38',
    secondary: '#2295c3',
    _primary: '#0f536e',
    _secondary: '#14213d',
    _accent: '#e63946',
    _base: '#f5f5f5',
    _white: '#ffffff',
    _text: '#191a1a',
    _success: '#43a047',
    _warning: '#ff9800',
    _error: '#d32f2f',
    _clickable: '#0654ba',
    _hightLight: '#fffde7'
  },
  {
    name: 'Pink',
    primary: '#f48fb1',
    primaryDark: '#C2185B',
    secondary: '#F8BBD0',
    _primary: '#f48fb1',
    _secondary: '#14213d',
    _accent: '#0081a7',
    _base: '#f5f5f5',
    _white: '#ffffff',
    _text: '#191a1a',
    _success: '#43a047',
    _warning: '#ff9800',
    _error: '#d32f2f',
    _clickable: '#0654ba',
    _hightLight: '#fffde7'
  },
  {
    name: 'Yellow',
    primary: '#ffb300',
    primaryDark: '#F57F17',
    secondary: '#FFF176',
    _primary: '#ffb300',
    _secondary: '#14213d',
    _accent: '#2ec479',
    _base: '#f5f5f5',
    _white: '#ffffff',
    _text: '#191a1a',
    _success: '#43a047',
    _warning: '#ff9800',
    _error: '#d32f2f',
    _clickable: '#0654ba',
    _hightLight: '#fffde7'
  }
]

const BACKGROUND_DEFAULT = { path: '/images/backgrounds/andre-ouellet-cga32YQt0Kw-unsplash.jpg' }

const BACKGROUNDS = [
  { path: '/images/backgrounds/andre-ouellet-cga32YQt0Kw-unsplash.jpg' },
  { path: '/images/backgrounds/chang-duong-qJXGIsF_wwo-unsplash.jpg' },
  { path: '/images/backgrounds/kiril-dobrev-UB0QiVPsXgc-unsplash.jpg' },
  { path: '/images/backgrounds/linh-pham-gm-ZwnNSpVg-unsplash.jpg' },
  { path: '/images/backgrounds/seb-MOsRi5Ou_mU-unsplash.jpg' },
  { path: '/images/backgrounds/thinh-nguyen-A6Fg9OvGkpI-unsplash.jpg' },
  { path: '/images/backgrounds/tuan-anh-tran-tHfJ3mevHi0-unsplash.jpg' },
  { path: '/images/backgrounds/tuan-thanh-cao-6lrnBIBUbgg-unsplash.jpg' },
  { path: '/images/backgrounds/vu-khoi-pLWHT92RFg4-unsplash.jpg' }
]

export const THEME = Object.freeze({
  COLORS,
  COLORS_DEFAULT,
  BACKGROUNDS,
  BACKGROUND_DEFAULT
})
