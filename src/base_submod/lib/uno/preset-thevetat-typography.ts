import type { Preset } from 'unocss'

export function presetThevetatTypography(): Preset {
  return {
    name: 'unocss-preset-thevetat-typography',
    safelist: 'prose prose-md prose-lg prose-xl m-auto text-left'.split(' '),
    shortcuts: [
      ['text-style-h1', 'text-primary font-sans font-semibold text-[2.25rem] leading-[1.22] lg:text-[3.375rem] lg:leading-[1.2] select-none'],
      ['text-style-h2', 'text-primary font-sans font-semibold text-[2rem] leading-[1.25] lg:text-[2.5rem] lg:leading-[1.2] select-none'],
      ['text-style-h3', 'text-primary font-sans font-semibold text-[1.75rem] leading-[1.3] lg:text-[2.188rem] lg:leading-[1.25] select-none'],
      ['text-style-h4', 'text-primary font-sans font-semibold text-[1.5rem] leading-[1.3] lg:text-[1.875rem] lg:leading-[1.25] select-none'],
      ['text-style-h5', 'text-primary font-sans font-semibold text-[1.25rem] leading-[1.4] lg:text-[1.125rem] lg:leading-[1.3] select-none'],
      ['text-style-body-lg', 'font-medium text-[1.125rem] leading-[1.5] lg:text-[1.25rem] lg:leading-[1.6] tracking-[-0.5%]'],
      ['text-style-body', 'text-[1rem] leading-[1.5] lg:text-[1.125rem] lg:leading-[1.6]'],
      ['text-style-body-sm', 'text-[0.875rem] leading-[1.5] lg:text-[0.938rem] lg:leading-[1.6]'],
      ['text-style-body-xs', 'text-[0.75rem] leading-[1.5] lg:text-[0.813rem] lg:leading-[1.6]'],
      ['text-style-caption', 'text-[0.688rem] leading-[1.4] lg:text-[0.75rem] lg:leading-[1.5]'],
      ['text-style-small', 'text-[0.625rem] leading-[1.4] lg:text-[0.688rem] lg:leading-[1.5]'],
    ],
    rules: [
      ['font-thin', { 'font-weight': '100', 'font-variation-settings': '"wght" 100' }],
      ['font-extralight', { 'font-weight': '200', 'font-variation-settings': '"wght" 200' }],
      ['font-light', { 'font-weight': '300', 'font-variation-settings': '"wght" 300' }],
      ['font-normal', { 'font-weight': '400', 'font-variation-settings': '"wght" 400' }],
      ['font-medium', { 'font-weight': '500', 'font-variation-settings': '"wght" 500' }],
      ['font-semibold', { 'font-weight': '600', 'font-variation-settings': '"wght" 600' }],
      ['font-bold', { 'font-weight': '700', 'font-variation-settings': '"wght" 700' }],
      ['font-extrabold', { 'font-weight': '800', 'font-variation-settings': '"wght" 800' }],
      ['font-black', { 'font-weight': '900', 'font-variation-settings': '"wght" 900' }],
    ],
  }
}

export default presetThevetatTypography
