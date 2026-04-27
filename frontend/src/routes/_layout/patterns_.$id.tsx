import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Link,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useState, Suspense } from "react"
import { FaArrowLeft, FaDownload, FaExternalLinkAlt, FaStar } from "react-icons/fa"
import { saveAs } from "file-saver"
import { useTranslation } from "react-i18next"

import { PatternsService, OpenAPI } from "@/client"
import { getHeaders } from "@/client/core/request"
import type { PatternPublic } from "@/client"
import useAuth from "@/hooks/useAuth"
import useCustomToast from "@/hooks/useCustomToast"
import AddFiles from "@/components/Patterns/AddFiles"
import EditPattern from "@/components/Patterns/EditPattern"
import DeletePattern from "@/components/Patterns/DeletePattern"
import placeholderImage from "/assets/images/favicon.webp"

export const Route = createFileRoute("/_layout/patterns/$id")({
  component: () => (
    <Suspense fallback={<Center minH="100vh"><Spinner size="xl" /></Center>}>
      <PatternDetail />
    </Suspense>
  ),
})

const FILE_KEYS: { key: keyof PatternPublic; labelKey: string }[] = [
  { key: "pattern_a0_file_id", labelKey: "A0" },
  { key: "pattern_a0_sa_file_id", labelKey: "A0 SA" },
  { key: "pattern_a0_sa_projector_file_id", labelKey: "A0 SA Projector" },
  { key: "pattern_a0_projector_file_id", labelKey: "A0 Projector" },
  { key: "pattern_a4_file_id", labelKey: "A4" },
  { key: "pattern_a4_sa_file_id", labelKey: "A4 SA" },
  { key: "pattern_instructables_file_id", labelKey: "instructables_file" },
]

function PatternDetail() {
  const { t } = useTranslation("pattern")
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const { showSuccessToast } = useCustomToast()

  const { data: pattern, isLoading } = useQuery({
    queryKey: ["pattern", id],
    queryFn: () => PatternsService.readPattern({ id }),
  })

  const handleDownload = async (filename: string) => {
    try {
      const headers = await getHeaders(OpenAPI, {
        method: "GET",
        url: "/api/v1/patterns/download/{filename}",
        path: { filename },
      })
      const baseUrl = OpenAPI.BASE
      const response = await fetch(
        `${baseUrl}/api/v1/patterns/download/${filename}`,
        { method: "GET", headers },
      )
      if (!response.ok) throw new Error(t("download_failed"))
      const blob = await response.blob()
      saveAs(blob, filename)
      showSuccessToast(t("file_downloaded"))
    } catch (error) {
      console.error(t("download_failed"), error)
    }
  }

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  if (!pattern) {
    return (
      <Container maxW="full" pt={12}>
        <Text mb={4}>{t("pattern_not_found")}</Text>
        <Button onClick={() => navigate({ to: "/patterns" })}>
          <FaArrowLeft />
          {t("back_to_patterns")}
        </Button>
      </Container>
    )
  }

  const isOwnerOrAdmin =
    currentUser?.is_superuser || currentUser?.id === pattern.owner_id

  return (
    <Container maxW="full">
      <Flex justify="space-between" align="center" pt={12} mb={8}>
        <Button variant="ghost" onClick={() => navigate({ to: "/patterns" })}>
          <FaArrowLeft />
          {t("back_to_patterns")}
        </Button>
        {isOwnerOrAdmin && (
          <HStack>
            <AddFiles id={pattern.id} />
            <EditPattern pattern={pattern} />
            <DeletePattern
              id={pattern.id}
              onSuccess={() => navigate({ to: "/patterns" })}
            />
          </HStack>
        )}
      </Flex>

      <Grid
        templateColumns={{ base: "1fr", md: "280px 1fr" }}
        gap={8}
        mb={10}
      >
        <GridItem>
          <PatternImage filename={pattern.icon ?? ""} alt={pattern.title} />
        </GridItem>
        <GridItem>
          <VStack align="start" gap={4}>
            <HStack flexWrap="wrap">
              <Heading size="xl">{pattern.title}</Heading>
              {currentUser?.id === pattern.owner_id && (
                <Badge colorScheme="teal">{t("my_pattern")}</Badge>
              )}
            </HStack>

            {pattern.description && (
              <Text color="gray.600">{pattern.description}</Text>
            )}

            <Grid
              templateColumns="auto 1fr"
              gap={3}
              w="full"
              alignItems="center"
            >
              <Text fontWeight="semibold">{t("brand")}:</Text>
              <Text>
                {pattern.brand === "Other" ? t("brand_null") : pattern.brand}
              </Text>

              <Text fontWeight="semibold">{t("version")}:</Text>
              <Text>{t(`version_categories.${pattern.version}`)}</Text>

              <Text fontWeight="semibold">{t("for_who")}:</Text>
              <Text>{t(`for_who_categories.${pattern.for_who}`)}</Text>

              {pattern.category && (
                <>
                  <Text fontWeight="semibold">{t("category")}:</Text>
                  <Text>{t(`categories.${pattern.category}`)}</Text>
                </>
              )}

              <Text fontWeight="semibold">{t("difficulty")}:</Text>
              <HStack>
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar
                    key={i}
                    color={i < pattern.difficulty ? "gold" : "lightgray"}
                  />
                ))}
              </HStack>

              {pattern.fabric && (
                <>
                  <Text fontWeight="semibold">{t("fabric")}:</Text>
                  <Text>{pattern.fabric}</Text>
                </>
              )}

              {pattern.fabric_amount != null && (
                <>
                  <Text fontWeight="semibold">{t("min_fabric_amount")}:</Text>
                  <Text>{pattern.fabric_amount}</Text>
                </>
              )}

              {pattern.pattern_url && (
                <>
                  <Text fontWeight="semibold">{t("pattern_url")}:</Text>
                  <Link
                    href={pattern.pattern_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="teal.500"
                  >
                    <HStack display="inline-flex" gap={1}>
                      <Text>{t("open_url")}</Text>
                      <FaExternalLinkAlt size={12} />
                    </HStack>
                  </Link>
                </>
              )}
            </Grid>
          </VStack>
        </GridItem>
      </Grid>

      <Box>
        <Heading size="md" mb={4}>
          {t("pattern_files")}
        </Heading>
        <Grid
          templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={3}
        >
          {FILE_KEYS.map(({ key, labelKey }) => {
            const fileId = pattern[key] as string | null | undefined
            const label = key === "pattern_instructables_file_id"
              ? t("instructables_file")
              : labelKey
            return (
              <Flex
                key={key}
                justify="space-between"
                align="center"
                p={3}
                borderWidth={1}
                borderRadius="md"
              >
                <Text fontWeight="medium">{label}</Text>
                {fileId ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(fileId)}
                  >
                    <FaDownload />
                    {t("download")}
                  </Button>
                ) : (
                  <Text fontStyle="italic" color="gray.500" fontSize="sm">
                    {t("not_available")}
                  </Text>
                )}
              </Flex>
            )
          })}
        </Grid>
      </Box>
    </Container>
  )
}

function PatternImage({ filename, alt }: { filename: string; alt: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!filename) return
    const fetchImage = async () => {
      try {
        const headers = await getHeaders(OpenAPI, {
          method: "GET",
          url: "/api/v1/patterns/download/{filename}",
          path: { filename },
        })
        const baseUrl = OpenAPI.BASE
        const response = await fetch(
          `${baseUrl}/api/v1/patterns/download/${filename}`,
          { method: "GET", headers },
        )
        if (!response.ok) throw new Error("Download failed")
        const blob = await response.blob()
        setImageUrl(URL.createObjectURL(blob))
      } catch (error) {
        console.error("Error loading image:", error)
      }
    }
    fetchImage()
  }, [filename])

  return (
    <Image
      src={imageUrl || placeholderImage}
      alt={alt}
      w="full"
      maxH="400px"
      objectFit="contain"
      borderRadius="md"
      borderWidth={1}
      p={2}
    />
  )
}
