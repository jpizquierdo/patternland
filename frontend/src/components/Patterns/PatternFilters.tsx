import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  VStack,
  Text,
  Separator,
} from "@chakra-ui/react"
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import { FiX } from "react-icons/fi"
import type { PatternsSearch } from "@/routes/_layout/patterns"

const CATEGORIES = [
  "Accessories", "Bags", "Blazers", "Bodywarmer", "Cardigans",
  "Coats", "DIY", "Dresses", "Hoodie", "Jackets", "Jumpers",
  "Jumpsuits", "Overalls", "Overshirt", "Pullovers", "Shirts",
  "Shorts", "Skirts", "Sweaters", "Swimwear", "T-shirts", "Tops", "Trousers",
] as const

const FOR_WHO = ["Women", "Men", "Kids", "Baby", "Unisex", "Pets"] as const
const BRANDS = ["Fibre Mood", "Seamwork", "Katia", "Burda", "Patrones", "Other"] as const
const VERSIONS = ["Paper", "Digital"] as const
const DIFFICULTIES = [1, 2, 3, 4, 5] as const

interface PatternFiltersProps {
  search: PatternsSearch
  onUpdate: (updates: Partial<PatternsSearch>) => void
}

function FilterSection({ labelKey, children }: { labelKey: string; children: ReactNode }) {
  const { t } = useTranslation("pattern")
  return (
    <Box>
      <Text
        fontWeight="semibold"
        fontSize="xs"
        textTransform="uppercase"
        letterSpacing="wide"
        mb={2}
        color="fg.muted"
      >
        {t(labelKey)}
      </Text>
      {children}
    </Box>
  )
}

export function PatternFilters({ search, onUpdate }: PatternFiltersProps) {
  const { t } = useTranslation("pattern")
  const [titleInput, setTitleInput] = useState(search.title ?? "")

  // Sync local input when URL changes externally (e.g. clear all)
  useEffect(() => {
    setTitleInput(search.title ?? "")
  }, [search.title])

  // Debounce title search — only fires when input differs from URL param
  useEffect(() => {
    const currentTitle = search.title ?? ""
    if (titleInput === currentTitle) return
    const timer = setTimeout(() => {
      onUpdate({ title: titleInput || undefined })
    }, 400)
    return () => clearTimeout(timer)
  }, [titleInput])

  const toggle = (key: keyof PatternsSearch, value: string | number) => {
    onUpdate({ [key]: search[key] === value ? undefined : value })
  }

  const clearAll = () => {
    setTitleInput("")
    onUpdate({
      title: undefined,
      brand: undefined,
      category: undefined,
      forWho: undefined,
      version: undefined,
      difficulty: undefined,
      selfPatterns: undefined,
    })
  }

  const hasActiveFilters = Boolean(
    search.title || search.brand || search.category ||
    search.forWho || search.version || search.difficulty || search.selfPatterns
  )

  return (
    <Box
      w="230px"
      minW="230px"
      flexShrink={0}
      pr={5}
      borderRight="1px solid"
      borderColor="border.muted"
    >
      <Flex justify="space-between" align="center" mb={5}>
        <Heading size="sm" textTransform="uppercase" letterSpacing="wider">
          {t("filters")}
        </Heading>
        {hasActiveFilters && (
          <Button size="xs" variant="ghost" color="fg.muted" onClick={clearAll} gap={1}>
            <FiX />
            {t("clear_filters")}
          </Button>
        )}
      </Flex>

      <VStack align="stretch" gap={4}>
        <FilterSection labelKey="title">
          <Input
            placeholder={t("search_placeholder")}
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            size="sm"
          />
        </FilterSection>

        <Separator />

        <Checkbox
          checked={search.selfPatterns ?? false}
          onCheckedChange={(e) =>
            onUpdate({ selfPatterns: e.checked === true ? true : undefined })
          }
          size="sm"
        >
          {t("my_patterns_only")}
        </Checkbox>

        <Separator />

        <FilterSection labelKey="for_who">
          <Flex wrap="wrap" gap={1.5}>
            {FOR_WHO.map((fw) => (
              <Button
                key={fw}
                size="xs"
                variant={search.forWho === fw ? "solid" : "outline"}
                colorPalette={search.forWho === fw ? "teal" : "gray"}
                onClick={() => toggle("forWho", fw)}
                borderRadius="full"
              >
                {t(`for_who_categories.${fw}`)}
              </Button>
            ))}
          </Flex>
        </FilterSection>

        <Separator />

        <FilterSection labelKey="category">
          <Flex wrap="wrap" gap={1.5}>
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                size="xs"
                variant={search.category === cat ? "solid" : "outline"}
                colorPalette={search.category === cat ? "teal" : "gray"}
                onClick={() => toggle("category", cat)}
                borderRadius="full"
              >
                {t(`categories.${cat}`)}
              </Button>
            ))}
          </Flex>
        </FilterSection>

        <Separator />

        <FilterSection labelKey="brand">
          <Flex wrap="wrap" gap={1.5}>
            {BRANDS.map((brand) => (
              <Button
                key={brand}
                size="xs"
                variant={search.brand === brand ? "solid" : "outline"}
                colorPalette={search.brand === brand ? "teal" : "gray"}
                onClick={() => toggle("brand", brand)}
                borderRadius="full"
              >
                {brand === "Other" ? t("brand_null") : brand}
              </Button>
            ))}
          </Flex>
        </FilterSection>

        <Separator />

        <FilterSection labelKey="version">
          <Flex wrap="wrap" gap={1.5}>
            {VERSIONS.map((ver) => (
              <Button
                key={ver}
                size="xs"
                variant={search.version === ver ? "solid" : "outline"}
                colorPalette={search.version === ver ? "teal" : "gray"}
                onClick={() => toggle("version", ver)}
                borderRadius="full"
              >
                {t(`version_categories.${ver}`)}
              </Button>
            ))}
          </Flex>
        </FilterSection>

        <Separator />

        <FilterSection labelKey="difficulty">
          <Flex gap={1.5}>
            {DIFFICULTIES.map((d) => (
              <Button
                key={d}
                size="xs"
                variant={search.difficulty === d ? "solid" : "outline"}
                colorPalette={search.difficulty === d ? "teal" : "gray"}
                onClick={() => toggle("difficulty", d)}
                borderRadius="full"
                minW="7"
              >
                {d}
              </Button>
            ))}
          </Flex>
        </FilterSection>
      </VStack>
    </Box>
  )
}
