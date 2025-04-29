import { Table } from "@chakra-ui/react"
import { SkeletonText } from "../ui/skeleton"
import { useTranslation } from 'react-i18next';



const PendingUsers = () => {
  const { t: tAdmin } = useTranslation('admin'); // 👈 tells i18next to use "admin.json"
  return (
    <Table.Root size={{ base: "sm", md: "md" }}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader w="sm">{tAdmin('full_name')}</Table.ColumnHeader>
          <Table.ColumnHeader w="sm">Email</Table.ColumnHeader>
          <Table.ColumnHeader w="sm">{tAdmin('role')}</Table.ColumnHeader>
          <Table.ColumnHeader w="sm">{tAdmin('status')}</Table.ColumnHeader>
          <Table.ColumnHeader w="sm">{tAdmin('actions')}</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {[...Array(5)].map((_, index) => (
          <Table.Row key={index}>
            <Table.Cell>
              <SkeletonText noOfLines={1} />
            </Table.Cell>
            <Table.Cell>
              <SkeletonText noOfLines={1} />
            </Table.Cell>
            <Table.Cell>
              <SkeletonText noOfLines={1} />
            </Table.Cell>
            <Table.Cell>
              <SkeletonText noOfLines={1} />
            </Table.Cell>
            <Table.Cell>
              <SkeletonText noOfLines={1} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}

export default PendingUsers
