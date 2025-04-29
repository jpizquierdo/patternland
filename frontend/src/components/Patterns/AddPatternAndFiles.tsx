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
    const { t: tPattern } = useTranslation('pattern'); // 👈 tells i18next to use "pattern.json"
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
            showSuccessToast(tPattern('files_upload_success'))
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
    //const { t: tPattern } = useTranslation('pattern'); // 👈 tells i18next to use "pattern.json"
    const { t: tCommon } = useTranslation('common'); // 👈 tells i18next to use "common.json"
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
                    {tPattern('add_pattern')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{tPattern('add_pattern')}</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Text mb={4}>{tPattern('pattern_create_text')}</Text>
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
                                                {option}
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
                                                {option}
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
                                                {option}
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
                            <Text mb={4}>{tPattern('upload_files_text')}</Text>
                            <Field
                                invalid={!!errors.icon}
                                errorText={errors.icon?.message}
                                label={tPattern('pattern_icon')}
                            >
                                <Input
                                    type="file"
                                    {...register("icon")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a0_file}
                                errorText={errors.pattern_a0_file?.message}
                                label={tPattern('pattern_a0_file')}
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a0_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a0_sa_file}
                                errorText={errors.pattern_a0_sa_file?.message}
                                label={tPattern('pattern_a0_sa_file')}
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a0_sa_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a0_sa_projector_file}
                                errorText={errors.pattern_a0_sa_projector_file?.message}
                                label={tPattern('pattern_a0_sa_projector_file')}
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a0_sa_projector_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a0_projector_file}
                                errorText={errors.pattern_a0_projector_file?.message}
                                label={tPattern('pattern_a0_projector_file')}
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a0_projector_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a4_file}
                                errorText={errors.pattern_a4_file?.message}
                                label={tPattern('pattern_a4_file')}
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a4_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a4_sa_file}
                                errorText={errors.pattern_a4_sa_file?.message}
                                label={tPattern('pattern_a4_sa_file')}
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a4_sa_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_instructables_file}
                                errorText={errors.pattern_instructables_file?.message}
                                label={tPattern('pattern_instructables_file')}
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
                                {tCommon('cancel')}
                            </Button>
                        </DialogActionTrigger>
                        <Button
                            variant="solid"
                            type="submit"
                            disabled={!isValid}
                            loading={isSubmitting}
                        >
                            {tCommon('save')}
                        </Button>
                    </DialogFooter>
                </form>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    )
}

export default AddPatternAndFiles
