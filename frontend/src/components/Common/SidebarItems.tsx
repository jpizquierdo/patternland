import { Box, Flex, Icon, Text } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { Link as RouterLink } from "@tanstack/react-router"
import { FiHome, FiSettings, FiUsers } from "react-icons/fi"
import { GiSewingMachine } from "react-icons/gi";
import type { IconType } from "react-icons/lib"

import type { UserPublic } from "@/client"
import { useTranslation } from 'react-i18next';


interface SidebarItemsProps {
  onClose?: () => void
}

interface Item {
  icon: IconType
  title: string
  path: string
}

const SidebarItems = ({ onClose }: SidebarItemsProps) => {
  const { t: tAdmin } = useTranslation('admin'); // 👈 tells i18next to use "admin.json"
  const { t: tPattern } = useTranslation('pattern'); // 👈 tells i18next to use "common.json"
  const items = [
    { icon: FiHome, title: "Dashboard", path: "/" },
    { icon: GiSewingMachine, title: tPattern('patterns'), path: "/patterns" },
    { icon: FiSettings, title: tAdmin('user_settings'), path: "/settings" },
  ]
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])

  const finalItems: Item[] = currentUser?.is_superuser
    ? [...items, { icon: FiUsers, title: "Admin", path: "/admin" }]
    : items

  const listItems = finalItems.map(({ icon, title, path }) => (
    <RouterLink key={title} to={path} onClick={onClose}>
      <Flex
        gap={4}
        px={4}
        py={2}
        _hover={{
          background: "gray.subtle",
        }}
        alignItems="center"
        fontSize="md"
      >
        <Icon as={icon} alignSelf="center" boxSize={6} />
        <Text ml={2}>{title}</Text>
      </Flex>
    </RouterLink>
  ))

  return (
    <>
      <Text fontSize="md" px={4} py={2} fontWeight="bold">
        Menu
      </Text>
      <Box>{listItems}</Box>
    </>
  )
}

export default SidebarItems
