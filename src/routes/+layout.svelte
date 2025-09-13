<script lang="ts">
	import Navbar from '$lib/components/common/navbar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Duosmium Results</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Navbar />
	<main class="container mx-auto my-8 flex-1">
		{@render children()}
	</main>
</div>
