<script lang="ts">
	import { siteConfig } from '$lib/config/site';
	import { Icons } from './icons';
</script>

<footer class="py-6 md:px-8 md:py-0">
	<div class="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
		<div class="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
			<Icons.logo class="hidden h-6 w-6 md:inline-block" />
			<p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
				Built with love and{' '}
				<a
					href="https://kit.svelte.dev/"
					target="_blank"
					rel="noreferrer"
					class="font-medium underline underline-offset-4"
				>
					SvelteKit
				</a>
				by the Duosmium Results team.
			</p>
		</div>
	</div>
</footer>
