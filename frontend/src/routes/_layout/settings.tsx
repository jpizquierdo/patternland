import { Container, Heading, Tabs, Spinner, Center } from "@chakra-ui/react"
import { Suspense } from "react"
import { createFileRoute } from "@tanstack/react-router"

import Appearance from "@/components/UserSettings/Appearance"
import ChangePassword from "@/components/UserSettings/ChangePassword"
import DeleteAccount from "@/components/UserSettings/DeleteAccount"
import UserInformation from "@/components/UserSettings/UserInformation"
import useAuth from "@/hooks/useAuth"
import { useTranslation } from 'react-i18next';



export const Route = createFileRoute("/_layout/settings")({
  component: () => (
    <Suspense fallback={
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    }>
      <UserSettings />
    </Suspense>
  ),
})

function UserSettings() {
  const { t: tAdmin, ready } = useTranslation('admin');
  if (!ready) {
    return (
      <Center minH="100vh">
        <Spinner size="lg" />
      </Center>
    )
  }
  const { t: tCommon } = useTranslation('common');

  const tabsConfig = [
    { value: "my-profile", title: tCommon('my_profile'), component: UserInformation },
    { value: "password", title: tAdmin('password'), component: ChangePassword },
    { value: "appearance", title: tAdmin('appearance'), component: Appearance },
    { value: "danger-zone", title: tAdmin('danger_zone'), component: DeleteAccount },
  ]
  const { user: currentUser } = useAuth()
  const finalTabs = currentUser?.is_superuser
    ? tabsConfig.slice(0, 3)
    : tabsConfig

  if (!currentUser) {
    return null
  }

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} py={12}>
        {tAdmin("user_settings")}
      </Heading>

      <Tabs.Root defaultValue="my-profile" variant="subtle">
        <Tabs.List>
          {finalTabs.map((tab) => (
            <Tabs.Trigger key={tab.value} value={tab.value}>
              {tab.title}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {finalTabs.map((tab) => (
          <Tabs.Content key={tab.value} value={tab.value}>
            <tab.component />
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Container>
  )
}
