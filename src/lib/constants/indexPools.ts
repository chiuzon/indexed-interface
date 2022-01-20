import type { IIndexPools } from './types';
import { NetworksEnum } from './types';

export const INDEX_POOLS: IIndexPools = {
	[NetworksEnum.ETHEREUM]: {
		'degen-index': {
			icon: 'https://indexed.finance/static/media/degen.262b6e05.png',
			name: 'Degen Index',
			description:
				'A higher risk/reward index of promising Ethereum protocols that are judged as having significant room to grow.',
			address: '0x126c121f99e1e211df2e5f8de2d96fa36647c855'
		},
		'nft-platform-index': {
			icon: 'https://indexed.finance/static/media/nftp.5aa8d8be.png',
			name: 'NFT Platform Index',
			description:
				'A collectors index of governance and protocol tokens drawn from both the NFT space and the wider Metaverse.',
			address: '0x68bB81B3F67f7AAb5fd1390ECB0B8e1a806F2465'
		},
		'oracle-top-5-tokens-index': {
			icon: 'https://indexed.finance/static/media/orcl5.8f5965ee.png',
			name: 'Oracle Top 5 Tokens Index',
			description:
				'An index representing the current market leaders in protocols designed to bring external/real-world data onto the blockchain.',
			address: '0xD6cb2aDF47655B1bABdDc214d79257348CBC39A7'
		}
	}
};

export const FEATURED_INDEX_POOLS = [
	'degen-index',
	'nft-platform-index',
	'oracle-top-5-tokens-index'
];
