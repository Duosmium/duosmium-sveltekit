<script lang="ts">
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import { Metadata, SiteFooter, SiteHeader } from '$lib/components';
	import { updateTheme } from '$lib/utils';
	import { config } from '$lib/stores';
	import { ModeWatcher } from 'mode-watcher';

	$: updateTheme($config.theme, $page.url.pathname);
	import '../app.pcss';
</script>

<ModeWatcher />

<Metadata />

<div class="relative flex min-h-screen flex-col" id="page">
	<SiteHeader />
	<div class="flex-1">
		<slot />
	</div>
	<SiteFooter />
</div>
