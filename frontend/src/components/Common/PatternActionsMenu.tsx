import { IconButton } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { MenuContent, MenuRoot, MenuTrigger } from "../ui/menu"

import type { PatternPublic } from "@/client"
import DeletePattern from "../Patterns/DeletePattern"
import EditPattern from "../Patterns/EditPattern"
import AddFiles from "../Patterns/AddFiles"
import PatternFilesView from "../Patterns/PatternFilesView"
import { useState } from "react"

interface PatternActionsMenuProps {
  pattern: PatternPublic
}

export const PatternActionsMenu = ({ pattern }: PatternActionsMenuProps) => {
  const [open, setOpen] = useState(false);
  return (
    <MenuRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
      <MenuTrigger asChild>
        <IconButton variant="ghost" color="inherit">
          <BsThreeDotsVertical />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        <AddFiles id={pattern.id} closeMenu={() => setOpen(false)} />
        <PatternFilesView pattern={pattern} closeMenu={() => setOpen(false)} />
        <EditPattern pattern={pattern} closeMenu={() => setOpen(false)} />
        <DeletePattern id={pattern.id} />
      </MenuContent>
    </MenuRoot>
  )
}
