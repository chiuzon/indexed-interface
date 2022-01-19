import { NetworksEnum } from '$lib/constants';
import { writable } from 'svelte/store';

export const globalStore = writable({
	activeNetwork: NetworksEnum.ETHEREUM
});
