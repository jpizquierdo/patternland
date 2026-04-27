import {
  Box,
  Container,
  EmptyState,
  Flex,
  Heading,
  Table,
  VStack,
  Image,
  Badge, Spinner, Center
} from "@chakra-ui/react"
import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { FiSearch } from "react-icons/fi"
import { z } from "zod"
import { PatternsService, OpenAPI } from "@/client"
import { getHeaders } from "@/client/core/request"
import { PatternActionsMenu } from "@/components/Common/PatternActionsMenu"
import AddPatternAndFiles from "@/components/Patterns/AddPatternAndFiles"
import { PatternFilters } from "@/components/Patterns/PatternFilters"
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
import { Suspense } from "react"

const patternsSearchSchema = z.object({
  page: z.number().catch(1),
  title: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  forWho: z.string().optional(),
  version: z.string().optional(),
  difficulty: z.number().optional(),
  selfPatterns: z.boolean().optional(),
})

export type PatternsSearch = z.infer<typeof patternsSearchSchema>

const PER_PAGE = 10

function getPatternsQueryOptions(search: PatternsSearch) {
  return {
    queryFn: () =>
      PatternsService.readPatterns({
        skip: (search.page - 1) * PER_PAGE,
        limit: PER_PAGE,
        title: search.title,
        brand: search.brand,
        category: search.category,
        forWho: search.forWho,
        version: search.version,
        difficulty: search.difficulty,
        selfPatterns: search.selfPatterns,
      }),
    queryKey: ["patterns", search],
  }
}

export const Route = createFileRoute("/_layout/patterns")({
  component: () => (
    <Suspense fallback={
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    }>
      <Patterns />
    </Suspense>
  ),
  validateSearch: (search) => patternsSearchSchema.parse(search),
})



function PatternsTable() {
  const { t, ready } = useTranslation('pattern');
  if (!ready) {
    return (
      <Center minH="100vh">
        <Spinner size="lg" />
      </Center>
    )
  }
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getPatternsQueryOptions(search),
    placeholderData: (prevData) => prevData,
  })

  const setPage = (page: number) =>
    navigate({
      search: (prev: PatternsSearch) => ({ ...prev, page }),
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
            <Table.ColumnHeader w="sm">{t('brand')}</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">{t('category')}</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">{t('for_who')}</Table.ColumnHeader>
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
                    {t('my_pattern')}
                  </Badge>
                )}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {pattern.brand === "Other"
                  ? t('brand_null')
                  : pattern.brand}
              </Table.Cell>
              <Table.Cell
                color={!pattern.category ? "gray" : "inherit"}
                truncate maxW="sm">
                {pattern.category
                  ? t(`categories.${pattern.category}`)
                  : "N/A"}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {t(`for_who_categories.${pattern.for_who}`)}
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

function Patterns() {
  const { t, ready } = useTranslation('pattern');
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()

  const handleFilterUpdate = (updates: Partial<PatternsSearch>) => {
    navigate({
      search: (prev: PatternsSearch) => ({ ...prev, ...updates, page: 1 }),
    })
  }

  if (!ready) {
    return (
      <Center minH="100vh">
        <Spinner size="lg" />
      </Center>
    )
  }

  return (
    <Container maxW="full">
      <Flex justify="space-between" align="center" pt={12} mb={6}>
        <Heading size="lg">
          {t('patterns_management')}
        </Heading>
        <AddPatternAndFiles />
      </Flex>
      <Flex gap={6} align="flex-start">
        <PatternFilters search={search} onUpdate={handleFilterUpdate} />
        <Box flex="1" minW={0}>
          <PatternsTable />
        </Box>
      </Flex>
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
      src={imageUrl || placeholderImage}
      alt={alt}
      boxSize="90px"
      objectFit="scale-down"
      borderRadius="sm"
    />
  );
};
