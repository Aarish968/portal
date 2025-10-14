import type { Preset } from 'unocss'
import presetThevetatSpacing from './preset-thevetat-spacing'
import presetThevetatTypography from './preset-thevetat-typography'
import presetThevetatColors from './preset-thevetat-colors'

export function presetThevetatBase(): Preset {
  return {
    name: 'unocss-preset-thevetat-base',
    presets: [
      presetThevetatSpacing(),
      presetThevetatTypography(),
      presetThevetatColors(),
    ],
    shortcuts: [
      // ╭────────────────────────────────────────────────────────────────────╮
      // │ Misc                                                               │
      // ╰────────────────────────────────────────────────────────────────────╯
      ['base-img', 'object-cover w-full h-full select-none'],
      ['text-overflow', 'overflow-hidden whitespace-nowrap text-ellipsis'],
      ['accent-square-size', 'absolute h-12.5 w-12.5 md:h-20 md:w-20 z-1'],
      ['photo-hover', 'hover:scale-110 transition-all duration-500 ease-in-out'],
      ['border-hover', 'border border-transparent hover:border-primary-muted color-trans'],
    ],
    rules: [
      [
        'animate-accordion-down',
        {
          animation: 'shadcn-down 0.2s ease-out',
        },
      ],
      [
        'animate-accordion-up',
        {
          animation: 'shadcn-up 0.2s ease-out',
        },
      ],
      [
        'animate-collapsible-down',
        {
          animation: 'shadcn-collapsible-down 0.2s ease-out',
        },
      ],
      [
        'animate-collapsible-up',
        {
          animation: 'shadcn-collapsible-up 0.2s ease-out',
        },
      ],
    ],
  }
}

export default presetThevetatBase
