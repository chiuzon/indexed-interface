export enum NetworksEnum {
	ETHEREUM = 1,
	ETHEREUM_RINKEBY = 4
}

export interface IIndexPools {
	[key: number]: {
		[key: string]: {
			icon: string;
			name: string;
			description: string;
			address: string;
		};
	};
}
