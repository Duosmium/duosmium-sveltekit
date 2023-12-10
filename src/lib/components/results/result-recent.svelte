<script lang="ts">
	import type { Result } from '@prisma/client';

	export let result: Result;
</script>

<li class="list-inside">
	<a href="/results/{result.duosmium_id}" class="text-md hover:underline">
		{result.full_short_title}
	</a>
</li>
