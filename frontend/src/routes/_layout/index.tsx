import { Box, Container, Text, Spinner, Center } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

import useAuth from "@/hooks/useAuth"
import { useTranslation } from 'react-i18next';
import { Suspense } from "react"
// export const Route = createFileRoute("/_layout/")({
//   component: Dashboard,
// })
export const Route = createFileRoute("/_layout/")({
  component: () => (
    <Suspense fallback={
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    }>
      <Dashboard />
    </Suspense>
  ),
})

function Dashboard() {
  const { user: currentUser } = useAuth()

  const { t: tCommon, ready } = useTranslation('common');
  if (!ready) {
    return (
      <Center minH="100vh">
        <Spinner size="lg" />
      </Center>
    )
  }
  return (
    <>
      <Container maxW="full">
        <Box pt={12} m={4}>
          <Text fontSize="2xl" truncate maxW="sm">
            {tCommon('hi')}{currentUser?.full_name || currentUser?.email} 👋🏼
          </Text>
          <Text>{tCommon('welcome_back')}</Text>
        </Box>
      </Container>
    </>
  )
}
