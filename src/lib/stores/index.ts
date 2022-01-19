import { NetworksEnum } from '$lib/constants';
import { derived, writable } from 'svelte/store';

export const networkStore = writable({
	activeNetwork: NetworksEnum.ETHEREUM
});
