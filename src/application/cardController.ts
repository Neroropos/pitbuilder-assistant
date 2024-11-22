import cardsJson from '../assets/Cards.json' assert { type: 'json' }
export function GetCardList(types: string[]) {
  const cards: PlayerCard[] = []
  const stringy = JSON.stringify(cardsJson)
  const classesFromJson = JSON.parse(stringy) as PlayerCard[]
  classesFromJson.forEach((element) => {
    cards.push(new PlayerCard(element))
  })
  const result: PlayerCard[] = []
  cards.forEach((item) => {
    if (item.Types.some((x) => types.includes(x))) {
      result.push(item)
    }
  })
  return result
}
export function GetCardTypes() {}
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
