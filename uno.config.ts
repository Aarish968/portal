import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import presetAnimations from 'unocss-preset-animations'
import { presetShadcn } from 'unocss-preset-shadcn'
import { presetThevetatBase } from './src/base_submod/lib/uno/preset-thevetat-base'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetAnimations(),
    presetShadcn({
      color: 'violet',
    }),
    presetTypography(),
    presetAttributify(),

    presetWebFonts({
      provider: 'bunny',
      fonts: {
        sans: ['Montserrat', 'Montserrat:400,500,600,700'],
        hind: ['Hind', 'Hind:400,500,600,700'],
        secondary: ['Comfortaa', 'Comfortaa:500'],
        mono: ['JetBrains Mono', 'JetBrains Mono:400,500,600,700'],
        display: ['Plus Jakarta Sans', 'Plus Jakarta Sans:600, 700'],
      },
    }),
    presetThevetatBase(),
  ],
  transformers: [
    transformerDirectives(),
    transformerCompileClass({
      classPrefix: 'porter-',
    }),
    transformerVariantGroup(),
  ],

})
