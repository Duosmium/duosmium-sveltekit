<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
</script>

<div class="flex flex-col w-full max-w-sm gap-1.5">
	<Label for="email-2">Email</Label>
	<Input type="email" id="email-2" placeholder="Email" />
	<p class="text-sm text-muted-foreground">Enter your email address.</p>
</div>
