import { Box, Button, Flex, Text, Spinner, Center } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import { FaUserAstronaut } from "react-icons/fa"
import { FiLogOut, FiUser } from "react-icons/fi"

import useAuth from "@/hooks/useAuth"
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu"
import { Suspense } from "react"
import { useTranslation } from 'react-i18next';

// --- Wrapped in Suspense boundary ---
const UserMenu = () => (
  <Suspense fallback={
    <Center minH="100vh">
      <Spinner size="lg" />
    </Center>
  }>
    <UserMenuContent />
  </Suspense>
)

const UserMenuContent = () => {
  const { t: tCommon, ready } = useTranslation('common');
  if (!ready) {
    return (
      <Center minH="100vh">
        <Spinner size="lg" />
      </Center>
    )
  }
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    logout()
  }

  return (
    <>
      {/* Desktop */}
      <Flex>
        <MenuRoot>
          <MenuTrigger asChild p={2}>
            <Button data-testid="user-menu" variant="solid" maxW="sm" truncate>
              <FaUserAstronaut fontSize="18" />
              <Text>{user?.full_name || "User"}</Text>
            </Button>
          </MenuTrigger>

          <MenuContent>
            <Link to="settings">
              <MenuItem
                closeOnSelect
                value="user-settings"
                gap={2}
                py={2}
                style={{ cursor: "pointer" }}
              >
                <FiUser fontSize="18px" />
                <Box flex="1">{tCommon('my_profile')}</Box>
              </MenuItem>
            </Link>

            <MenuItem
              value="logout"
              gap={2}
              py={2}
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              <FiLogOut />
              Log Out
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </Flex>
    </>
  )
}

export default UserMenu
