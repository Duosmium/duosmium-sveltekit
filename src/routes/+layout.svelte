<script lang="ts">
	import { page } from '$app/stores';
	import { Metadata, SiteFooter, SiteHeader } from '$lib/components';
	import { updateTheme } from '$lib/utils';
	import { config } from '$lib/stores';
	import { ModeWatcher } from 'mode-watcher';
	import Toaster, { addToast } from '$lib/components/toaster.svelte';
	const flash = getFlash(page);
	flash.subscribe(($flash) => {
		if (!$flash) return;

		if ($flash.type == 'success') {
			addToast({
				title: 'Success',
				description: $flash.message
			});
		} else {
			addToast({
				title: 'Error',
				description: $flash.message,
				variant: 'destructive'
			});
		}
		// Clearing the flash message could sometimes
		// be required here to avoid double-toasting.
		flash.set(undefined);
	});

	$: updateTheme($config.theme, $page.url.pathname);
	import '../app.pcss';
	import { getFlash } from 'sveltekit-flash-message';
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
