import {
    Button,
    DialogActionTrigger,
    Input,
    Text,
    VStack,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FaPlus } from "react-icons/fa"

import { type ApiError, type Body_patterns_upload_files, PatternsService } from "@/client"
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

const AddFiles = ({ id, closeMenu }: { id: string, closeMenu?: () => void }) => {
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
    const { t } = useTranslation('pattern'); // 👈 tells i18next to use "pattern.json"
    const mutation = useMutation({
        mutationFn: (data: Body_patterns_upload_files) =>
            PatternsService.uploadFiles({ formData: data }),
        onSuccess: () => {
            showSuccessToast(t('add_files_success'))
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

    const onSubmit: SubmitHandler<any> = (data) => {
        const payload: Body_patterns_upload_files = {
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

        mutation.mutate(payload)
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
                <Button variant="ghost" value="add-files">
                    <FaPlus fontSize="16px" />
                    {t('add_files')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{t('upload_files')}</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Text mb={4}>{t('upload_files_text')}</Text>
                        <VStack gap={4}>
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
                            {t('upload_files')}
                        </Button>
                    </DialogFooter>
                </form>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    )
}

export default AddFiles
