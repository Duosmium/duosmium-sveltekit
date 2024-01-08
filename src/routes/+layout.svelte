<script lang="ts">
	import { page } from '$app/stores';
	import { Metadata, SiteFooter, SiteHeader } from '$lib/components';
	import { updateTheme } from '$lib/utils';
	import { config } from '$lib/stores';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';

	$: updateTheme($config.theme, $page.url.pathname);
	import '../app.pcss';
</script>

<ModeWatcher />

<Metadata />

<div class="relative flex min-h-screen flex-col" id="page">
	<SiteHeader />
	<div class="flex-1">
		<slot />
		<Toaster />
	</div>
	<SiteFooter />
</div>
