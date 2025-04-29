import { Table } from "@chakra-ui/react"
import { SkeletonText } from "../ui/skeleton"
import { useTranslation } from 'react-i18next';



const PendingPatterns = () => {
  const { t: tPattern } = useTranslation('pattern'); // 👈 tells i18next to use "pattern.json"
  return (
    <Table.Root size={{ base: "sm", md: "md" }}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader w="sm">ID</Table.ColumnHeader>
          <Table.ColumnHeader w="sm">{tPattern('title')}</Table.ColumnHeader>
          <Table.ColumnHeader w="sm">{tPattern('description')}</Table.ColumnHeader>
          <Table.ColumnHeader w="sm">{tPattern('actions')}</Table.ColumnHeader>
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
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
export default PendingPatterns
