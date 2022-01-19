import { NetworksEnum } from '$lib/constants';
import { derived, writable } from 'svelte/store';

export const globalStore = writable({
	activeNetwork: NetworksEnum.ETHEREUM
});
