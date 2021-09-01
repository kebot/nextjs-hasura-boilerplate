import { Avatar, Box, HStack, VStack, Stack, Text } from '@chakra-ui/react'
import timeFromNow from 'lib/timeFromNow'
import React from 'react'

export default function SingleReview({
  review,
}: {
  review: {
    id?: number
    body?: string
    rating?: number
    author?: {
      name?: string
      image?: string
      email?: string
    }
    created_at?: string
  }
}) {
  const getRating = (rating: number) => {
    const STARS = ['☆☆☆☆☆', '★☆☆☆☆', '★★☆☆☆', '★★★☆☆', '★★★★☆', '★★★★★']
    return STARS[rating] || STARS[0]
  }

  return (
    <Box shadow='lg' rounded='lg'>
      <Stack spacing={0}>
        <Stack spacing={4} isInline alignItems='center' p={4} borderBottomWidth={1}>
          <Avatar name={review.author.name} src={review.author.image} />
          <Stack>
            <HStack>
              <Text fontWeight='bold'>{review.author.name}</Text>
              <Text>{getRating(review.rating)}</Text>
            </HStack>

            <Text>{timeFromNow(review.created_at)}</Text>
          </Stack>
        </Stack>
        <Text fontSize='md' p={4}>
          {review.body}
        </Text>
      </Stack>
    </Box>
  )
}
