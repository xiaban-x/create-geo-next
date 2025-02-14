import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetUno,
} from 'unocss'

export default defineConfig({
    content: {
        filesystem: [
            '**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}',
        ],
    },
    presets: [
        presetUno({
            dark: 'media',
        }),
        presetAttributify(),
        presetIcons({
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle',
            },
        }),
    ],
})