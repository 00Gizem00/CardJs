import { motion } from "framer-motion"
import FlashcardDeck from "./component/FlasCardDeck"


export default function App() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <FlashcardDeck />
    </div>
  )
}