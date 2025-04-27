import {
  Container,
  EmptyState,
  Flex,
  Heading,
  Table,
  VStack,
  // Button,
  Image,
  Badge
} from "@chakra-ui/react"
import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { FiSearch } from "react-icons/fi"
import { z } from "zod"
// import { FaExternalLinkAlt } from "react-icons/fa";
import { PatternsService, OpenAPI } from "@/client"
import { getHeaders } from "@/client/core/request"
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
import { useQueryClient } from "@tanstack/react-query"
import type { UserPublic } from "@/client"
import { useTranslation } from 'react-i18next';

const patternsSearchSchema = z.object({
  page: z.number().catch(1),
})

const PER_PAGE = 10

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
  const queryClient = useQueryClient()
  // Get the current user from the query cache
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
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

  const { t } = useTranslation('pattern'); // 👈 tells i18next to use "pattern.json"

  if (patterns.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiSearch />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>{t('patterns_empty')}</EmptyState.Title>
            <EmptyState.Description>
              {t('patterns_empty_description')}
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
            <Table.ColumnHeader w="sm">{t('icon')}</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">{t('title')}</Table.ColumnHeader>
            {/* <Table.ColumnHeader w="sm">Description</Table.ColumnHeader> */}
            <Table.ColumnHeader w="sm">{t('brand')}</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">{t('category')}</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">{t('for_who')}</Table.ColumnHeader>
            {/* <Table.ColumnHeader w="sm">Version</Table.ColumnHeader> */}
            {/* <Table.ColumnHeader w="sm">URL</Table.ColumnHeader> */}
            {/* <Table.ColumnHeader w="sm">Difficulty</Table.ColumnHeader> */}
            {/* <Table.ColumnHeader w="sm">Fabric</Table.ColumnHeader> */}
            <Table.ColumnHeader w="sm">{t('min_fabric_amount')}</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">{t('actions')}</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {patterns?.map((pattern) => (
            <Table.Row key={pattern.id} opacity={isPlaceholderData ? 0.5 : 1}>
              <Table.Cell truncate maxW="sm">
                <IconImage filename={pattern.icon ?? ""} alt={pattern.title} />
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {pattern.title}
                {currentUser?.id === pattern.owner_id && (
                  <Badge ml="1" colorScheme="teal">
                    Yours
                  </Badge>
                )}
              </Table.Cell>
              {/* <Table.Cell
                color={!pattern.description ? "gray" : "inherit"}
                truncate
                maxW="sm"
                whiteSpace="normal" // Allow text to wrap
              >
                {pattern.description || "N/A"}
              </Table.Cell> */}
              <Table.Cell truncate maxW="sm">
                {pattern.brand}
              </Table.Cell>
              <Table.Cell
                color={!pattern.category ? "gray" : "inherit"}
                truncate maxW="sm">
                {pattern.category || "N/A"}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {pattern.for_who}
              </Table.Cell>
              {/* <Table.Cell truncate maxW="sm">
                {pattern.version}
              </Table.Cell>
              <Table.Cell
                color={!pattern.pattern_url ? "gray" : "inherit"}
                truncate maxW="sm">
                {pattern.pattern_url ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => pattern.pattern_url && window.open(pattern.pattern_url, "_blank")}
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
              </Table.Cell> */}
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
  const { t } = useTranslation('pattern'); // 👈 tells i18next to use "pattern.json"

  return (
    <Container maxW="full">
      <Heading size="lg" pt={12}>
        {t('patterns_management')}
      </Heading>

      <AddPatternAndFiles />
      <PatternsTable />
    </Container>
  )
}
const IconImage = ({ filename, alt }: { filename: string; alt: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (filename) {
        try {
          const headers = await getHeaders(OpenAPI, {
            method: "GET",
            url: "/api/v1/patterns/download/{filename}",
            path: { filename },
          })
          const baseUrl = OpenAPI.BASE
          const response = await fetch(`${baseUrl}/api/v1/patterns/download/${filename}`, {
            method: "GET",
            headers,
          })

          if (!response.ok) throw new Error("Download failed");

          const blob = await response.blob();
          const objectURL = URL.createObjectURL(blob);
          setImageUrl(objectURL);
        } catch (error) {
          console.error('Error loading image:', error);
        }
      }
    };

    fetchImage();
  }, [filename]);

  return (
    <Image
      src={imageUrl || placeholderImage} // fallback to placeholder if image is not loaded
      alt={alt}
      boxSize="90px"
      objectFit="scale-down"
      borderRadius="sm"
    />
  );
};
