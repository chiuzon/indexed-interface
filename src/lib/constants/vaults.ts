import { NetworksEnum } from './types';
import type { IVaults } from './types';

export const VAULTS: IVaults = {
	[NetworksEnum.ETHEREUM]: {
		'sushi-nirn-vault': {
			icon: '',
			name: 'SUSHI Nirn Vault',
			address: '0x126c121f99e1e211df2e5f8de2d96fa36647c855'
		}
	}
};
