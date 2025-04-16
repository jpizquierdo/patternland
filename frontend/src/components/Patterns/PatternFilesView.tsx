import {
    Button,
    ButtonGroup,
    DialogActionTrigger,
    Text,
    VStack,
    HStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { FaDownload } from "react-icons/fa"
import { saveAs } from "file-saver"

import {
    type PatternPublic,
    PatternsService,
    type PatternsDownloadFileData,
    OpenAPI
} from "@/client"
import { getHeaders } from "@/client/core/request"
import useCustomToast from "@/hooks/useCustomToast"
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


interface PatternFilesViewProps {
    pattern: PatternPublic
}

type PatternFilesForm = {}

const FILE_LABELS: Record<keyof PatternPublic, string> = {
    pattern_a0_file_id: "A0",
    pattern_a0_sa_file_id: "A0 SA",
    pattern_a0_sa_projector_file_id: "A0 SA Projector",
    pattern_a0_projector_file_id: "A0 Projector",
    pattern_a4_file_id: "A4",
    pattern_a4_sa_file_id: "A4 SA",
    pattern_instructables_file_id: "Instructables"
}

const PatternFilesView = ({ pattern }: PatternFilesViewProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const { showSuccessToast } = useCustomToast()
    const { handleSubmit } = useForm<PatternFilesForm>()

    const onSubmit: SubmitHandler<PatternFilesForm> = () => {
        // No-op, form isn't submitting anything
    }

    const handleDownload = async (filename: string) => {
        try {
            // TODO: investigate why this is not working, downloaded file were corrupted using automatic fetch from axios
            //const response = await PatternsService.downloadFile({ filename } as PatternsDownloadFileData)
            // //const blob = new Blob([response]) // Cast to make TS happy
            // const blob = response instanceof Blob ? response : new Blob([response]);
            // saveAs(blob, filename)
            // showSuccessToast("File downloaded.")

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
            saveAs(blob, filename);
            showSuccessToast("File downloaded.");
        } catch (error) {
            console.error("Download failed", error)
        }
    }

    const fileKeys = [
        "pattern_a0_file_id",
        "pattern_a0_sa_file_id",
        "pattern_a0_sa_projector_file_id",
        "pattern_a0_projector_file_id",
        "pattern_a4_file_id",
        "pattern_a4_sa_file_id",
        "pattern_instructables_file_id",
    ] as const

    return (
        <DialogRoot
            size={{ base: "xs", md: "md" }}
            placement="center"
            open={isOpen}
            onOpenChange={({ open }) => setIsOpen(open)}
        >
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <FaDownload fontSize="16px" />
                    View Files
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Pattern Files</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Text mb={4}>Click to download available files.</Text>
                        <VStack align="stretch" gap={3}>
                            {fileKeys.map((key) => {
                                const fileId = pattern[key]
                                const label = FILE_LABELS[key] || key

                                return (
                                    <HStack key={key} justifyContent="space-between">
                                        <Text>{label}</Text>
                                        {fileId ? (
                                            <Button
                                                size="sm"
                                                variant="outline"

                                                onClick={() => handleDownload(fileId)}
                                            >
                                                <FaDownload />
                                                Download
                                            </Button>
                                        ) : (
                                            <Text fontStyle="italic" color="gray.500">
                                                Not available
                                            </Text>
                                        )}
                                    </HStack>
                                )
                            })}
                        </VStack>
                    </DialogBody>

                    <DialogFooter gap={2}>
                        <ButtonGroup>
                            <DialogActionTrigger asChild>
                                <Button variant="subtle" colorPalette="gray">
                                    Close
                                </Button>
                            </DialogActionTrigger>
                        </ButtonGroup>
                    </DialogFooter>
                </form>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    )
}

export default PatternFilesView
