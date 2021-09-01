import { useState, ChangeEvent } from 'react'
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/client'

import { useRouter } from 'next/router'
import {
  useFetchReviewQuery,
  useInsertReviewMutation,
  useFetchGameDetailsQuery,
  FetchGameDetailsDocument 
} from 'generated-graphql'

import {
  Select,
  Textarea,
  Button,
  SkeletonText,
  Image,
  Heading,
  Text,
  SimpleGrid,
  Box,
  Divider,
} from '@chakra-ui/react'

import SingleReview from 'components/Review/SingleReview'

import ISession from 'types/session'

const MyReview = ({ gameId, session }: { gameId: number; session: ISession }) => {
  const [body, setBody] = useState('')
  const [rating, setRating] = useState(0)

  const res = useFetchReviewQuery({ variables: { game_id: gameId, author_id: session.id } })
  const hasReviews = res.data?.reviews?.length > 0

  const [insertReview, insertReviewStatus] = useInsertReviewMutation({
    refetchQueries: [FetchGameDetailsDocument]
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log({ game_id: gameId, author_id: session.id, rating, body })
    await insertReview({ variables: { game_id: gameId, author_id: session.id, rating, body } })
    // refetch my review
    res.refetch()
  }

  if (hasReviews) {
    const myReview = res.data.reviews[0]
    return null
  }

  return (
    <form onSubmit={handleSubmit}>
      <Heading as='h3' size='md' >Write your review</Heading>
      <Select
        name='rating'
        placeholder='Choose your rating'
        value={rating}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setRating(parseInt(e.currentTarget.value, 10))
        }}
      >
        <option value='1'>★☆☆☆☆</option>
        <option value='2'>★★☆☆☆</option>
        <option value='3'>★★★☆☆</option>
        <option value='5'>★★★★☆</option>
        <option value='4'>★★★★★</option>
      </Select>
      <Textarea
        value={body}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBody(e.currentTarget.value)}
        name='body'
        placeholder='Say something'
      ></Textarea>
      <Button type='submit'>Post</Button>
    </form>
  )
}

const GameDetails = ({ id, session }: { id: number, session: ISession }) => {
  const { data } = useFetchGameDetailsQuery({ variables: { game_id: id } })

  if (!data) {
    return (
      <div>
        <SkeletonText height='20px' />
      </div>
    )
  }

  const {
    image,
    // thumbnail,
    // type,
    yearpublished,
    maxplayers,
    maxplaytime,
    minage,
    minplayers,
    minplaytime,
    // playingtime,
    description,
    names,
  } = data.getBoardGame

  const primaryName = names.find((config) => config.type === 'primary')

  return (
    <Box w='100%'>
      <SimpleGrid columns={[1, 2]} spacing={2}>
        <Image src={image} />
        <Box>
          <Heading>
            {primaryName.value} <small></small>{' '}
          </Heading>
          <Text>
            <b>Published:</b> {yearpublished}
          </Text>

          <Text>
            <b>Players: </b>
            {minplayers} - {maxplayers}
          </Text>

          <Text>
            <b>Playing time: </b>
            {minplaytime} - {maxplaytime} Min
          </Text>

          <Text>
            <b>Minage: </b>
            {minage}
          </Text>
          <Text>
            <b>Alternative Names: </b>
            {names
              .map((name) => {
                if (name.type !== 'primary') {
                  return name.value
                }
                return null
              })
              .filter(Boolean)
              .join(' / ')}
          </Text>
        </Box>
      </SimpleGrid>

      <Heading as='h2' size='lg'>
        Description:
      </Heading>
      <Text>{description}</Text>

      <Divider />

      <Heading as='h2' size='lg'>
        Reviews:
      </Heading>

      {session && <MyReview session={session} gameId={id} />}

      {data.reviews.map((review) => {
        return <SingleReview key={review.id} review={review} />
      })}
    </Box>
  )
}

const Game = ({ session }) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <Head>
        <title>{id} - Board Games</title>
      </Head>

      <GameDetails id={parseInt(id as string, 10)} session={session} />

    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  return {
    props: {
      session,
    },
  }
}

export default Game
