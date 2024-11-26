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
export function GetCardList(typesOne: string[], typesAll: string[]) {
  const cards = GetCards()
  const result: PlayerCard[] = []
  cards.forEach((item) => {
    if (
      (typesOne.length < 1 || item.Types.some((x) => typesOne.includes(x))) &&
      (typesAll.length < 1 || typesAll.every((t) => item.Types.includes(t)))
    ) {
      result.push(item)
    }
  })
  return result
}
export function GetRandomCards(cardList: PlayerCard[], cardAmount) {
  let n = cardAmount
  if (!n) n = 0
  const result = new Array(n)
  let len = cardList.length
  const taken = new Array(len)

  if (n > len) n = len
  if (n < 1) {
    return cardList.sort((a, b) => a.Name.localeCompare(b.Name))
  }
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
