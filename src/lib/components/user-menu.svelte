<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	// import * as Avatar from "$lib/components/ui/avatar";
	import { Person } from 'radix-icons-svelte';
	import { page } from '$app/stores';
	$: user = $page.data.session?.user;
	$: pathname = $page.url.pathname;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost" class="w-9 px-0">
			{#if user === undefined}
				<Person
					class="h-[1.2rem] w-[1.2rem] scale-100"
				/>
			{:else}
				<Person
					class="h-[1.2rem] w-[1.2rem] scale-100"
					color="green"
				/>
			{/if}
<!--			<Avatar.Root class="w-6 h-6">-->
<!--				<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />-->
<!--				<Avatar.Fallback>ME</Avatar.Fallback>-->
<!--			</Avatar.Root>-->
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		{#if user === undefined}
			<DropdownMenu.Item href="/auth/login?next={pathname}">Log In</DropdownMenu.Item>
		{:else}
			<DropdownMenu.Item href="/auth/logout?next={pathname}">Log Out</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
