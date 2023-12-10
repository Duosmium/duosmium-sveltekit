<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
</script>

<div class="flex flex-col w-full max-w-sm gap-1.5">
	<Label for="email">Email</Label>
	<Input type="email" id="email" placeholder="email" />
</div>
