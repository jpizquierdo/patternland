import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"

import {
    Button,
    DialogActionTrigger,
    DialogTitle,
    Input,
    Text,
    VStack,
    HStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"

import { type PatternCreate, Body_patterns_upload_files, PatternsService } from "@/client"
import type { ApiError } from "@/client/core/ApiError"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import {
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTrigger,
} from "../ui/dialog"
import { Field } from "../ui/field"
import { useTranslation } from 'react-i18next';

const AddPatternAndFiles = () => {
    const [isOpen, setIsOpen] = useState(false)
    const queryClient = useQueryClient()
    const { showSuccessToast } = useCustomToast()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting },
    } = useForm<ExtendedFormValues>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            title: "",
            description: "",
            for_who: "Women",
            version: "Digital",
        },
    })

    const mutation = useMutation({
        mutationFn: async (data: ExtendedFormValues) => {
            // Step 1: Create the pattern
            const created = await PatternsService.createPattern({ requestBody: data })
            const id = created.id
            // Step 2: Upload the files
            const filePayload: Body_patterns_upload_files = {
                id,
                pattern_a0_file: data.pattern_a0_file?.[0] || null,
                pattern_a0_sa_file: data.pattern_a0_sa_file?.[0] || null,
                pattern_a0_sa_projector_file: data.pattern_a0_sa_projector_file?.[0] || null,
                pattern_a0_projector_file: data.pattern_a0_projector_file?.[0] || null,
                pattern_a4_file: data.pattern_a4_file?.[0] || null,
                pattern_a4_sa_file: data.pattern_a4_sa_file?.[0] || null,
                pattern_instructables_file: data.pattern_instructables_file?.[0] || null,
                icon: data.icon?.[0] || null,
            }

            await PatternsService.uploadFiles({ formData: filePayload })
            return created
        },
        onSuccess: () => {
            showSuccessToast("Pattern and files uploaded successfully.")
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

    const onSubmit: SubmitHandler<PatternCreate> = (data) => {
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
    const brandOptions: PatternCreate["brand"][] = ["Fibre Mood", "Other", "Seamwork"]
    const versionOptions: PatternCreate["version"][] = ["Paper", "Digital"]
    const categoryOptions: PatternCreate["category"][] = ["Accessories", "Bags", "Blazers", "Bodywarmer", "Cardigans", "Coats", "DIY", "Dresses", "Hoodie", "Jackets", "Jumpers", "Jumpsuits", "Overalls", "Overshirt", "Pullovers", "Shirts", "Shorts", "Skirts", "Sweaters", "Swimwear", "T-shirts", "Tops", "Trousers", null]
    const forWhoOptions: PatternCreate["for_who"][] = ["Baby", "Kids", "Men", "Women", "Pets"]
    const difficultyOptions: PatternCreate["difficulty"][] = [1, 2, 3, 4, 5]
    type ExtendedFormValues = PatternCreate & {
        pattern_a0_file?: FileList
        pattern_a0_sa_file?: FileList
        pattern_a0_sa_projector_file?: FileList
        pattern_a0_projector_file?: FileList
        pattern_a4_file?: FileList
        pattern_a4_sa_file?: FileList
        pattern_instructables_file?: FileList
        icon?: FileList
    }
    const { t } = useTranslation('pattern'); // 👈 tells i18next to use "pattern.json"
    return (
        <DialogRoot
            size={{ base: "xs", md: "md" }}
            placement="center"
            open={isOpen}
            onOpenChange={({ open }) => setIsOpen(open)}
        >
            <DialogTrigger asChild>
                <Button value="add-pattern" my={4}>
                    <FaPlus fontSize="16px" />
                    {t('add_pattern')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{t('add_pattern')}</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Text mb={4}>{t('pattern_create_text')}</Text>
                        <VStack gap={4}>
                            <Field
                                required
                                invalid={!!errors.title}
                                errorText={errors.title?.message}
                                label={t('title')}
                            >
                                <Input
                                    id="title"
                                    {...register("title", {
                                        required: "Title is required.",
                                    })}
                                    placeholder={t('title')}
                                    type="text"
                                />
                            </Field>

                            <Field
                                invalid={!!errors.description}
                                errorText={errors.description?.message}
                                label={t('description')}
                            >
                                <Input
                                    id="description"
                                    {...register("description")}
                                    placeholder={t('description')}
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
                                            {t('version_placeholder')}
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
                                    label={t('brand')}
                                >
                                    <select
                                        id="brand"
                                        {...register("brand")}
                                        placeholder={t('brand_placeholder')}
                                    >
                                        <option value="" disabled>
                                            {t('brand_placeholder')}
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
                                    label={t('category')}
                                >
                                    <select
                                        id="category"
                                        {...register("category")}
                                        placeholder={t('category_placeholder')}
                                    >
                                        <option value="">
                                            {t('category_null')}
                                        </option>
                                        {categoryOptions.filter((option): option is Exclude<typeof option, null | undefined> => option !== null && option !== undefined).map((option) => (
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
                                    invalid={!!errors.for_who}
                                    errorText={errors.for_who?.message}
                                    label={t('for_who')}
                                >
                                    <select
                                        id="for_who"
                                        {...register("for_who")}
                                        placeholder={t('for_who')}
                                    >
                                        <option value="" disabled>
                                            {t('for_who')}
                                        </option>
                                        {forWhoOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field
                                    required
                                    invalid={!!errors.difficulty}
                                    errorText={errors.difficulty?.message}
                                    label={t('difficulty')}
                                >
                                    <select
                                        id="difficulty"
                                        {...register("difficulty")}
                                        placeholder={t('difficulty_placeholder')}
                                    >
                                        <option value="" disabled>
                                            {t('difficulty_placeholder')}
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
                                    label={t('fabric')}
                                >
                                    <Input
                                        id="fabric"
                                        {...register("fabric")}
                                        placeholder={t('fabric')}
                                        type="text"
                                    />
                                </Field>
                            </HStack>
                            <Field
                                invalid={!!errors.fabric_amount}
                                errorText={errors.fabric_amount?.message}
                                label={t('min_fabric_amount')}
                            >
                                <Input
                                    id="fabric_amount"
                                    {...register("fabric_amount")}
                                    placeholder={t('min_fabric_amount')}
                                    type="number"
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_url}
                                errorText={errors.pattern_url?.message}
                                label={t('pattern_url')}
                            >
                                <Input
                                    id="pattern_url"
                                    {...register("pattern_url")}
                                    placeholder={t('pattern_url')}
                                    type="url"
                                />
                            </Field>
                            <Text mb={4}>{t('upload_files_text')}</Text>
                            <Field
                                invalid={!!errors.icon}
                                errorText={errors.icon?.message}
                                label={t('pattern_icon')}
                            >
                                <Input
                                    type="file"
                                    {...register("icon")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a0_file}
                                errorText={errors.pattern_a0_file?.message}
                                label={t('pattern_a0_file')}
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a0_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a0_sa_file}
                                errorText={errors.pattern_a0_sa_file?.message}
                                label={t('pattern_a0_sa_file')}
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a0_sa_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a0_sa_projector_file}
                                errorText={errors.pattern_a0_sa_projector_file?.message}
                                label={t('pattern_a0_sa_projector_file')}
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a0_sa_projector_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a0_projector_file}
                                errorText={errors.pattern_a0_projector_file?.message}
                                label={t('pattern_a0_projector_file')}
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a0_projector_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a4_file}
                                errorText={errors.pattern_a4_file?.message}
                                label={t('pattern_a4_file')}
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a4_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a4_sa_file}
                                errorText={errors.pattern_a4_sa_file?.message}
                                label={t('pattern_a4_sa_file')}
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a4_sa_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_instructables_file}
                                errorText={errors.pattern_instructables_file?.message}
                                label={t('pattern_instructables_file')}
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_instructables_file")}
                                />
                            </Field>
                        </VStack>
                    </DialogBody>

                    <DialogFooter gap={2}>
                        <DialogActionTrigger asChild>
                            <Button
                                variant="subtle"
                                colorPalette="gray"
                                disabled={isSubmitting}
                            >
                                {t('cancel')}
                            </Button>
                        </DialogActionTrigger>
                        <Button
                            variant="solid"
                            type="submit"
                            disabled={!isValid}
                            loading={isSubmitting}
                        >
                            {t('save')}
                        </Button>
                    </DialogFooter>
                </form>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    )
}

export default AddPatternAndFiles
