<script lang="ts">
	export let letters: string[];
</script>

<ol class="flex flex-wrap list-none justify-center py-2">
	{#each letters as l}
		<li
			class="before:content-['•'] before:mx-2 first:before:content-none first:before:mx-0 text-lg"
		>
			<a href="/results/schools/{l}" class="text-sky-700 dark:text-sky-500 hover:underline">
				{l.toUpperCase()}
			</a>
		</li>
	{/each}
</ol>
