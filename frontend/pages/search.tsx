import React from 'react'
import Head from 'next/head'
import { NextPage } from 'next'
import NextLink from 'next/link'

import { SearchIcon } from '@chakra-ui/icons'
import { Link, Skeleton, Stack, InputLeftElement, Input, InputGroup, Box } from '@chakra-ui/react'

import { useSearchBoardGamesQuery } from 'generated-graphql'

const IndexPage: NextPage = () => {
  const [query, setQuery] = React.useState('')
  const res = useSearchBoardGamesQuery({ variables: { query } })

  return (
    <>
      <Head>
        <title>Search - Board Games</title>
      </Head>

      <Stack spacing={4}>
        <InputGroup>
          <InputLeftElement pointerEvents='none' children={<SearchIcon color='gray.300' />} />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
            }}
            type='text'
            placeholder='Search Query'
          />
        </InputGroup>

        <Stack spacing={2}>
          {!res.data && (
            <>
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
            </>
          )}

          {res.data &&
            res.data.searchBoardGames.map((boardGame) => (
              <Box key={boardGame.id}>
                <NextLink href={`/games/${boardGame.id}`}>
                  <Link>{boardGame.name}</Link>
                </NextLink>
              </Box>
            ))}
        </Stack>
      </Stack>
    </>
  )
}

export default IndexPage
