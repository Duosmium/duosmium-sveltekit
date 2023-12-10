<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
</script>

<Tooltip.Root>
	<Tooltip.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline">Hover</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>Add to library</p>
	</Tooltip.Content>
</Tooltip.Root>
