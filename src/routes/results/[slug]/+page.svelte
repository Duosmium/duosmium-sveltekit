<script lang="ts">
	import type { PageServerData } from './$types';
	import { getInterpreter } from '$lib/interpreter';
	export let data: PageServerData;
	export const interpreter = getInterpreter(data.yaml)
</script>

<style>
    pre {
        max-width: 100%;
    }
</style>

<h1>Results</h1>

This page contains results for tournament <code>{data.slug}</code>. This page shows the standard results.

<pre>
	{data.yaml}
</pre>

