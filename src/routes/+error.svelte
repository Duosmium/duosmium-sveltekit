<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="container relative">
	<h1 class="text-center tracking-tight font-bold text-4xl pt-8">
		{$page.status}: {$page.error.message}
	</h1>
	<div class="flex flex-auto pt-8">
		<Button href="/" class="mx-auto">Home</Button>
	</div>
</div>
