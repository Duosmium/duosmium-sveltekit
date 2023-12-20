<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Accordion from '$lib/components/ui/accordion';
	import TeamDialogTable from '$lib/components/results/team-dialog-table.svelte';
	import { ordinalize } from '$lib/global/helpers';
	export let teamNumber: number;
	export let teamData: {
		number: number;
		team: string;
		school: string;
		suffix: string | undefined;
		location: string;
		disqualified: boolean;
		exhibition: boolean;
		attended: boolean | undefined;
		earnedBid: boolean;
		rank: number;
		points: number;
		penalties: number;
	};
	export let tableData: {
		name: string;
		points: string;
		place: string;
		notes: string;
		medals: number;
	}[];
	const formattedTeamName = `${teamData.school}${teamData.suffix ? ` ${teamData.suffix}` : ''} (${
		teamData.location
	})`;
	const formattedSchoolName = `${teamData.school} (${teamData.location})`;
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-full h-full"><slot /></Dialog.Trigger>
	<Dialog.Content
		class="max-h-[90vh] overflow-y-auto xs:max-w-[80vw] md:max-w-[60vw] xl:max-w-[40vw]"
	>
		<Dialog.Header>
			<Dialog.Title>Information for Team {teamNumber}</Dialog.Title>
			<Dialog.Description>
				{formattedTeamName} placed {ordinalize(teamData.rank)} overall with a total score of{' '}
				{teamData.points} points.
			</Dialog.Description>
		</Dialog.Header>
		<Accordion.Root class="w-full">
			<Accordion.Item value="item-1">
				<Accordion.Trigger class="py-2">Event Details</Accordion.Trigger>
				<Accordion.Content>
					<TeamDialogTable {tableData} />
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
		<Dialog.Footer class="text-sm sm:justify-center hover:underline">
			<a href="/results/schools/{formattedSchoolName.charAt(0).toLowerCase()}#{formattedSchoolName}"
				>View results for {formattedSchoolName} in other tournaments</a
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
