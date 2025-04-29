import { Container, Heading, Stack } from "@chakra-ui/react"
import { useTheme } from "next-themes"

import { Radio, RadioGroup } from "@/components/ui/radio"
import { useTranslation } from 'react-i18next';

const Appearance = () => {
  const { theme, setTheme } = useTheme()
  const { t: tAdmin } = useTranslation('admin'); // 👈 tells i18next to use "admin.json"

  return (
    <>
      <Container maxW="full">
        <Heading size="sm" py={4}>
          {tAdmin('appearance')}
        </Heading>

        <RadioGroup
          onValueChange={(e) => setTheme(e.value)}
          value={theme}
          colorPalette="teal"
        >
          <Stack>
            <Radio value="system">{tAdmin('system')}</Radio>
            <Radio value="light">{tAdmin('light_mode')}</Radio>
            <Radio value="dark">{tAdmin('dark_mode')}</Radio>
          </Stack>
        </RadioGroup>
      </Container>
    </>
  )
}
export default Appearance
