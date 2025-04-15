import {
  Container,
  EmptyState,
  Flex,
  Heading,
  Table,
  VStack,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { FiSearch } from "react-icons/fi"
import { z } from "zod"

import { PatternsService } from "@/client"
import { PatternActionsMenu } from "@/components/Common/PatternActionsMenu"
import AddPattern from "@/components/Patterns/AddPattern"
import PendingPatterns from "@/components/Pending/PendingPatterns"
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination.tsx"

const patternsSearchSchema = z.object({
  page: z.number().catch(1),
})

const PER_PAGE = 5

function getPatternsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      PatternsService.readPatterns({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["patterns", { page }],
  }
}

export const Route = createFileRoute("/_layout/patterns")({
  component: Patterns,
  validateSearch: (search) => patternsSearchSchema.parse(search),
})

function PatternsTable() {
  const navigate = useNavigate({ from: Route.fullPath })
  const { page } = Route.useSearch()

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getPatternsQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  })

  const setPage = (page: number) =>
    navigate({
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    })

  const patterns = data?.data.slice(0, PER_PAGE) ?? []
  const count = data?.count ?? 0

  if (isLoading) {
    return <PendingPatterns />
  }

  if (patterns.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiSearch />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>You don't have any patterns yet</EmptyState.Title>
            <EmptyState.Description>
              Add a new pattern to get started
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return (
    <>
      <Table.Root size={{ base: "sm", md: "md" }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="sm">ID</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Title</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Description</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {patterns?.map((pattern) => (
            <Table.Row key={pattern.id} opacity={isPlaceholderData ? 0.5 : 1}>
              <Table.Cell truncate maxW="sm">
                {pattern.id}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {pattern.title}
              </Table.Cell>
              <Table.Cell
                color={!pattern.description ? "gray" : "inherit"}
                truncate
                maxW="30%"
              >
                {pattern.description || "N/A"}
              </Table.Cell>
              <Table.Cell>
                <PatternActionsMenu pattern={pattern} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Flex justifyContent="flex-end" mt={4}>
        <PaginationRoot
          count={count}
          pageSize={PER_PAGE}
          onPageChange={({ page }) => setPage(page)}
        >
          <Flex>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </Flex>
        </PaginationRoot>
      </Flex>
    </>
  )
}

function Patterns() {
  return (
    <Container maxW="full">
      <Heading size="lg" pt={12}>
        Patterns Management
      </Heading>
      <AddPattern />
      <PatternsTable />
    </Container>
  )
}
