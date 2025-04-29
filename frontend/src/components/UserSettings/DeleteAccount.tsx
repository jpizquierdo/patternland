import { Container, Heading, Text } from "@chakra-ui/react"

import DeleteConfirmation from "./DeleteConfirmation"
import { useTranslation } from 'react-i18next';

const DeleteAccount = () => {
  const { t: tAdmin } = useTranslation('admin'); // 👈 tells i18next to use "admin.json"

  return (
    <Container maxW="full">
      <Heading size="sm" py={4}>
        {tAdmin("delete_account")}
      </Heading>
      <Text>
        {tAdmin("delete_account_description")}
      </Text>
      <DeleteConfirmation />
    </Container>
  )
}
export default DeleteAccount
