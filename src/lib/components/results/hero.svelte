<script lang="ts">
	import { siteConfig } from '$lib/config/site';
	import type { Result } from '@prisma/client';
	import ResultRecentList from './result-recent-list.svelte';
	import ResultCountGrid from './result-count-grid.svelte';
	export let recentResults: Result[];
	export let countsByLevel: object;
</script>

<div class="pt-8 pb-4 px-4">
	<h1 class="text-center tracking-tight font-bold text-4xl">{siteConfig.name}</h1>
	<div class="flex flex-col lg:flex-row justify-between max-h-full">
		<ResultRecentList results={recentResults} />
		<ResultCountGrid {countsByLevel} />
	</div>
</div>
