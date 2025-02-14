import { GetCard, PlayerCard } from './cardController'

export class PlayerCharacter {
  Name: string = ''
  WeaponOne: string | null = null
  WeaponTwo: string | null = null
  Bright: Number = 0
  Force: Number = 0
  Shadow: Number = 0
  Edge: Number = 0
  Brain: Number = 0
  Bodies: Number = 0
  Weeds: Number = 0
  Hymns: Number = 0
  Tools: Number = 0
  Courts: Number = 0
  Streets: Number = 0
  Battles: Number = 0
  Spells: Number = 0
  Element: string | null = null
  Background: string | null = null
  MaxHP: number = 10
  Heritage: string | null = null
  CardsInDeck: PlayerCard[] = []
  public constructor(init?: Partial<PlayerCharacter>) {
    Object.assign(this, init)
  }
  public fillBasicDeck() {
    const strikeCard = GetCard('Strike')
    const moveCard = GetCard('Move')
    const defendCard = GetCard('Defend')
    const woundCard = GetCard('Wound')
    const arr = [
      { item: strikeCard, amount: 3 },
      { item: moveCard, amount: 3 },
      { item: defendCard, amount: 3 },
      { item: woundCard, amount: 1 }
    ]
    arr.forEach((pair) => {
      for (let i = 0; i < pair.amount; i++) {
        this.CardsInDeck.push(pair.item)
      }
    })
  }
}
