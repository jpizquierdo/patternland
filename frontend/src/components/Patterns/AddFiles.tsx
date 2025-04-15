import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"

import {
    Button,
    DialogActionTrigger,
    DialogTitle,
    Input,
    Text,
    VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"

import { type Body_patterns_upload_files, PatternsService } from "@/client"
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

const AddFiles = ({ id }: { id: string }) => {
    const [isOpen, setIsOpen] = useState(false)
    const queryClient = useQueryClient()
    const { showSuccessToast } = useCustomToast()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting },
    } = useForm<Body_patterns_upload_files>({
        mode: "onBlur",
        criteriaMode: "all",
    })

    const mutation = useMutation({
        mutationFn: (data: Body_patterns_upload_files) =>
            PatternsService.uploadFiles({ formData: data }),
        onSuccess: () => {
            showSuccessToast("Pattern files successfully uploaded.")
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

    const onSubmit: SubmitHandler<Body_patterns_upload_files> = (data) => {
        const payload: Body_patterns_upload_files = {
            id,
            pattern_a0_file: data.pattern_a0_file?.[0] || null,
            pattern_a0_sa_file: data.pattern_a0_sa_file?.[0] || null,
            pattern_a0_sa_projector_file: data.pattern_a0_sa_projector_file?.[0] || null,
            pattern_a0_projector_file: data.pattern_a0_projector_file?.[0] || null,
            pattern_a4_file: data.pattern_a4_file?.[0] || null,
            pattern_a4_sa_file: data.pattern_a4_sa_file?.[0] || null,
            pattern_instructables_file: data.pattern_instructables_file?.[0] || null,
        }

        mutation.mutate(payload)
    }

    return (
        <DialogRoot
            size={{ base: "xs", md: "md" }}
            placement="center"
            open={isOpen}
            onOpenChange={({ open }) => setIsOpen(open)}
        >
            <DialogTrigger asChild>
                <Button value="add-files" my={4}>
                    <FaPlus fontSize="16px" />
                    Add Files
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Upload Files</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Text mb={4}>Select files to upload for the pattern.</Text>
                        <VStack gap={4}>
                            <Field
                                invalid={!!errors.pattern_a0_file}
                                errorText={errors.pattern_a0_file?.message}
                                label="Pattern A0 File"
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a0_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a0_sa_file}
                                errorText={errors.pattern_a0_sa_file?.message}
                                label="Pattern A0 SA File"
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a0_sa_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a0_sa_projector_file}
                                errorText={errors.pattern_a0_sa_projector_file?.message}
                                label="Pattern A0 SA Projector File"
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a0_sa_projector_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a0_projector_file}
                                errorText={errors.pattern_a0_projector_file?.message}
                                label="Pattern A0 Projector File"
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a0_projector_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a4_file}
                                errorText={errors.pattern_a4_file?.message}
                                label="Pattern A4 File"
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a4_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_a4_sa_file}
                                errorText={errors.pattern_a4_sa_file?.message}
                                label="Pattern A4 SA File"
                            >
                                <Input
                                    type="file"
                                    {...register("pattern_a4_sa_file")}
                                />
                            </Field>
                            <Field
                                invalid={!!errors.pattern_instructables_file}
                                errorText={errors.pattern_instructables_file?.message}
                                label="Pattern Instructables File"
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
                                Cancel
                            </Button>
                        </DialogActionTrigger>
                        <Button
                            variant="solid"
                            type="submit"
                            disabled={!isValid}
                            loading={isSubmitting}
                        >
                            Upload
                        </Button>
                    </DialogFooter>
                </form>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    )
}

export default AddFiles
