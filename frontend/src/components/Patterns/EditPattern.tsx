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

interface EditPatternProps {
  pattern: PatternPublic
}

interface PatternUpdateForm {
  title?: string
  description?: string
  brand?: string
  version?: string
  pattern_url?: string
  for_who?: string
  category?: string
  difficulty?: number
  fabric?: string
  fabric_amount?: number
}

const EditPattern = ({ pattern }: EditPatternProps) => {
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
    },
  })

  const mutation = useMutation({
    mutationFn: (data: PatternUpdateForm) =>
      PatternsService.updatePattern({ id: pattern.id, requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Pattern updated successfully.")
      reset()
      setIsOpen(false)
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
      category: data.category === "" ? null : data.category, // Convert empty string to null
      description: data.description === "" ? null : data.description, // Convert empty string to null
      pattern_url: data.pattern_url === "" ? null : data.pattern_url, // Convert empty string to null
      fabric: data.fabric === "" ? null : data.fabric, // Convert empty string to null
      fabric_amount: data.fabric_amount === "" ? null : data.fabric_amount, // Convert empty string to null
    };
    mutation.mutate(processedData);
  }

  const brandOptions: PatternPublic["brand"][] = ["Fibre Mood", "Other", "Seamwork"]
  const versionOptions: PatternPublic["version"][] = ["Paper", "Digital"]
  const categoryOptions: PatternPublic["category"][] = ["Accessories", "Bags", "Blazers", "Bodywarmer", "Cardigans", "Coats", "DIY", "Dresses", "Hoodie", "Jackets", "Jumpers", "Jumpsuits", "Overalls", "Overshirt", "Pullovers", "Shirts", "Shorts", "Skirts", "Sweaters", "Swimwear", "T-shirts", "Tops", "Trousers"]
  const forWhoOptions: PatternPublic["for_who"][] = ["Baby", "Kids", "Men", "Women", "Pets"]
  const difficultyOptions: PatternPublic["difficulty"][] = [1, 2, 3, 4, 5]

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">
          <FaExchangeAlt fontSize="16px" />
          Edit Pattern
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Pattern</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Update the pattern details below.</Text>
            <VStack gap={4}>
              <Field
                required
                invalid={!!errors.title}
                errorText={errors.title?.message}
                label="Title"
              >
                <Input
                  id="title"
                  {...register("title", {
                    required: "Title is required.",
                  })}
                  placeholder="Title"
                  type="text"
                />
              </Field>

              <Field
                invalid={!!errors.description}
                errorText={errors.description?.message}
                label="Description"
              >
                <Input
                  id="description"
                  {...register("description")}
                  placeholder="Description"
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
                    placeholder="Select a version"
                  >
                    <option value="" disabled>
                      Select a version
                    </option>
                    {versionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  required
                  invalid={!!errors.brand}
                  errorText={errors.brand?.message}
                  label="Brand"
                >
                  <select
                    id="brand"
                    {...register("brand")}
                    placeholder="Select a brand"
                  >
                    <option value="" disabled>
                      Select a brand
                    </option>
                    {brandOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  //required
                  invalid={!!errors.category}
                  errorText={errors.category?.message}
                  label="Category"
                >
                  <select
                    id="category"
                    {...register("category")}
                    placeholder="Select a category"
                  >
                    <option value="">
                      Other
                    </option>
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  required
                  invalid={!!errors.for_who}
                  errorText={errors.for_who?.message}
                  label="For Who"
                >
                  <select
                    id="for_who"
                    {...register("for_who")}
                    placeholder="For Who"
                  >
                    <option value="" disabled>
                      For Who
                    </option>
                    {forWhoOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>

              </HStack>
              <HStack gap={2}>
                <Field
                  required
                  invalid={!!errors.difficulty}
                  errorText={errors.difficulty?.message}
                  label="Difficulty"
                >
                  <select
                    id="difficulty"
                    {...register("difficulty")}
                    placeholder="Select a difficulty"
                  >
                    <option value="" disabled>
                      Select a difficulty
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
                  label="Fabric"
                >
                  <Input
                    id="fabric"
                    {...register("fabric")}
                    placeholder="fabric"
                    type="text"
                  />
                </Field>
                <Field
                  invalid={!!errors.fabric_amount}
                  errorText={errors.fabric_amount?.message}
                  label="Fabric Amount [m]"
                >
                  <Input
                    id="fabric_amount"
                    {...register("fabric_amount")}
                    placeholder="fabric_amount"
                    type="number"
                  />
                </Field>
              </HStack>
              <Field
                invalid={!!errors.pattern_url}
                errorText={errors.pattern_url?.message}
                label="Pattern URL"
              >
                <Input
                  id="pattern_url"
                  {...register("pattern_url")}
                  placeholder="pattern_url"
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
                  Cancel
                </Button>
              </DialogActionTrigger>
              <Button variant="solid" type="submit" loading={isSubmitting}>
                Save
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
