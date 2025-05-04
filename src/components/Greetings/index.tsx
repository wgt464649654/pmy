import { Button } from '../Button'
import { Container, Image, Text, Title } from './styles'

export function Greetings() {
  function handleSayHello() {
    window.Main.sendMessage('Hello World');

    console.log('Message sent! Check main process log in terminal.')
  }

  return (
    <Container>
      <Title>请选择接线柱数量</Title>
    </Container>
  )
}
 
