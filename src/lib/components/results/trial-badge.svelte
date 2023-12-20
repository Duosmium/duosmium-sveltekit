<script lang="ts">
	import InfoBadge from './info-badge.svelte';
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<InfoBadge
	text="Trial"
	description="Placings in this event did not count towards total team score."
	class={className}
/>
