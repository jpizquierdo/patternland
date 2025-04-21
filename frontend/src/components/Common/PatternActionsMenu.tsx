import { IconButton } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { MenuContent, MenuRoot, MenuTrigger } from "../ui/menu"
import { useQueryClient } from "@tanstack/react-query"
import type { PatternPublic } from "@/client"
import DeletePattern from "../Patterns/DeletePattern"
import EditPattern from "../Patterns/EditPattern"
import AddFiles from "../Patterns/AddFiles"
import PatternFilesView from "../Patterns/PatternFilesView"
import { useState } from "react"

import type { UserPublic } from "@/client"
interface PatternActionsMenuProps {
  pattern: PatternPublic
}

export const PatternActionsMenu = ({ pattern }: PatternActionsMenuProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient()
  // Get the current user from the query cache
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  return (
    <MenuRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
      <MenuTrigger asChild>
        <IconButton variant="ghost" color="inherit">
          <BsThreeDotsVertical />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        {/* Conditionally render AddFiles if the user has permissions */}
        {(currentUser?.is_superuser || currentUser?.id == pattern.owner_id) && (
          <AddFiles id={pattern.id} closeMenu={() => setOpen(false)} />
        )}
        <PatternFilesView pattern={pattern} closeMenu={() => setOpen(false)} />
        {/* Conditionally render EditPattern if the user has permissions */}
        {(currentUser?.is_superuser || currentUser?.id == pattern.owner_id) && (
          <EditPattern pattern={pattern} closeMenu={() => setOpen(false)} />
        )}
        {/* Conditionally render DeletePattern if the user has permissions */}
        {(currentUser?.is_superuser || currentUser?.id == pattern.owner_id) && (
          <DeletePattern id={pattern.id} />
        )}
      </MenuContent>
    </MenuRoot>
  )
}
