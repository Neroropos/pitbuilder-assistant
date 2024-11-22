import cardsJson from '../assets/Cards.json' assert { type: 'json' }
function GetCards() {
  const cards: PlayerCard[] = []
  const stringy = JSON.stringify(cardsJson)
  const cardsFromJson = JSON.parse(stringy) as PlayerCard[]
  cardsFromJson.forEach((element) => {
    cards.push(new PlayerCard(element))
  })
  return cards
}
export function GetCardList(types: string[]) {
  const cards = GetCards()
  const result: PlayerCard[] = []
  cards.forEach((item) => {
    if (item.Types.some((x) => types.includes(x))) {
      result.push(item)
    }
  })
  return result
}
export function GetCardTypes() {
  const cards = GetCards()
  const types: string[] = []
  cards.forEach((item) => {
    item.Types.forEach((type) => {
      if (!types.includes(type)) types.push(type)
    })
  })
  return types
}
export class PlayerCard {
  Types: string[] = []
  Cost: number | null = null
  Text: string = ''
  Name: string = ''
  public constructor(init?: Partial<PlayerCard>) {
    Object.assign(this, init)
  }
}
export class GroupedPlayerCard {
  Type: string = ''
  Values: PlayerCard[] = []
  public constructor(init?: Partial<GroupedPlayerCard>) {
    Object.assign(this, init)
  }
}
