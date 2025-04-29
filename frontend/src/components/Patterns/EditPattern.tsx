import {
  Button,
  ButtonGroup,
  DialogActionTrigger,
  Input,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FaExchangeAlt } from "react-icons/fa"

import { type ApiError, type PatternPublic, PatternsService } from "@/client"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Field } from "../ui/field"
import { useTranslation } from 'react-i18next';

// Utility type: takes an array and gives you a union of its values
type ValueOfArray<T extends Readonly<any[]>> = T[number];


const brandOptions: PatternPublic["brand"][] = ["Fibre Mood", "Other", "Seamwork"]
const versionOptions: PatternPublic["version"][] = ["Paper", "Digital"]
const categoryOptions: PatternPublic["category"][] = ["Accessories", "Bags", "Blazers", "Bodywarmer", "Cardigans", "Coats", "DIY", "Dresses", "Hoodie", "Jackets", "Jumpers", "Jumpsuits", "Overalls", "Overshirt", "Pullovers", "Shirts", "Shorts", "Skirts", "Sweaters", "Swimwear", "T-shirts", "Tops", "Trousers", null]
const forWhoOptions: PatternPublic["for_who"][] = ["Baby", "Kids", "Men", "Women", "Pets", "Unisex"]
const difficultyOptions: PatternPublic["difficulty"][] = [1, 2, 3, 4, 5]
interface EditPatternProps {
  pattern: PatternPublic
  closeMenu?: () => void
}

interface PatternUpdateForm {
  title?: string
  description?: string | null
  brand?: ValueOfArray<typeof brandOptions> | null;
  version?: ValueOfArray<typeof versionOptions> | null;
  pattern_url?: string | null
  for_who?: ValueOfArray<typeof forWhoOptions> | null;
  category?: Exclude<ValueOfArray<typeof categoryOptions>, null> | null;//it is like that because categoryoptions has a null inside
  difficulty?: ValueOfArray<typeof difficultyOptions> | null;
  fabric?: string | null
  fabric_amount?: number | null;
}

const EditPattern = ({ pattern, closeMenu }: EditPatternProps) => {

  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatternUpdateForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      ...pattern,
      description: pattern.description ?? undefined,
      pattern_url: pattern.pattern_url ?? undefined,
      fabric: pattern.fabric ?? undefined,
      fabric_amount: pattern.fabric_amount ?? undefined,
      category: pattern.category ?? undefined,
      // if more nullable fields, normalize them here too
    },
  })
  const { t: tPattern } = useTranslation('pattern'); // 👈 tells i18next to use "pattern.json"
  const { t: tCommon } = useTranslation('common'); // 👈 tells i18next to use "common.json"
  const mutation = useMutation({
    mutationFn: (data: PatternUpdateForm) =>
      PatternsService.updatePattern({ id: pattern.id, requestBody: data }),
    onSuccess: () => {
      showSuccessToast(tPattern('pattern_edit_success'))
      reset()
      setIsOpen(false)
      closeMenu?.()
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["patterns"] })
    },
  })

  const onSubmit: SubmitHandler<PatternUpdateForm> = async (data) => {
    const processedData = {
      ...data,
      category: !data.category ? null : data.category, // Convert empty string to null
      description: data.description === "" ? null : data.description, // Convert empty string to null
      pattern_url: data.pattern_url === "" ? null : data.pattern_url, // Convert empty string to null
      fabric: data.fabric === "" ? null : data.fabric, // Convert empty string to null
      fabric_amount: !data.fabric_amount ? null : data.fabric_amount, // Convert empty string to null
    };
    mutation.mutate(processedData);
  }



  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => {
        setIsOpen(open);
        if (!open && closeMenu) closeMenu(); // Close action menu when dialog is closed
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">
          <FaExchangeAlt fontSize="16px" />
          {tPattern('edit_pattern')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{tPattern('edit_pattern')}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>{tPattern('edit_pattern_text')}</Text>
            <VStack gap={4}>
              <Field
                required
                invalid={!!errors.title}
                errorText={errors.title?.message}
                label={tPattern('title')}
              >
                <Input
                  id="title"
                  {...register("title", {
                    required: tPattern('title_required'),
                  })}
                  placeholder={tPattern('title')}
                  type="text"
                />
              </Field>

              <Field
                invalid={!!errors.description}
                errorText={errors.description?.message}
                label={tPattern('description')}
              >
                <Input
                  id="description"
                  {...register("description")}
                  placeholder={tPattern('description')}
                  type="text"
                />
              </Field>
              <HStack gap={2}>
                <Field
                  required
                  invalid={!!errors.version}
                  errorText={errors.version?.message}
                  label="Version"
                >
                  <select
                    id="version"
                    {...register("version")}
                    placeholder={tPattern('version_placeholder')}
                  >
                    <option value="" disabled>
                      {tPattern('version_placeholder')}
                    </option>
                    {versionOptions.map((option) => (
                      <option key={option} value={option}>
                        {tPattern(`version_categories.${option}`)} {/* Translate category */}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  required
                  invalid={!!errors.brand}
                  errorText={errors.brand?.message}
                  label={tPattern('brand')}
                >
                  <select
                    id="brand"
                    {...register("brand")}
                    placeholder={tPattern('brand_placeholder')}
                  >
                    <option value="" disabled>
                      {tPattern('brand_placeholder')}
                    </option>
                    {brandOptions.map((option) => (
                      <option key={option} value={option}>
                        {option === "Other"
                          ? tPattern('brand_null')
                          : option}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  //required
                  invalid={!!errors.category}
                  errorText={errors.category?.message}
                  label={tPattern('category')}
                >
                  <select
                    id="category"
                    {...register("category")}
                    placeholder={tPattern('category_placeholder')}
                  >
                    <option value="">
                      {tPattern('category_null')}
                    </option>
                    {categoryOptions.filter((option): option is Exclude<typeof option, null | undefined> => option !== null && option !== undefined).map((option) => (
                      <option key={option} value={option}>
                        {tPattern(`categories.${option}`)} {/* Translate category */}
                      </option>
                    ))}
                  </select>
                </Field>
              </HStack>
              <HStack gap={2}>
                <Field
                  required
                  invalid={!!errors.for_who}
                  errorText={errors.for_who?.message}
                  label={tPattern('for_who')}
                >
                  <select
                    id="for_who"
                    {...register("for_who")}
                    placeholder={tPattern('for_who')}
                  >
                    <option value="" disabled>
                      {tPattern('for_who')}
                    </option>
                    {forWhoOptions.map((option) => (
                      <option key={option} value={option}>
                        {tPattern(`for_who_categories.${option}`)} {/* Translate category */}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  required
                  invalid={!!errors.difficulty}
                  errorText={errors.difficulty?.message}
                  label={tPattern('difficulty')}
                >
                  <select
                    id="difficulty"
                    {...register("difficulty")}
                    placeholder={tPattern('difficulty_placeholder')}
                  >
                    <option value="" disabled>
                      {tPattern('difficulty_placeholder')}
                    </option>
                    {difficultyOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  invalid={!!errors.fabric}
                  errorText={errors.fabric?.message}
                  label={tPattern('fabric')}
                >
                  <Input
                    id="fabric"
                    {...register("fabric")}
                    placeholder={tPattern('fabric')}
                    type="text"
                  />
                </Field>
              </HStack>
              <Field
                invalid={!!errors.fabric_amount}
                errorText={errors.fabric_amount?.message}
                label={tPattern('min_fabric_amount')}
              >
                <Input
                  id="fabric_amount"
                  {...register("fabric_amount")}
                  placeholder={tPattern('min_fabric_amount')}
                  type="number"
                />
              </Field>
              <Field
                invalid={!!errors.pattern_url}
                errorText={errors.pattern_url?.message}
                label={tPattern('pattern_url')}
              >
                <Input
                  id="pattern_url"
                  {...register("pattern_url")}
                  placeholder={tPattern('pattern_url')}
                  type="url"
                />
              </Field>
            </VStack>
          </DialogBody>

          <DialogFooter gap={2}>
            <ButtonGroup>
              <DialogActionTrigger asChild>
                <Button
                  variant="subtle"
                  colorPalette="gray"
                  disabled={isSubmitting}
                >
                  {tCommon('cancel')}
                </Button>
              </DialogActionTrigger>
              <Button variant="solid" type="submit" loading={isSubmitting}>
                {tCommon('save')}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}

export default EditPattern
