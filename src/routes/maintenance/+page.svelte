<script lang="ts">
	import { beforeNavigate } from '$app/navigation';

	beforeNavigate(async ({ cancel }) => {
		cancel();
	});
</script>

<div class="container relative">
	<h1 class="text-center tracking-tight font-bold text-4xl pt-8">Under Maintenance</h1>
	<p class="text-center pt-4">Please check back later. Thank you for your patience.</p>
</div>
