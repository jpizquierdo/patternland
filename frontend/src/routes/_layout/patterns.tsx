import {
  Container,
  EmptyState,
  Flex,
  Heading,
  Table,
  VStack,
  Button,
  Image,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { FiSearch } from "react-icons/fi"
import { z } from "zod"
import { FaExternalLinkAlt } from "react-icons/fa";
import { PatternsService } from "@/client"
import { PatternActionsMenu } from "@/components/Common/PatternActionsMenu"
//import AddPattern from "@/components/Patterns/AddPattern"
import AddPatternAndFiles from "@/components/Patterns/AddPatternAndFiles"
import PendingPatterns from "@/components/Pending/PendingPatterns"
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination.tsx"
import placeholderImage from "/assets/images/favicon.webp";

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
            <Table.ColumnHeader w="sm">Icon</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Title</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Description</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Brand</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Category</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">For Who</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Version</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">URL</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Difficulty</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Fabric</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Fabric Amount [m]</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {patterns?.map((pattern) => (
            <Table.Row key={pattern.id} opacity={isPlaceholderData ? 0.5 : 1}>
              <Table.Cell truncate maxW="sm">
                <Image
                  src={pattern.icon || placeholderImage}
                  alt={pattern.title}
                  boxSize="90px"
                  objectFit="scale-down"
                  borderRadius="sm"
                ></Image>
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {pattern.title}
              </Table.Cell>
              <Table.Cell
                color={!pattern.description ? "gray" : "inherit"}
                truncate
                maxW="sm"
                whiteSpace="normal" // Allow text to wrap
              >
                {pattern.description || "N/A"}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {pattern.brand}
              </Table.Cell>
              <Table.Cell
                color={!pattern.description ? "gray" : "inherit"}
                truncate maxW="sm">
                {pattern.category || "N/A"}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {pattern.for_who}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {pattern.version}
              </Table.Cell>
              <Table.Cell
                color={!pattern.pattern_url ? "gray" : "inherit"}
                truncate maxW="sm">
                {pattern.pattern_url ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(pattern.pattern_url, "_blank")}
                  >
                    <FaExternalLinkAlt />
                  </Button>
                ) : (
                  "N/A"
                )}
              </Table.Cell>
              <Table.Cell
                color={!pattern.difficulty ? "gray" : "inherit"}
                truncate maxW="sm">
                {pattern.difficulty || "N/A"}
              </Table.Cell>
              <Table.Cell
                color={!pattern.fabric ? "gray" : "inherit"}
                truncate maxW="sm">
                {pattern.fabric || "N/A"}
              </Table.Cell>
              <Table.Cell
                color={!pattern.fabric_amount ? "gray" : "inherit"}
                truncate maxW="sm">
                {pattern.fabric_amount || "N/A"}
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
//      //<AddPattern />
function Patterns() {
  return (
    <Container maxW="full">
      <Heading size="lg" pt={12}>
        Patterns Management
      </Heading>

      <AddPatternAndFiles />
      <PatternsTable />
    </Container>
  )
}
