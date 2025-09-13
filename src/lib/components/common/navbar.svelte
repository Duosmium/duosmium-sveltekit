<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import Logo from './logo.svelte';
</script>

<Navbar>
	<NavBrand href="/">
		<Logo class="me-3 h-6" />
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Duosmium</span
		>
	</NavBrand>
	<NavHamburger />
	<NavUl>
		<NavLi href="/results/all">All Results</NavLi>
		<NavLi href="/results/schools">Schools</NavLi>
	</NavUl>
</Navbar>
