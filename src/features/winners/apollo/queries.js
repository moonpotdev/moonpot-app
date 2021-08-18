import { gql } from '@apollo/client';

export const totalQuery = gql`
  query ($pools: [String!]) {
    prizePools(where: { id_in: $pools }) {
      totalAwards {
        token
        amount
      }
    }
  }
`;

export const drawsQuery = gql`
  query ($pools: [String!]) {
    prizePools(where: { id_in: $pools }) {
      id
      draws(orderBy: drawNumber, orderDirection: desc) {
        id
        drawNumber
        txHash
        block
        timestamp
        awards {
          token
          amount
        }
        winners {
          address
          balance
        }
      }
    }
  }
`;
