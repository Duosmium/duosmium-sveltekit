<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<style>
    pre {
        max-width: 100%;
    }
</style>

<h1>Results</h1>

This page contains results for tournament <code>{data.slug}</code>. This page shows the superscored results.

<pre>
	{data.yaml}
</pre>