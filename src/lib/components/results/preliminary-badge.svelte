<script lang="ts">
	import InfoBadge from './info-badge.svelte';
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<InfoBadge
	text="Preliminary"
	description="Results for this tournament have not been finalized and are subject to change."
	class={className}
/>
