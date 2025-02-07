export class CharMath {}
import classesJson from '../assets/Classes.json' assert { type: 'json' }
import templatesJson from '../assets/Templates.json' assert { type: 'json' }
import { escapeRegExp } from './func'

export function GetClassList() {
  const enemies: EnemyClass[] = []
  const classesFromJson = classesJson as unknown as EnemyClass[]
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
  result.forEach((gr) => {
    gr.Values.sort((a, b) => a.Name?.localeCompare(b.Name || '') || 0)
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

export class GroupedTemplate {
  Type: string = ''
  Values: EnemyTemplate[] = []
  public constructor(init?: Partial<GroupedTemplate>) {
    Object.assign(this, init)
  }
}

export function GetTemplateList() {
  const templates: EnemyTemplate[] = []
  const templatesFromJson = templatesJson as unknown as EnemyTemplate[]
  templatesFromJson.forEach((element) => {
    templates.push(new EnemyTemplate(element))
  })
  const result: GroupedTemplate[] = []
  templates.forEach((item) => {
    const arr = result.find((x) => x.Type == item.Type)
    if (arr) result.find((x) => x.Type == item.Type)?.Values.push(item)
    else {
      const newGroup = new GroupedTemplate({ Type: item.Type, Values: [item] })
      result.push(newGroup)
    }
  })
  result.forEach((gr) => {
    gr.Values.sort((a, b) => a.Name?.localeCompare(b.Name || '') || 0)
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
  Name: string = ''
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
  Type: string = ''
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

  replacePlaceholders(DefScaling: number, OffScaling: number, Text: string, Values: string[]) {
    let result = Text

    Values?.forEach((av, i) => {
      if (av.indexOf('PSTATK') < 0) {
        const newVal = av
          .replace(/DMG/g, this.DmgMod.toString())
          .replace(/BLK/g, this.BlockMod.toString())
          .replace(/MOV/g, this.MoveMod.toString())
          .replace(/DEF/g, DefScaling.toString())
          .replace(/OFF/g, OffScaling.toString())
          .replace(/TIR/g, this.Tier.toString())

        result = result.replace(
          new RegExp(escapeRegExp('{' + i + '}'), 'g'),
          eval(newVal).toString()
        )
      } else result = result.replace(new RegExp(escapeRegExp('{' + i + '}'), 'g'), this.PostAttack)
    })
    return result
  }
  update() {
    const DefScaling =
      this.Class?.DefScaling +
      this.Templates?.reduce((sum, current) => sum + current.DefScaling || 0, 0)
    this.HPMod =
      DefScaling * 7 + this.Templates?.reduce((sum, current) => sum + current.HpMod || 0, 0)
    this.HP = this.Tier * 10 + this.HPMod

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
      this.Templates?.reduce((sum, current) => sum + current.BlockMod || 0, 0) +
      (this.Tier - 1) * 2 +
      DefScaling * 2

    this.PostAttack = ''
    const PostAttacks = this.Class?.PostAttack.concat(
      this.Templates?.reduce((sum, current) => sum.concat(current.PostAttack), [] as PostAttack[])
    )
    PostAttacks.forEach((p) => {
      if (p.Text)
        this.PostAttack += this.replacePlaceholders(DefScaling, OffScaling, p.Text, p.Values) + ' '
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
        Text: this.replacePlaceholders(DefScaling, OffScaling, a.Text, a.Values)
      })
    })
    this.Passives = this.Class?.Passives.concat(
      this.Templates?.reduce((sum, current) => sum.concat(current.Passives), [] as Passive[])
    )
    if (this.Passives.find((x) => x.Name == 'Grunt')) {
      this.HP = 1
    }
    this.PassivesShown = []
    this.Passives.forEach((p) => {
      this.PassivesShown.push({
        Name: p.Name || '',
        Text: this.replacePlaceholders(DefScaling, OffScaling, p.Text, p.Values)
      })
    })
  }
}
