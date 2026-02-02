import cardsJson from '../assets/CardsNew.json' assert { type: 'json' }
//import cardsNewJson from '../assets/CardsNew.json' assert { type: 'json' }

function GetCards() {
  const cards: PlayerCard2[] = []
  const cardsFromJson = cardsJson as PlayerCard2[]
  cardsFromJson.forEach((element) => {
    cards.push(new PlayerCard2(element))
  })
  return cards
}
export function GetCardList(
  typesOne: string[] = [],
  typesAll: string[] = [],
  typesExcluded: string[] = [],
  cardName: string = ''
) {
  const cards = GetCards()
  return cards.filter(
    (item) =>
      (typesOne.length < 1 || item.Types.some((x) => typesOne.includes(x))) &&
      (typesAll.length < 1 || typesAll.every((t) => item.Types.includes(t))) &&
      (typesExcluded.length < 1 || !typesExcluded.some((t) => item.Types.includes(t))) &&
      item.Name.toLowerCase().includes(cardName.toLowerCase())
  )
}
export function GetCard(name: string) {
  const card = GetCards().filter((c) => c.Name == name)
  if (card.length != 1) return new PlayerCard2()
  else return card[0]
}
export function FindCardsByName(searchString: string) {
  return GetCards().filter((c) => c.Name.toLowerCase().includes(searchString.toLowerCase()))
}
export function GetRandomCards(cardList: PlayerCard2[], cardAmount) {
  let n = cardAmount
  let len = cardList.length
  if (!n) n = 0
  if (n > len) n = len
  if (n < 1) {
    return cardList.sort((a, b) => a.Name.localeCompare(b.Name))
  }
  const result = new Array(n)
  const taken = new Array(len)
  while (n--) {
    const x = Math.floor(Math.random() * len)
    result[n] = cardList[x in taken ? taken[x] : x]
    taken[x] = --len in taken ? taken[len] : len
  }
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
  return types.sort()
}
export class PlayerCard {
  Types: string[] = []
  Tags: string[] = []
  Cost: number | null = null
  Range: string = ''
  Text: string = ''
  Name: string = ''
  public constructor(init?: Partial<PlayerCard>) {
    Object.assign(this, init)
  }
}
export class PlayerCard2 {
  Types: string[] = []
  Tags: string[] = []
  Cost: string = ''
  Range: string = ''
  Text: string = ''
  Name: string = ''
  public constructor(init?: Partial<PlayerCard2>) {
    Object.assign(this, init)
  }
}
export class GroupedPlayerCard {
  Type: string = ''
  Values: PlayerCard2[] = []
  public constructor(init?: Partial<GroupedPlayerCard>) {
    Object.assign(this, init)
  }
}
