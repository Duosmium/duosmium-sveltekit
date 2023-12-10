<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import type { Result } from '@prisma/client';
	import OfficialBadge from './official-badge.svelte';
	import PreliminaryBadge from './preliminary-badge.svelte';
	export let meta: Result;
</script>

<Card.Root class="flex flex-col">
	<a href="/results/{meta.duosmium_id}" class="flex flex-grow flex-col">
		<Card.Header>
			<Card.Title class="leading-tight hover:underline">{meta.full_title}</Card.Title>
			<Card.Description>{meta.date} @ {meta.location_name}</Card.Description>
			<div>
				{#if meta.official}
					<OfficialBadge />
				{/if}
				{#if meta.preliminary}
					<PreliminaryBadge />
				{/if}
			</div>
		</Card.Header>
		<Card.Content class="bg-no-repeat bg-center flex-grow flex flex-col-reverse">
			<img
				src={meta.logo}
				alt="Logo for the {meta.full_title}"
				width="1024"
				height="1024"
				class="object-contain inset-0 mx-auto mb-0"
			/>
		</Card.Content>
	</a>
	<Card.Footer>
		<Button href="/results/{meta.duosmium_id}">Full Results</Button>
	</Card.Footer>
</Card.Root>
