<script lang="ts">
	import InfoBadge from './info-badge.svelte';
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<InfoBadge
	text="Official"
	description="This information was published on Duosmium by, or on behalf of, the tournament organizers."
	class={className}
/>
