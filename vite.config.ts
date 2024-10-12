// vite.config.js
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import usePHP from 'vite-plugin-php';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { imagetools } from 'vite-imagetools';
import { existsSync } from 'node:fs';
import Vue from '@vitejs/plugin-vue';
import { liveDesigner } from '@pinegrow/vite-plugin';

export default defineConfig(({ command }) => {
	const publicBasePath = '/php-vite-starter/'; // Change if deploying under a nested public path. Needs to end with a /. See https://vitejs.dev/guide/build.html#public-base-path

	const base = command === 'serve' ? '/' : publicBasePath;
	const BASE = base.substring(0, base.length - 1);

	return {
		base,
		plugins: [
			liveDesigner({
				startupPage: './pages/index.php',
				experimental: {
					designableFileTypes: ['.php'],
				},
				tailwindcss: {
					/* Please ensure that you update the filenames and paths to accurately match those used in your project. */
					configPath: 'tailwind.config.ts',
					cssPath: 'src/styles/global.scss',
					// themePath: false, // Set to false so that Design Panel is not used
					// restartOnConfigUpdate: true,
					restartOnThemeUpdate: true,
				},
				//...
			}),
			Vue(),
			imagetools(),
			usePHP({
				entry: ['index.php', 'pages/**/*.php', 'partials/**/*.php'],
				rewriteUrl(requestUrl) {
					const filePath = fileURLToPath(
						new URL('.' + requestUrl.pathname, import.meta.url),
					);
					const publicFilePath = fileURLToPath(
						new URL(
							'./public' + requestUrl.pathname,
							import.meta.url,
						),
					);

					if (
						!requestUrl.pathname.includes('.php') &&
						(existsSync(filePath) || existsSync(publicFilePath))
					) {
						return undefined;
					}

					requestUrl.pathname = 'index.php';

					return requestUrl;
				},
			}),
			ViteEjsPlugin({
				BASE,
			}),
			viteStaticCopy({
				targets: [
					{ src: 'public', dest: '' },
					{ src: 'system', dest: '' },
					{ src: 'vendor', dest: '' },
				],
				silent: command === 'serve',
			}),
		],
		define: {
			'BASE': JSON.stringify(BASE),
			'import.meta.env.BASE': JSON.stringify(BASE),
		},
		resolve: {
			alias: {
				/* Must be either an object, or an array of { find, replacement, customResolver } pairs. */
				/* Refer to: https://vitejs.dev/config/shared-options.html#resolve-alias */
				/* Please ensure that you update the filenames and paths to accurately match those used in your project. */

				'@': fileURLToPath(new URL('./src', import.meta.url)),
				'~': fileURLToPath(new URL('./src', import.meta.url)),
				'~~': fileURLToPath(new URL('./', import.meta.url)),
			},
		},
		publicDir: command === 'build' ? 'raw' : 'public',
		server: {
			port: 3000,
		},
		build: {
			assetsDir: 'public',
			emptyOutDir: true,
		},
	};
});
