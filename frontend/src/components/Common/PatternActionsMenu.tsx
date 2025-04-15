import { IconButton } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { MenuContent, MenuRoot, MenuTrigger } from "../ui/menu"

import type { PatternPublic } from "@/client"
import DeletePattern from "../Patterns/DeletePattern"
import EditPattern from "../Patterns/EditPattern"
import AddFiles from "../Patterns/AddFiles"

interface PatternActionsMenuProps {
  pattern: PatternPublic
}

export const PatternActionsMenu = ({ pattern }: PatternActionsMenuProps) => {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton variant="ghost" color="inherit">
          <BsThreeDotsVertical />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        <AddFiles id={pattern.id} />
        <EditPattern pattern={pattern} />
        <DeletePattern id={pattern.id} />
      </MenuContent>
    </MenuRoot>
  )
}
