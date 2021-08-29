import { ApolloServer, gql } from 'apollo-server-micro'
import { PageConfig } from 'next';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { ServerResponse } from 'http';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import fetch from 'isomorphic-unfetch'


// A simple Graphql server that wrap the Board Game Geek JS API
import { parseBggXmlApi2SearchResponse, parseBggXmlApi2ThingResponse } from '@code-bucket/board-game-geek'

const typeDefs = gql`
  type BggLink {
    id: Int!
    type: String!
    value: String!
    inbound: Boolean
  }

  type BggName {
    value: String!
    type: String!
    sortindex: String
  }

  type BoardGame {
    id: Int!
    type: String!
    thumbnail: String!
    image: String!
    links: [BggLink]!
    names: [BggName]!
    yearpublished: Int!
    productcode: String!
    width: Float!
    length: Float!
    depth: Float!
    weight: Float!
  }

  type BggSearchResult {
      id: Int!
      type: String!
      name: String!
      nameType: String!
      yearpublished: Int!
  }

  type Query {
    sayHello: String
    getBoardGame(id: Int!): BoardGame
    searchBoardGames(query: String!): [BggSearchResult]
    hotGames: [BggSearchResult]
  }
`

const resolvers = {
  Query: {
    sayHello() {
      return "hello world"
    },

    async getBoardGame (parent, { id }, context, info) {
      const response = await fetch(`https://api.geekdo.com/xmlapi2/thing?id=${id}&versions=1`);
      const bggResponse = parseBggXmlApi2ThingResponse(await response.text());
      const thing = bggResponse.item;
      console.log(thing)

      return thing
    },

    async searchBoardGames (parent, { query }, context, info) {
      const response = await fetch(`https://api.geekdo.com/xmlapi2/search?query=${query}`);
      const bggResponse = parseBggXmlApi2SearchResponse(await response.text());
      const search = bggResponse.items;
      return search
    },

    async hotGames (parent, args, context, info) {
      const response = await fetch('https://api.geekdo.com/xmlapi2/hot?boardgame');
      const bggResponse = parseBggXmlApi2SearchResponse(await response.text());
      const search = bggResponse.items;
      return search
    }

  },
}


export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

const startServer = apolloServer.start();

export default async function handler(req: MicroRequest, res: ServerResponse) {
  await startServer;
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}