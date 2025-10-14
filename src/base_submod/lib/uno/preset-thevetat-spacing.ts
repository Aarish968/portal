import type { Preset } from 'unocss'

type SpacingType = 'section' | 'primary' | 'secondary' | 'tertiary' | 'quaternary'

const spacingValues = {
  section: { mobile: 10, tablet: 10, desktop: 16 },
  primary: { mobile: 8, tablet: 8, desktop: 10 },
  secondary: { mobile: 6, tablet: 6, desktop: 8 },
  tertiary: { mobile: 4, tablet: 4, desktop: 6 },
  quaternary: { mobile: 2, tablet: 2, desktop: 2 },
}

function getSpacingClasses(type: SpacingType, prefix: string, direction?: string) {
  direction = direction || ''
  const mobile = `${prefix}${direction}-${spacingValues[type].mobile}`
  const tablet = `md:${prefix}${direction}-${spacingValues[type].tablet}`
  const desktop = `lg:${prefix}${direction}-${spacingValues[type].desktop}`

  const result = `${mobile} ${tablet} ${desktop}`
  return result
}

function getSpacingXYClasses(type: SpacingType, axis: 'x' | 'y') {
  const mobile = `space-${axis}-${spacingValues[type].mobile}`
  const tablet = `md:space-${axis}-${spacingValues[type].tablet}`
  const desktop = `lg:space-${axis}-${spacingValues[type].desktop}`

  const result = `${mobile} ${tablet} ${desktop}`
  return result
}

export function presetThevetatSpacing(): Preset {
  return {
    name: 'unocss-preset-thevetat-spacing',
    shortcuts: [
      [/^([mp])([tblrxy])?-(section|primary|secondary|tertiary|quaternary)$/, ([, prefix, direction, type]) => getSpacingClasses(type as SpacingType, prefix, direction)],
      [/^space-([xy])-(section|primary|secondary|tertiary|quaternary)$/, ([, axis, type]) => getSpacingXYClasses(type as SpacingType, axis as 'x' | 'y')],
      [/^gap-(section|primary|secondary|tertiary|quaternary)$/, ([, type]) => getSpacingClasses(type as SpacingType, 'gap')],

      // ╭────────────────────────────────────────────────────────────────────╮
      // │ Spacing                                                            │
      // ╰────────────────────────────────────────────────────────────────────╯
      ['page-width', 'max-w-2000px'],
      ['page-px', 'px-4 md:px-6'],
      ['page-mx', 'mx-4 md:mx-6'],
      ['page-py', 'py-4 md:py-6'],
      ['page-my', 'my-4 md:my-6'],
      ['section-padding', 'px-4 pb-4 md:px-6 md:pb-6'],
      ['page-size', 'page-width page-mx page-my '],
      ['2col', 'grid grid-cols-1 lg:grid-cols-2'],
      ['3col', 'grid grid-cols-1 lg:grid-cols-3'],
      ['4col', 'grid grid-cols-1 lg:grid-cols-4'],
      ['5col', 'grid grid-cols-1 lg:grid-cols-5'],
      ['base-grid', 'grid grid-cols-12 gap-4'],
      ['center', 'justify-center items-center'],
      ['flex-center', 'flex center'],
      ['flex-col-center', 'flex flex-col center'],

    ],
    theme: {
      breakpoints: {
        'sm': '390px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1600px',
      },
    },
  }
}

export default presetThevetatSpacing
