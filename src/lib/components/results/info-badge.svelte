<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Badge } from '$lib/components/ui/badge';
	export let text: string;
	export let description: string;
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<Tooltip.Root>
	<Tooltip.Trigger asChild let:builder>
		<Badge builders={[builder]} variant="outline" class={className}>{text}</Badge>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>{description}</p>
	</Tooltip.Content>
</Tooltip.Root>
