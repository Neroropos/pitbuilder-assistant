export class CharMath {}
import classesJson from '../assets/Classes.json' assert { type: 'json' }
import templatesJson from '../assets/Templates.json' assert { type: 'json' }
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}
export function GetClassList() {
  const enemies: EnemyClass[] = []
  const stringy = JSON.stringify(classesJson)
  const classesFromJson = JSON.parse(stringy) as EnemyClass[]
  classesFromJson.forEach((element) => {
    enemies.push(new EnemyClass(element))
  })
  const result: GroupedClass[] = []
  enemies.forEach((item) => {
    const arr = result.find((x) => x.Type == item.Type)
    if (arr) result.find((x) => x.Type == item.Type)?.Values.push(item)
    else {
      const newGroup = new GroupedClass({ Type: item.Type, Values: [item] })
      result.push(newGroup)
    }
  })

  return result
}

export class GroupedClass {
  Type: string = ''
  Values: EnemyClass[] = []
  public constructor(init?: Partial<GroupedClass>) {
    Object.assign(this, init)
  }
}

export function GetTemplateList() {
  const result: EnemyTemplate[] = []
  const stringy = JSON.stringify(templatesJson)
  const templatesFromJson = JSON.parse(stringy) as EnemyTemplate[]
  templatesFromJson.forEach((element) => {
    result.push(new EnemyTemplate(element))
  })
  result.sort((a, b) => a.Name?.localeCompare(b.Name || '') || 0)
  return result
}
function replacePlaceholders(
  DmgMod: number,
  BlockMod: number,
  MoveMod: number,
  PostAttack: string,
  DefScaling: number,
  OffScaling: number,
  Tier: number,
  Text: string,
  Values: string[]
) {
  let result = Text
  //if (!Text) return ''
  Values?.forEach((av, i) => {
    if (av.indexOf('PSTATK') < 0) {
      const newVal = av
        .replace(/DMG/g, DmgMod.toString())
        .replace(/BLK/g, BlockMod.toString())
        .replace(/MOV/g, MoveMod.toString())
        .replace(/DEF/g, DefScaling.toString())
        .replace(/OFF/g, OffScaling.toString())
        .replace(/TIR/g, Tier.toString())

      result = result.replace(new RegExp(escapeRegExp('{' + i + '}'), 'g'), eval(newVal).toString())
    } else result = result.replace(new RegExp(escapeRegExp('{' + i + '}'), 'g'), PostAttack)
  })
  return result
}
export class Action {
  Name: string | null = null
  Text: string = ''
  Values: string[] = []
  public constructor(init?: Partial<Action>) {
    Object.assign(this, init)
  }
}
export class Passive {
  Name: string | null = null
  Text: string = ''
  Values: string[] = []
  public constructor(init?: Partial<Passive>) {
    Object.assign(this, init)
  }
}
export class PostAttack {
  Name: string | null = null
  Text: string = ''
  Values: string[] = []
  public constructor(init?: Partial<PostAttack>) {
    Object.assign(this, init)
  }
}
export class EnemyClass {
  Name: string = ''
  DefScaling: number | number = 1
  OffScaling: number | number = 1
  Actions: Action[] = []
  Passives: Passive[] = []
  Weaknesses: string[] = []
  Resistances: string[] = []
  PostAttack: PostAttack[] = []
  Type: string = ''
  HPBar: number = 0
  //Id!: number
  public constructor(init?: Partial<EnemyClass>) {
    this.Resistances = []
    this.Weaknesses = []
    Object.assign(this, init)
  }
}
export class EnemyTemplate {
  Name: string | null = null
  DefScaling: number = 0
  OffScaling: number = 0
  HpMod: number = 0
  DmgMod: number = 0
  MoveMod: number = 0
  BlockMod: number = 0
  Actions: Action[] = []
  Passives: Passive[] = []
  Weaknesses: string[] = []
  Resistances: string[] = []
  PostAttack: PostAttack[] = []
  HPBar: number = 0
  public constructor(init?: Partial<EnemyTemplate>) {
    Object.assign(this, init)
  }
}
export class Enemy {
  Tier: number | number = 1
  Name: string | null = null
  Class: EnemyClass | EnemyClass = new EnemyClass()
  Templates: EnemyTemplate[] = []

  HPMod: number = 0
  HP: number = 0
  DmgMod: number = 0
  MoveMod: number = 0
  BlockMod: number = 0
  Actions: Action[] = []
  ActionsShown: { Name: string; Text: string }[] = []
  PassivesShown: { Name: string; Text: string }[] = []
  ResistancesShown: string = ''
  WeaknessesShown: string = ''
  Passives: Passive[] = []
  PostAttack: string = ''
  HPBar: number = 1
  // changeClass(eclass: { value: EnemyClass }) {
  //   //this.Class = eclass.value
  //   this.update()
  // }
  // changeTemplates(templates: { value: EnemyTemplate[] }) {
  //   this.Templates = templates.value
  //   this.update()
  // }
  // changeTier(tier: { value: number }) {
  //   this.Tier = tier.value
  //   this.update()
  // }
  update() {
    const DefScaling =
      this.Class?.DefScaling +
      this.Templates?.reduce((sum, current) => sum + current.DefScaling || 0, 0)
    this.HPMod =
      DefScaling * 7 + this.Templates?.reduce((sum, current) => sum + current.HpMod || 0, 0)
    this.HP = (1 + this.Tier) * 5 + this.HPMod
    if (this.Templates.find((x) => x.Name == 'Grunt')) {
      this.HP = 1
    }

    const OffScaling =
      this.Class?.OffScaling +
      this.Templates?.reduce((sum, current) => sum + current.OffScaling || 0, 0)
    this.DmgMod =
      OffScaling * 2 +
      this.Templates?.reduce((sum, current) => sum + current.DmgMod || 0, 0) +
      (this.Tier - 1) * 2

    this.HPBar =
      1 + this.Class.HPBar + this.Templates?.reduce((sum, current) => sum + current.HPBar || 0, 0)
    this.MoveMod = this.Templates?.reduce((sum, current) => sum + current.MoveMod || 0, 0)

    this.BlockMod =
      this.Templates?.reduce((sum, current) => sum + current.BlockMod || 0, 0) + (this.Tier - 1) * 2

    this.PostAttack = ''
    const PostAttacks = this.Class?.PostAttack.concat(
      this.Templates?.reduce((sum, current) => sum.concat(current.PostAttack), [] as PostAttack[])
    )
    PostAttacks.forEach((p) => {
      if (p.Text)
        this.PostAttack +=
          replacePlaceholders(
            this.DmgMod,
            this.BlockMod,
            this.MoveMod,
            this.PostAttack,
            DefScaling,
            OffScaling,
            this.Tier,
            p.Text,
            p.Values
          ) + ' '
    })
    const Resistances = this.Class?.Resistances.concat(
      this.Templates?.reduce((sum, current) => sum.concat(current.Resistances), [] as string[])
    )
    const Weaknesses = this.Class?.Weaknesses.concat(
      this.Templates?.reduce((sum, current) => sum.concat(current.Weaknesses), [] as string[])
    )
    const ResistancesFiltered = Resistances.filter((x) => !Weaknesses.find((y) => y == x)).filter(
      (value, index, array) => array.indexOf(value) === index
    )
    const WeaknessesFiltered = Weaknesses.filter((x) => !Resistances.find((y) => y == x)).filter(
      (value, index, array) => array.indexOf(value) === index
    )
    this.ResistancesShown = ResistancesFiltered.sort((a, b) => a.localeCompare(b)).join(', ')
    this.WeaknessesShown = WeaknessesFiltered.sort((a, b) => a.localeCompare(b)).join(', ')
    this.Actions = this.Class?.Actions.concat(
      this.Templates?.reduce((sum, current) => sum.concat(current.Actions), [] as Action[])
    )
    this.ActionsShown = []
    this.Actions.forEach((a) => {
      this.ActionsShown.push({
        Name: a.Name || '',
        Text: replacePlaceholders(
          this.DmgMod,
          this.BlockMod,
          this.MoveMod,
          this.PostAttack,
          DefScaling,
          OffScaling,
          this.Tier,
          a.Text,
          a.Values
        )
      })
    })
    this.Passives = this.Class?.Passives.concat(
      this.Templates?.reduce((sum, current) => sum.concat(current.Passives), [] as Passive[])
    )
    this.PassivesShown = []
    this.Passives.forEach((p) => {
      this.PassivesShown.push({
        Name: p.Name || '',
        Text: replacePlaceholders(
          this.DmgMod,
          this.BlockMod,
          this.MoveMod,
          this.PostAttack,
          DefScaling,
          OffScaling,
          this.Tier,
          p.Text,
          p.Values
        )
      })
    })
  }
}
