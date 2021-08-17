const initialState = {
  totalPrizesUsd: 123456,
  sortedIds: [3, 2, 1],
  draws: {
    3: {
      id: 3,
      name: 'CAKE',
      number: 3,
      date: 12345678,
      token: 'CAKE',
      sponsorToken: 'POTS',
      prizePot: [
        { token: 'CAKE', oracleId: 'Cake', amount: 4640 },
        { token: 'POTS', oracleId: 'POTS', amount: 40000 },
      ],
      winners: [
        {
          address: '0x0',
          staked: '1',
          prizes: {
            CAKE: 928,
            POTS: 8000,
          },
        },
        {
          address: '0x1',
          staked: '10',
          prizes: {
            CAKE: 928,
            POTS: 8000,
          },
        },
        {
          address: '0x2',
          staked: '1000',
          prizes: {
            CAKE: 928,
            POTS: 8000,
          },
        },
        {
          address: '0x3',
          staked: '10000',
          prizes: {
            CAKE: 928,
            POTS: 8000,
          },
        },
        {
          address: '0x4',
          staked: '100000',
          prizes: {
            CAKE: 928,
            POTS: 8000,
          },
        },
      ],
    },
    2: {
      id: 2,
      name: 'CAKE',
      number: 2,
      date: 12345678,
      token: 'CAKE',
      sponsorToken: 'DODO',
      numberOfWinners: 5,
      prizePot: [
        { token: 'CAKE', oracleId: 'Cake', amount: 3780 },
        { token: 'DODO', oracleId: 'DODO', amount: 33750 },
      ],
      winners: [
        {
          address: '0x0',
          staked: '1',
          prizes: {
            CAKE: 928,
            POTS: 8000,
          },
        },
        {
          address: '0x1',
          staked: '10',
          prizes: {
            CAKE: 928,
            POTS: 8000,
          },
        },
        {
          address: '0x2',
          staked: '1000',
          prizes: {
            CAKE: 928,
            POTS: 8000,
          },
        },
        {
          address: '0x3',
          staked: '10000',
          prizes: {
            CAKE: 928,
            POTS: 8000,
          },
        },
        {
          address: '0x4',
          staked: '100000',
          prizes: {
            CAKE: 928,
            POTS: 8000,
          },
        },
      ],
    },
    1: {
      id: 1,
      number: 3,
      name: 'CAKE',
      date: 12345678,
      token: 'CAKE',
      sponsorToken: 'BIFI',
      numberOfWinners: 5,
      prizePot: [
        { token: 'CAKE', oracleId: 'Cake', amount: 1764 },
        { token: 'BIFI', oracleId: 'BIFI', amount: 56.75 },
      ],
      winners: [
        {
          address: '0x0',
          staked: '1',
          prizes: {
            CAKE: 928,
            POTS: 8000,
          },
        },
        {
          address: '0x1',
          staked: '10',
          prizes: {
            CAKE: 928,
            POTS: 8000,
          },
        },
        {
          address: '0x2',
          staked: '1000',
          prizes: {
            CAKE: 928,
            POTS: 8000,
          },
        },
        {
          address: '0x3',
          staked: '10000',
          prizes: {
            CAKE: 928,
            POTS: 8000,
          },
        },
        {
          address: '0x4',
          staked: '100000',
          prizes: {
            CAKE: 928,
            POTS: 8000,
          },
        },
      ],
    },
  },
};

const prizeDrawsReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default prizeDrawsReducer;
