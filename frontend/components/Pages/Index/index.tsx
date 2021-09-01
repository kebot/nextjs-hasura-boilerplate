import NextLink from 'next/link'
import React from 'react'
import { Link, Box, Badge, Image, Heading, SimpleGrid, Text, Stack } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'

import { useFetchHotGamesQuery } from 'generated-graphql'

const BoardGameCard = ({
  id,
  name,
  yearpublished,
}: {
  id: number
  name: string
  yearpublished: number
}) => {
  return (
    <Box w='100%' borderWidth='1px' borderRadius='sm' p={4}>
      {/* <Image src='https://via.placeholder.com/1000' alt='image' /> */}

      <Box d='flex' alignItems='baseline'>
        <NextLink href={`/games/${id}`}>
          <Link>{name}</Link>
        </NextLink>

        <Badge borderRadius='full' px='2' colorScheme='teal'>
          {yearpublished}
        </Badge>
      </Box>
    </Box>
  )
}

const HottestGames = () => {
  const query = useFetchHotGamesQuery()

  if (!query.data) {
    return <Spinner size='md' />
  }

  return (
    <SimpleGrid columns={1} spacing={2}>
      {query.data.hotGames.map((game) => (
        <BoardGameCard
          key={game.id}
          id={game.id}
          name={game.name}
          yearpublished={game.yearpublished}
        />
      ))}
    </SimpleGrid>
  )
}

const IndexPageComponent = () => {
  return (
    <div>
      <Heading textAlign='center'>Hottest Board Games</Heading>
      <HottestGames />
    </div>
  )
}

export default IndexPageComponent
