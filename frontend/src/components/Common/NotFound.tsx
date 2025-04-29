import { Button, Center, Flex, Text, Spinner } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import { useTranslation } from 'react-i18next';
import { Suspense } from "react"

// --- Wrapped in Suspense boundary ---
const NotFound = () => (
  <Suspense fallback={
    <Center minH="100vh">
      <Spinner size="lg" />
    </Center>
  }>
    <NotFoundContent />
  </Suspense>
)

const NotFoundContent = () => {
  const { t } = useTranslation('common'); // 👈 tells i18next to use "common.json"
  return (
    <>
      <Flex
        height="100vh"
        align="center"
        justify="center"
        flexDir="column"
        data-testid="not-found"
        p={4}
      >
        <Flex alignItems="center" zIndex={1}>
          <Flex flexDir="column" ml={4} align="center" justify="center" p={4}>
            <Text
              fontSize={{ base: "6xl", md: "8xl" }}
              fontWeight="bold"
              lineHeight="1"
              mb={4}
            >
              404
            </Text>
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
              Oops!
            </Text>
          </Flex>
        </Flex>

        <Text
          fontSize="lg"
          color="gray.600"
          mb={4}
          textAlign="center"
          zIndex={1}
        >
          {t('not_found_text')}
        </Text>
        <Center zIndex={1}>
          <Link to="/">
            <Button
              variant="solid"
              colorScheme="teal"
              mt={4}
              alignSelf="center"
            >
              {t('go_back')}
            </Button>
          </Link>
        </Center>
      </Flex>
    </>
  )
}

export default NotFound
