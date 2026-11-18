import { Button, type ButtonProps } from '@chakra-ui/react'

export function PrimaryButton(props: ButtonProps) {
  return (
    <Button
      bg="primary.soft"
      borderColor="primary.main"
      borderWidth="1px"
      color="primary.onSoft"
      fontWeight="semibold"
      transitionProperty="background-color, border-color, transform"
      transitionDuration="fast"
      _active={{
        bg: 'primary.soft',
        transform: 'translateY(1px)',
      }}
      _hover={{
        bg: 'accent.peach',
        borderColor: 'text.heading',
        color: 'accent.onPeach',
      }}
      {...props}
    />
  )
}
