import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const lightPalette = {
  backgroundMain: '#FFFAF5',
  backgroundSecondary: '#FCEEF1',
  surfaceCard: '#FFFFFF',
  primaryMain: '#B76E83',
  primarySoft: '#F4C9D4',
  textHeading: '#754D59',
  textBody: '#393438',
  textMuted: '#75676D',
  borderDefault: '#EADDE0',
  accentSage: '#A8BFA3',
  accentLavender: '#E9E0F4',
  accentPeach: '#F8D9C4',
} as const

const darkPalette = {
  backgroundMain: '#211B24',
  backgroundSecondary: '#392D39',
  surfaceCard: '#302631',
  primaryMain: '#E9AFC1',
  primarySoft: '#503746',
  textHeading: '#F5E7EC',
  textBody: '#E1D5DC',
  textMuted: '#CBB9C4',
  borderDefault: '#4B3A48',
  accentSage: '#B4C9AC',
  accentLavender: '#C9B7E2',
  accentPeach: '#E7BDA8',
} as const

const semanticColor = (light: string, dark: string) => ({
  value: {
    _light: light,
    _dark: dark,
  },
})

const bloomCraftConfig = defineConfig({
  preflight: false,
  globalCss: {
    'html, body': {
      bg: 'background.main',
      color: 'text.body',
      fontFamily: 'body',
    },
    body: {
      transitionProperty: 'background-color, color',
      transitionDuration: 'moderate',
      transitionTimingFunction: 'ease-out',
    },
    'h1, h2, h3, h4, h5, h6': {
      color: 'text.heading',
      fontFamily: 'heading',
    },
    'input, textarea, select': {
      bg: 'surface.card',
      borderColor: 'border.default',
      color: 'text.body',
    },
    'input::placeholder, textarea::placeholder': {
      color: 'text.muted',
      opacity: 1,
    },
    "[data-scope='dialog'][data-part='content'], [data-scope='menu'][data-part='content'], [data-scope='popover'][data-part='content']":
      {
        bg: 'surface.card',
        borderColor: 'border.default',
        color: 'text.body',
      },
    ':focus-visible': {
      outline: '3px solid',
      outlineColor: 'primary.main',
      outlineOffset: '3px',
    },
    '::selection': {
      bg: 'primary.soft',
      color: 'text.heading',
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: {
          value: "'Playfair Display', Georgia, serif",
        },
        body: {
          value: "'Be Vietnam Pro', system-ui, sans-serif",
        },
      },
    },
    semanticTokens: {
      colors: {
        background: {
          main: semanticColor(lightPalette.backgroundMain, darkPalette.backgroundMain),
          secondary: semanticColor(
            lightPalette.backgroundSecondary,
            darkPalette.backgroundSecondary,
          ),
        },
        surface: {
          card: semanticColor(lightPalette.surfaceCard, darkPalette.surfaceCard),
        },
        primary: {
          main: semanticColor(lightPalette.primaryMain, darkPalette.primaryMain),
          soft: semanticColor(lightPalette.primarySoft, darkPalette.primarySoft),
          onSoft: semanticColor(lightPalette.textHeading, darkPalette.textHeading),
        },
        text: {
          heading: semanticColor(lightPalette.textHeading, darkPalette.textHeading),
          body: semanticColor(lightPalette.textBody, darkPalette.textBody),
          muted: semanticColor(lightPalette.textMuted, darkPalette.textMuted),
        },
        border: {
          default: semanticColor(lightPalette.borderDefault, darkPalette.borderDefault),
        },
        accent: {
          sage: semanticColor(lightPalette.accentSage, darkPalette.accentSage),
          onSage: semanticColor(lightPalette.textBody, darkPalette.backgroundMain),
          lavender: semanticColor(
            lightPalette.accentLavender,
            darkPalette.accentLavender,
          ),
          peach: semanticColor(lightPalette.accentPeach, darkPalette.accentPeach),
          onPeach: semanticColor(lightPalette.textHeading, darkPalette.backgroundMain),
        },
        bg: {
          DEFAULT: semanticColor(lightPalette.backgroundMain, darkPalette.backgroundMain),
          subtle: semanticColor(
            lightPalette.backgroundSecondary,
            darkPalette.backgroundSecondary,
          ),
          panel: semanticColor(lightPalette.surfaceCard, darkPalette.surfaceCard),
        },
        fg: {
          DEFAULT: semanticColor(lightPalette.textBody, darkPalette.textBody),
          muted: semanticColor(lightPalette.textMuted, darkPalette.textMuted),
        },
      },
    },
  },
})

export const bloomCraftSystem = createSystem(defaultConfig, bloomCraftConfig)
